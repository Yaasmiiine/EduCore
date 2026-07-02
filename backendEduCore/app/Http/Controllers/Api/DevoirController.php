<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Devoir;
use App\Models\Module;
use App\Models\Soumission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class DevoirController extends Controller
{
    // GET /api/devoirs — optionally scoped with ?module_id=X (checked against
    // the caller's role); without it, defaults to "my own" devoirs for a
    // formateur, or "my filière's" devoirs for a stagiaire.
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Devoir::with('module', 'groupe');

        if ($request->filled('module_id')) {
            $module = Module::findOrFail($request->module_id);

            $allowed = $user->isAdmin()
                || ($user->isFormateur() && $module->formateur_id === $user->id)
                || ($user->isStagiaire() && $user->groupe?->filiere_id === $module->filiere_id);

            if (! $allowed) {
                return response()->json(['message' => 'Non autorisé'], 403);
            }

            $query->where('module_id', $module->id);
        } elseif ($user->isFormateur()) {
            $query->where('formateur_id', $user->id);
        } elseif ($user->isStagiaire()) {
            $filiereId = $user->groupe?->filiere_id;
            $query->whereHas('module', fn ($q) => $q->where('filiere_id', $filiereId));
        }

        // A devoir with a groupe_id targets only that class; null means the
        // whole filière. A stagiaire only ever sees devoirs meant for them.
        if ($user->isStagiaire()) {
            $query->where(function ($q) use ($user) {
                $q->whereNull('groupe_id')->orWhere('groupe_id', $user->groupe_id);
            });
        }

        $devoirs = $query->orderByDesc('date_limite')->get();

        if ($user->isStagiaire()) {
            $mesSoumissions = Soumission::where('user_id', $user->id)
                ->whereIn('devoir_id', $devoirs->pluck('id'))
                ->get()
                ->keyBy('devoir_id');

            $devoirs->each(function ($devoir) use ($mesSoumissions) {
                $devoir->ma_soumission = $mesSoumissions->get($devoir->id);
            });
        } else {
            $devoirs->loadCount('soumissions');
        }

        return response()->json($devoirs);
    }

    // POST /api/devoirs — formateur (own module) or admin. groupe_id is
    // optional: leaving it out targets every groupe of the module's filière.
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'module_id'   => 'required|exists:modules,id',
            'groupe_id'   => 'nullable|exists:groupes,id',
            'titre'       => 'required|string|max:150',
            'description' => 'nullable|string',
            'date_limite' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $module = Module::findOrFail($request->module_id);
        $user = $request->user();

        if (! $user->isAdmin() && $module->formateur_id !== $user->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $devoir = Devoir::create([
            'module_id'    => $module->id,
            'groupe_id'    => $request->groupe_id,
            'formateur_id' => $user->id,
            'titre'        => $request->titre,
            'description'  => $request->description,
            'date_limite'  => $request->date_limite,
        ]);

        return response()->json($devoir->load('module', 'groupe'), 201);
    }

    public function update(Request $request, Devoir $devoir)
    {
        $user = $request->user();
        if (! $user->isAdmin() && $devoir->formateur_id !== $user->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $validator = Validator::make($request->all(), [
            'titre'       => 'sometimes|string|max:150',
            'description' => 'nullable|string',
            'date_limite' => 'sometimes|date',
            'groupe_id'   => 'sometimes|nullable|exists:groupes,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $devoir->update($request->only('titre', 'description', 'date_limite', 'groupe_id'));

        return response()->json($devoir->load('module', 'groupe'));
    }

    public function destroy(Request $request, Devoir $devoir)
    {
        $user = $request->user();
        if (! $user->isAdmin() && $devoir->formateur_id !== $user->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        foreach ($devoir->soumissions as $soumission) {
            Storage::disk('public')->delete($soumission->fichier);
        }

        $devoir->delete();

        return response()->json(['message' => 'Devoir supprimé']);
    }
}
