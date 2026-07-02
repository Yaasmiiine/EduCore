<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ResetPasswordMail;
use App\Mail\VerifyEmailMail;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

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

        $this->sendVerificationEmail($user);

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

    // PUT /api/profile — the authenticated user updates their own nom/prenom/email/photo.
    public function updateProfile(Request $request)
    {
        $user = auth('api')->user();

        $validator = Validator::make($request->all(), [
            'nom'    => 'sometimes|string|max:100',
            'prenom' => 'sometimes|string|max:100',
            'email'  => 'sometimes|email|unique:users,email,' . $user->id,
            'photo'  => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Changing address invalidates the previous verification.
        if ($request->filled('email') && $request->email !== $user->email) {
            $user->email_verified_at = null;
        }

        $user->fill($request->only('nom', 'prenom', 'email', 'photo'));
        $user->save();

        if (! $user->email_verified_at) {
            $this->sendVerificationEmail($user);
        }

        return response()->json($user->load('role', 'groupe'));
    }

    // PUT /api/profile/password — the authenticated user changes their own password.
    public function updatePassword(Request $request)
    {
        $user = auth('api')->user();

        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'password'          => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if (! Hash::check($request->current_password, $user->password)) {
            return response()->json(['errors' => ['current_password' => ['Mot de passe actuel incorrect.']]], 422);
        }

        $user->update(['password' => Hash::make($request->password)]);

        return response()->json(['message' => 'Mot de passe mis à jour avec succès']);
    }

    // POST /api/auth/refresh
    public function refresh()
    {
        return $this->respondWithToken(auth('api')->refresh());
    }

    // POST /api/auth/forgot-password — public. Always responds the same way
    // whether or not the email exists, to avoid leaking which addresses are
    // registered.
    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), ['email' => 'required|email']);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('email', $request->email)->first();

        if ($user) {
            $token = Str::random(64);

            DB::table('password_reset_tokens')->updateOrInsert(
                ['email' => $user->email],
                ['token' => Hash::make($token), 'created_at' => now()]
            );

            $resetUrl = rtrim(config('app.frontend_url'), '/')
                . '/reset-password?token=' . $token . '&email=' . urlencode($user->email);

            Mail::to($user->email)->send(new ResetPasswordMail($user->prenom, $resetUrl));
        }

        return response()->json([
            'message' => "Si cet email existe, un lien de réinitialisation vient d'être envoyé.",
        ]);
    }

    // POST /api/auth/reset-password — public.
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email'    => 'required|email',
            'token'    => 'required|string',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $record = DB::table('password_reset_tokens')->where('email', $request->email)->first();

        if (! $record || ! Hash::check($request->token, $record->token)) {
            return response()->json(['message' => 'Ce lien de réinitialisation est invalide.'], 422);
        }

        if (now()->diffInMinutes($record->created_at) > 60) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json(['message' => 'Ce lien de réinitialisation a expiré. Veuillez en redemander un.'], 422);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $user->update(['password' => Hash::make($request->password)]);

        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Mot de passe réinitialisé avec succès. Vous pouvez vous connecter.']);
    }

    // POST /api/auth/verify-email — public.
    public function verifyEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'token' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $record = DB::table('email_verifications')->where('email', $request->email)->first();

        if (! $record || ! Hash::check($request->token, $record->token)) {
            return response()->json(['message' => 'Ce lien de vérification est invalide.'], 422);
        }

        if (now()->diffInMinutes($record->created_at) > 60) {
            DB::table('email_verifications')->where('email', $request->email)->delete();
            return response()->json(['message' => 'Ce lien de vérification a expiré. Demandez-en un nouveau depuis votre compte.'], 422);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $user->update(['email_verified_at' => now()]);

        DB::table('email_verifications')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Adresse email vérifiée avec succès.']);
    }

    // POST /api/auth/resend-verification — the authenticated user requests a
    // new verification email (e.g. the first one expired or was lost).
    public function resendVerification()
    {
        $user = auth('api')->user();

        if ($user->email_verified_at) {
            return response()->json(['message' => 'Cet email est déjà vérifié.']);
        }

        $this->sendVerificationEmail($user);

        return response()->json(['message' => 'Un nouvel email de vérification vient d\'être envoyé.']);
    }

    private function sendVerificationEmail(User $user): void
    {
        $token = Str::random(64);

        DB::table('email_verifications')->updateOrInsert(
            ['email' => $user->email],
            ['token' => Hash::make($token), 'created_at' => now()]
        );

        $verifyUrl = rtrim(config('app.frontend_url'), '/')
            . '/verify-email?token=' . $token . '&email=' . urlencode($user->email);

        Mail::to($user->email)->send(new VerifyEmailMail($user->prenom, $verifyUrl));
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
