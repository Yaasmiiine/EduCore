<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Groupe;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class GroupeController extends Controller
{
    public function index()
    {
        return response()->json(Groupe::with('filiere')->get());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'filiere_id' => 'required|exists:filieres,id',
            'nom'        => 'required|string|max:100',
            'annee'      => 'required|integer|in:1,2',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $groupe = Groupe::create($request->all());
        return response()->json($groupe->load('filiere'), 201);
    }

    public function show(Groupe $groupe)
    {
        return response()->json($groupe->load('filiere', 'emploisDuTemps.module', 'emploisDuTemps.formateur'));
    }

    public function update(Request $request, Groupe $groupe)
    {
        $groupe->update($request->only('filiere_id', 'nom', 'annee'));
        return response()->json($groupe->load('filiere'));
    }

    public function destroy(Groupe $groupe)
    {
        $groupe->delete();
        return response()->json(['message' => 'Groupe supprimé']);
    }
}
