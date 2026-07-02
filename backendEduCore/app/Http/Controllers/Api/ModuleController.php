<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ModuleController extends Controller
{
    // Paginated (and searchable) only when a `page` param is sent — Schedule
    // and Génération IA rely on the full unpaginated list to build their
    // filiere-filtered dropdowns, so that behavior stays unchanged by default.
    public function index(Request $request)
    {
        $query = Module::with('filiere', 'formateur');

        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        if ($request->filled('filiere_id')) {
            $query->where('filiere_id', $request->integer('filiere_id'));
        }

        if ($request->has('page')) {
            return response()->json($query->paginate($request->integer('per_page', 10)));
        }

        return response()->json($query->get());
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

    // GET /api/modules/{module}/etudiants?groupe_id=X — stagiaires of that
    // module's filière, optionally narrowed to one groupe (a module is often
    // taught to several groupes, so the caller needs to be able to pick one).
    // Used by the formateur's grade-entry and attendance-sheet pages.
    public function etudiants(Request $request, Module $module)
    {
        $user = $request->user();
        if (! $user->isAdmin() && $module->formateur_id !== $user->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $query = User::whereHas('groupe', fn ($q) => $q->where('filiere_id', $module->filiere_id));

        if ($request->filled('groupe_id')) {
            $query->where('groupe_id', $request->integer('groupe_id'));
        }

        $etudiants = $query->orderBy('nom')->get(['id', 'nom', 'prenom', 'email', 'groupe_id']);

        return response()->json($etudiants);
    }
}
