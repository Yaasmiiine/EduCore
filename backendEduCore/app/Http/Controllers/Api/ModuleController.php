<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Module;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ModuleController extends Controller
{
    public function index()
    {
        $modules = Module::with('filiere', 'formateur')->get();
        return response()->json($modules);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'filiere_id'   => 'required|exists:filieres,id',
            'formateur_id' => 'required|exists:users,id',
            'nom'          => 'required|string|max:150',
            'code'         => 'required|string|unique:modules',
            'description'  => 'nullable|string',
            'heures_total' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $module = Module::create($request->all());
        return response()->json($module->load('filiere', 'formateur'), 201);
    }

    public function show(Module $module)
    {
        return response()->json($module->load('filiere', 'formateur', 'fichiers'));
    }

    public function update(Request $request, Module $module)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'sometimes|unique:modules,code,' . $module->id,
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $module->update($request->only(
            'filiere_id', 'formateur_id', 'nom', 'code', 'description', 'heures_total'
        ));

        return response()->json($module->load('filiere', 'formateur'));
    }

    public function destroy(Module $module)
    {
        $module->delete();
        return response()->json(['message' => 'Module supprimé']);
    }
}
