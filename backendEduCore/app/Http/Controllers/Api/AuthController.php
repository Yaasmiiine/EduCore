<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    // POST /api/auth/register
    // Public self-registration is for stagiaires only — admin/formateur accounts
    // are created by an admin via POST /api/users.
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom'       => 'required|string|max:100',
            'prenom'    => 'required|string|max:100',
            'email'     => 'required|email|unique:users',
            'password'  => 'required|string|min:6',
            'groupe_id' => 'required|exists:groupes,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $stagiaireRole = Role::where('nom', 'stagiaire')->firstOrFail();

        $user = User::create([
            'nom'       => $request->nom,
            'prenom'    => $request->prenom,
            'email'     => $request->email,
            'password'  => Hash::make($request->password),
            'role_id'   => $stagiaireRole->id,
            'groupe_id' => $request->groupe_id,
        ]);

        $token = auth('api')->login($user);

        return response()->json([
            'message' => 'Compte créé avec succès',
            'user'    => $user->load('role', 'groupe'),
            'token'   => $token,
        ], 201);
    }

    // POST /api/auth/login
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json(['message' => 'Email ou mot de passe incorrect'], 401);
        }

        return $this->respondWithToken($token);
    }

    // POST /api/auth/logout
    public function logout()
    {
        auth('api')->logout();
        return response()->json(['message' => 'Déconnexion réussie']);
    }

    // GET /api/auth/me
    public function me()
    {
        return response()->json(auth('api')->user()->load('role', 'groupe'));
    }

    // POST /api/auth/refresh
    public function refresh()
    {
        return $this->respondWithToken(auth('api')->refresh());
    }

    private function respondWithToken($token)
    {
        return response()->json([
            'token'      => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'user'       => auth('api')->user()->load('role', 'groupe'),
        ]);
    }
}
