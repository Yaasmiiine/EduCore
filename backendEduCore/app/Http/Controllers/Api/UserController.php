<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    // GET /api/users
    public function index()
    {
        $users = User::with('role', 'groupe')->get();
        return response()->json($users);
    }

    // POST /api/users
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom'       => 'required|string|max:100',
            'prenom'    => 'required|string|max:100',
            'email'     => 'required|email|unique:users',
            'password'  => 'required|string|min:6',
            'role_id'   => 'required|exists:roles,id',
            'groupe_id' => 'nullable|exists:groupes,id',
        ]);

        $validator->after(function ($validator) use ($request) {
            $this->validateGroupeRequiredForStagiaire($validator, $request);
        });

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'nom'       => $request->nom,
            'prenom'    => $request->prenom,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'role_id'   => $request->role_id,
            'groupe_id' => $request->groupe_id,
        ]);

        return response()->json($user->load('role', 'groupe'), 201);
    }

    // GET /api/users/{id}
    public function show(User $user)
    {
        return response()->json($user->load('role', 'groupe', 'modules', 'annonces'));
    }

    // PUT /api/users/{id}
    public function update(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'nom'       => 'sometimes|string|max:100',
            'prenom'    => 'sometimes|string|max:100',
            'email'     => 'sometimes|email|unique:users,email,' . $user->id,
            'role_id'   => 'sometimes|exists:roles,id',
            'groupe_id' => 'nullable|exists:groupes,id',
        ]);

        $validator->after(function ($validator) use ($request, $user) {
            if ($request->has('role_id') || $request->has('groupe_id')) {
                $this->validateGroupeRequiredForStagiaire($validator, $request, $user);
            }
        });

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->update($request->only('nom', 'prenom', 'email', 'role_id', 'groupe_id'));

        return response()->json($user->load('role', 'groupe'));
    }

    // DELETE /api/users/{id}
    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'Utilisateur supprimé']);
    }

    private function validateGroupeRequiredForStagiaire($validator, Request $request, ?User $existing = null)
    {
        $roleId = $request->input('role_id', $existing?->role_id);
        $groupeId = $request->input('groupe_id', $existing?->groupe_id);

        $roleNom = Role::find($roleId)?->nom;

        if ($roleNom === 'stagiaire' && ! $groupeId) {
            $validator->errors()->add('groupe_id', 'Un stagiaire doit être rattaché à un groupe.');
        }
    }
}
