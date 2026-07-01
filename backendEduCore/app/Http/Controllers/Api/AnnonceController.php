<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Annonce;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AnnonceController extends Controller
{
    public function index()
    {
        $annonces = Annonce::with('auteur', 'groupe')
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($annonces);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'titre'    => 'required|string|max:200',
            'contenu'  => 'required|string',
            'priorite' => 'sometimes|in:normale,importante,urgente',
            'groupe_id'=> 'nullable|exists:groupes,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $annonce = Annonce::create([
            'auteur_id' => auth('api')->id(),
            'groupe_id' => $request->groupe_id,
            'titre'     => $request->titre,
            'contenu'   => $request->contenu,
            'priorite'  => $request->priorite ?? 'normale',
        ]);

        return response()->json($annonce->load('auteur', 'groupe'), 201);
    }

    public function show(Annonce $annonce)
    {
        return response()->json($annonce->load('auteur', 'groupe'));
    }

    public function update(Request $request, Annonce $annonce)
    {
        $this->authorize('update', $annonce); // only owner or admin
        $annonce->update($request->only('titre', 'contenu', 'priorite', 'groupe_id'));
        return response()->json($annonce->load('auteur', 'groupe'));
    }

    public function destroy(Annonce $annonce)
    {
        $this->authorize('delete', $annonce);
        $annonce->delete();
        return response()->json(['message' => 'Annonce supprimée']);
    }
}
