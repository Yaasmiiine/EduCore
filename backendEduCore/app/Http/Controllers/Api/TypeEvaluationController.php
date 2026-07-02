<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TypeEvaluation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TypeEvaluationController extends Controller
{
    // GET /api/types-evaluation — every authenticated user reads (the
    // formateur's Notes page needs it to populate the "Type" dropdown).
    public function index()
    {
        return response()->json(TypeEvaluation::orderBy('nom')->get());
    }

    // POST /api/types-evaluation — admin only.
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom'                => 'required|string|max:50|unique:types_evaluation',
            'coefficient_defaut' => 'required|numeric|min:0.1|max:10',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $type = TypeEvaluation::create($request->only('nom', 'coefficient_defaut'));

        return response()->json($type, 201);
    }

    public function update(Request $request, TypeEvaluation $typeEvaluation)
    {
        $validator = Validator::make($request->all(), [
            'nom'                => 'sometimes|string|max:50|unique:types_evaluation,nom,' . $typeEvaluation->id,
            'coefficient_defaut' => 'sometimes|numeric|min:0.1|max:10',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $typeEvaluation->update($request->only('nom', 'coefficient_defaut'));

        return response()->json($typeEvaluation);
    }

    public function destroy(TypeEvaluation $typeEvaluation)
    {
        $typeEvaluation->delete();

        return response()->json(['message' => "Type d'évaluation supprimé"]);
    }
}
