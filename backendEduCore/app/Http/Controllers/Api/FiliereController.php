<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Filiere;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FiliereController extends Controller
{
    public function index()
    {
        return response()->json(Filiere::with('groupes')->get());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom'         => 'required|string|max:150',
            'code'        => 'required|string|unique:filieres',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $filiere = Filiere::create($request->all());
        return response()->json($filiere, 201);
    }

    public function show(Filiere $filiere)
    {
        return response()->json($filiere->load('groupes', 'modules'));
    }

    public function update(Request $request, Filiere $filiere)
    {
        $filiere->update($request->only('nom', 'code', 'description'));
        return response()->json($filiere);
    }

    public function destroy(Filiere $filiere)
    {
        $filiere->delete();
        return response()->json(['message' => 'Filière supprimée']);
    }
}
