<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Salle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SalleController extends Controller
{
    public function index()
    {
        return response()->json(Salle::all());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom'        => 'required|string|max:150',
            'code'       => 'required|string|unique:salles',
            'batiment'   => 'nullable|string|max:100',
            'capacite'   => 'required|integer|min:1',
            'equipement' => 'nullable|string|max:255',
            'statut'     => 'sometimes|in:disponible,occupee,maintenance',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $salle = Salle::create($request->all());
        return response()->json($salle, 201);
    }

    public function show(Salle $salle)
    {
        return response()->json($salle->load('emploisDuTemps'));
    }

    public function update(Request $request, Salle $salle)
    {
        $validator = Validator::make($request->all(), [
            'nom'        => 'sometimes|string|max:150',
            'code'       => 'sometimes|string|unique:salles,code,' . $salle->id,
            'batiment'   => 'nullable|string|max:100',
            'capacite'   => 'sometimes|integer|min:1',
            'equipement' => 'nullable|string|max:255',
            'statut'     => 'sometimes|in:disponible,occupee,maintenance',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $salle->update($request->only('nom', 'code', 'batiment', 'capacite', 'equipement', 'statut'));
        return response()->json($salle);
    }

    public function destroy(Salle $salle)
    {
        $salle->delete();
        return response()->json(['message' => 'Salle supprimée']);
    }
}
