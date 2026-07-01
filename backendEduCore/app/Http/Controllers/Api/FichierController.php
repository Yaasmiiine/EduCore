<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Fichier;
use App\Services\GeminiClient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Throwable;

class FichierController extends Controller
{
    public function index(Request $request)
    {
        $query = Fichier::with('module', 'user');

        if ($request->has('module_id')) {
            $query->where('module_id', $request->module_id);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'module_id' => 'required|exists:modules,id',
            'fichier'   => 'required|file|max:20480|mimes:pdf,doc,docx,ppt,pptx,xls,xlsx',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $file = $request->file('fichier');
        $path = $file->store('fichiers', 'public');

        $fichier = Fichier::create([
            'module_id' => $request->module_id,
            'user_id'   => auth('api')->id(),
            'nom'       => $file->getClientOriginalName(),
            'chemin'    => $path,
            'type'      => $file->getClientOriginalExtension(),
            'taille'    => $file->getSize(),
        ]);

        return response()->json($fichier->load('module', 'user'), 201);
    }

    public function show(Fichier $fichier)
    {
        return response()->json($fichier->load('module', 'user'));
    }

    public function destroy(Fichier $fichier)
    {
        Storage::disk('public')->delete($fichier->chemin);
        $fichier->delete();
        return response()->json(['message' => 'Fichier supprimé']);
    }

    // POST /api/fichiers/{id}/resume  — AI summary via Gemini
    public function resumeIA(Fichier $fichier, GeminiClient $gemini)
    {
        $prompt = "Le fichier suivant s'appelle : \"{$fichier->nom}\" et appartient à un module de formation. "
            . "Génère un résumé structuré en 3-5 points clés en français, adapté pour des stagiaires.";

        try {
            $resume = $gemini->generate(
                $prompt,
                "Tu es un assistant pédagogique pour un établissement de formation."
            );
        } catch (Throwable $e) {
            return response()->json(['message' => 'Erreur lors de la génération du résumé'], 500);
        }

        $fichier->update(['resume_ia' => $resume]);

        return response()->json(['resume_ia' => $resume]);
    }
}
