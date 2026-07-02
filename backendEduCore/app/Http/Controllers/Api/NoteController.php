<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\Note;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NoteController extends Controller
{
    // GET /api/notes?module_id=X — formateur (own module) or admin: grade-entry list.
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'module_id' => 'required|exists:modules,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $module = Module::findOrFail($request->module_id);
        $user = $request->user();

        if (! $user->isAdmin() && $module->formateur_id !== $user->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $notes = Note::with('stagiaire')
            ->where('module_id', $module->id)
            ->orderByDesc('date_evaluation')
            ->get();

        return response()->json($notes);
    }

    // GET /api/bulletin — the authenticated stagiaire's own grades, grouped by module.
    public function bulletin(Request $request)
    {
        $notes = Note::with('module.filiere')
            ->where('user_id', $request->user()->id)
            ->get();

        return response()->json($this->buildBulletin($notes));
    }

    private function buildBulletin($notes)
    {
        $modules = $notes->groupBy('module_id')->map(function ($group) {
            $totalCoef = $group->sum('coefficient');
            $moyenne = $totalCoef > 0
                ? round($group->sum(fn ($n) => $n->valeur * $n->coefficient) / $totalCoef, 2)
                : null;

            return [
                'module'  => $group->first()->module,
                'notes'   => $group->sortByDesc('date_evaluation')->values(),
                'moyenne' => $moyenne,
            ];
        })->values();

        $withMoyenne = $modules->filter(fn ($m) => $m['moyenne'] !== null);

        return [
            'modules'          => $modules,
            'moyenne_generale' => $withMoyenne->count() ? round($withMoyenne->avg('moyenne'), 2) : null,
        ];
    }

    // POST /api/notes — formateur (own module) or admin.
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id'         => 'required|exists:users,id',
            'module_id'       => 'required|exists:modules,id',
            'type'            => 'required|string|max:50',
            'valeur'          => 'required|numeric|min:0|max:20',
            'coefficient'     => 'nullable|numeric|min:0.1|max:10',
            'commentaire'     => 'nullable|string',
            'date_evaluation' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $module = Module::findOrFail($request->module_id);
        $user = $request->user();

        if (! $user->isAdmin() && $module->formateur_id !== $user->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $student = User::findOrFail($request->user_id);
        if (! $student->isStagiaire() || $student->groupe?->filiere_id !== $module->filiere_id) {
            return response()->json(['message' => "Cet étudiant n'appartient pas à la filière de ce module."], 422);
        }

        $note = Note::create([
            'user_id'         => $student->id,
            'module_id'       => $module->id,
            'formateur_id'    => $user->id,
            'type'            => $request->type,
            'valeur'          => $request->valeur,
            'coefficient'     => $request->input('coefficient', 1),
            'commentaire'     => $request->commentaire,
            'date_evaluation' => $request->date_evaluation,
        ]);

        return response()->json($note->load('stagiaire'), 201);
    }

    // PUT /api/notes/{note}
    public function update(Request $request, Note $note)
    {
        $user = $request->user();
        if (! $user->isAdmin() && $note->formateur_id !== $user->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $validator = Validator::make($request->all(), [
            'type'            => 'sometimes|string|max:50',
            'valeur'          => 'sometimes|numeric|min:0|max:20',
            'coefficient'     => 'sometimes|numeric|min:0.1|max:10',
            'commentaire'     => 'nullable|string',
            'date_evaluation' => 'sometimes|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $note->update($request->only('type', 'valeur', 'coefficient', 'commentaire', 'date_evaluation'));

        return response()->json($note->load('stagiaire'));
    }

    // DELETE /api/notes/{note}
    public function destroy(Request $request, Note $note)
    {
        $user = $request->user();
        if (! $user->isAdmin() && $note->formateur_id !== $user->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $note->delete();

        return response()->json(['message' => 'Note supprimée']);
    }
}
