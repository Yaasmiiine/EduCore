<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Devoir;
use App\Models\Soumission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class SoumissionController extends Controller
{
    // GET /api/devoirs/{devoir}/soumissions — formateur (own module) or admin.
    public function index(Request $request, Devoir $devoir)
    {
        $user = $request->user();
        if (! $user->isAdmin() && $devoir->formateur_id !== $user->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        return response()->json(
            $devoir->soumissions()->with('stagiaire.groupe')->orderByDesc('created_at')->get()
        );
    }

    // POST /api/devoirs/{devoir}/soumissions — stagiaire only, own filière
    // (and own groupe when the devoir targets a specific one), before the
    // deadline. Re-submitting replaces the previous file.
    public function store(Request $request, Devoir $devoir)
    {
        $user = $request->user();

        $eligible = $user->isStagiaire()
            && $user->groupe?->filiere_id === $devoir->module->filiere_id
            && ($devoir->groupe_id === null || $devoir->groupe_id === $user->groupe_id);

        if (! $eligible) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        if (now()->greaterThan($devoir->date_limite)) {
            return response()->json(['message' => 'La date limite de ce devoir est dépassée.'], 422);
        }

        $validator = Validator::make($request->all(), [
            'fichier' => 'required|file|max:20480',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $existing = Soumission::where('devoir_id', $devoir->id)->where('user_id', $user->id)->first();
        if ($existing) {
            Storage::disk('public')->delete($existing->fichier);
        }

        $file = $request->file('fichier');
        $path = $file->store('soumissions', 'public');

        $soumission = Soumission::updateOrCreate(
            ['devoir_id' => $devoir->id, 'user_id' => $user->id],
            [
                'fichier'     => $path,
                'nom_fichier' => $file->getClientOriginalName(),
                'taille'      => $file->getSize(),
            ]
        );

        return response()->json($soumission, $existing ? 200 : 201);
    }

    // GET /api/soumissions/{soumission}/download
    public function download(Request $request, Soumission $soumission)
    {
        $user = $request->user();
        $devoir = $soumission->devoir;

        $allowed = $user->isAdmin()
            || ($user->isFormateur() && $devoir->formateur_id === $user->id)
            || ($user->isStagiaire() && $soumission->user_id === $user->id);

        if (! $allowed) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        if (! Storage::disk('public')->exists($soumission->fichier)) {
            return response()->json(['message' => 'Fichier introuvable sur le serveur.'], 404);
        }

        return Storage::disk('public')->response($soumission->fichier, $soumission->nom_fichier);
    }
}
