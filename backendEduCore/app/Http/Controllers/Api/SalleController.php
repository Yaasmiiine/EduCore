<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Salle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SalleController extends Controller
{
    // Paginated (and searchable/filterable) only when a `page` param is sent —
    // Schedule/Génération IA rely on the full unpaginated list to build their
    // salle dropdowns, so that behavior stays unchanged by default.
    public function index(Request $request)
    {
        $query = Salle::query();

        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        if ($request->filled('statut')) {
            $query->where('statut', $request->string('statut'));
        }

        if ($request->filled('batiment')) {
            $query->where('batiment', $request->string('batiment'));
        }

        if ($request->has('page')) {
            return response()->json($query->paginate($request->integer('per_page', 10)));
        }

        return response()->json($query->get());
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
