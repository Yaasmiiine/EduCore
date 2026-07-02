<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\FiliereController;
use App\Http\Controllers\Api\GroupeController;
use App\Http\Controllers\Api\ModuleController;
use App\Http\Controllers\Api\AnnonceController;
use App\Http\Controllers\Api\EmploiDuTempsController;
use App\Http\Controllers\Api\SalleController;
use App\Http\Controllers\Api\FichierController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\AiController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\NoteController;
use App\Http\Controllers\Api\PresenceController;
use App\Http\Controllers\Api\ModuleMessageController;
use App\Http\Controllers\Api\FormateurController;
use App\Http\Controllers\Api\DevoirController;
use App\Http\Controllers\Api\SoumissionController;
use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\TypeEvaluationController;
use App\Models\Role;
use Illuminate\Support\Facades\Route;

// ─── Public routes ──────────────────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('register',         [AuthController::class, 'register']);
    Route::post('login',            [AuthController::class, 'login']);
    Route::post('forgot-password',  [AuthController::class, 'forgotPassword']);
    Route::post('reset-password',   [AuthController::class, 'resetPassword']);
    Route::post('verify-email',     [AuthController::class, 'verifyEmail']);
});

Route::post('contact', [ContactController::class, 'store']);

// Filieres & groupes reads are public — a prospective stagiaire needs to see
// the list of filières/groupes to pick one on the registration form, before
// they have a token.
Route::apiResource('filieres', FiliereController::class)->only(['index', 'show']);
Route::apiResource('groupes', GroupeController::class)->only(['index', 'show']);

// ─── Protected routes ───────────────────────────────────────────────────────
Route::middleware('auth:api')->group(function () {

    // Auth
    Route::prefix('auth')->group(function () {
        Route::post('logout',              [AuthController::class, 'logout']);
        Route::post('refresh',             [AuthController::class, 'refresh']);
        Route::get('me',                   [AuthController::class, 'me']);
        Route::post('resend-verification', [AuthController::class, 'resendVerification']);
    });

    // Profile — every authenticated user manages their own account.
    Route::put('profile',          [AuthController::class, 'updateProfile']);
    Route::put('profile/password', [AuthController::class, 'updatePassword']);

    // Notifications — every authenticated user reads/marks only their own.
    Route::get('notifications',           [NotificationController::class, 'index']);
    Route::post('notifications/read-all', [NotificationController::class, 'markAllRead']);
    Route::post('notifications/{notification}/read', [NotificationController::class, 'markRead']);

    // Dashboard (admin only)
    Route::middleware('role:admin')->get('dashboard', [DashboardController::class, 'index']);

    // Users — admin only
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('users', UserController::class);
        Route::get('roles', fn () => response()->json(Role::all()));
    });

    // Filieres/groupes writes — admin only (reads are public, registered above)
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('filieres', FiliereController::class)->only(['store', 'update', 'destroy']);
        Route::apiResource('groupes', GroupeController::class)->only(['store', 'update', 'destroy']);
    });

    // Salles — everyone reads, admin writes
    Route::apiResource('salles', SalleController::class)->only(['index', 'show']);
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('salles', SalleController::class)->only(['store', 'update', 'destroy']);
    });

    // Modules — everyone reads, admin writes
    Route::apiResource('modules', ModuleController::class)->only(['index', 'show']);
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('modules', ModuleController::class)->only(['store', 'update', 'destroy']);
    });

    // Annonces — everyone reads, admin + formateur create, owner/admin update/delete (AnnoncePolicy)
    Route::apiResource('annonces', AnnonceController::class)->only(['index', 'show', 'update', 'destroy']);
    Route::middleware('role:admin,formateur')->group(function () {
        Route::post('annonces', [AnnonceController::class, 'store']);
    });

    // Emplois du temps — everyone reads, admin writes
    // NOTE: literal sub-paths (conflicts, generate-ia, bulk) must be registered
    // before the apiResource's {emploiDuTemps} show route, or Laravel will try
    // to resolve them as a route-model-binding id instead.
    Route::middleware('role:admin')->group(function () {
        Route::get('emplois-du-temps/conflicts', [EmploiDuTempsController::class, 'conflicts']);
        Route::post('emplois-du-temps/conflicts/analyze', [EmploiDuTempsController::class, 'analyzeConflicts']);
        Route::post('emplois-du-temps/generate-ia', [EmploiDuTempsController::class, 'generateIA']);
        Route::post('emplois-du-temps/bulk', [EmploiDuTempsController::class, 'bulkStore']);
    });
    Route::apiResource('emplois-du-temps', EmploiDuTempsController::class)
        ->parameters(['emplois-du-temps' => 'emploiDuTemps'])
        ->only(['index', 'show']);
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('emplois-du-temps', EmploiDuTempsController::class)
            ->parameters(['emplois-du-temps' => 'emploiDuTemps'])
            ->only(['store', 'update', 'destroy']);
    });

    // Fichiers — everyone reads, admin + formateur upload/delete, anyone may request an AI résumé
    Route::apiResource('fichiers', FichierController::class)->only(['index', 'show']);
    Route::middleware('role:admin,formateur')->group(function () {
        Route::apiResource('fichiers', FichierController::class)->only(['store', 'destroy']);
    });
    Route::post('fichiers/{fichier}/resume', [FichierController::class, 'resumeIA']);
    Route::get('fichiers/{fichier}/download', [FichierController::class, 'download']);

    Route::post('ai/chat', [AiController::class, 'chat']);

    // Notes (grades) — formateur/admin enter, stagiaire consults their own bulletin.
    // Per-module/per-note ownership is enforced inside NoteController.
    Route::get('bulletin', [NoteController::class, 'bulletin']);
    Route::middleware('role:admin,formateur')->group(function () {
        Route::get('modules/{module}/etudiants', [ModuleController::class, 'etudiants']);
        Route::get('notes', [NoteController::class, 'index']);
        Route::post('notes', [NoteController::class, 'store']);
        Route::put('notes/{note}', [NoteController::class, 'update']);
        Route::delete('notes/{note}', [NoteController::class, 'destroy']);
    });

    // Présences (attendance) — formateur/admin mark, stagiaire consults their own history.
    Route::get('presences/mine', [PresenceController::class, 'mine']);
    Route::middleware('role:admin,formateur')->group(function () {
        Route::get('presences/seance', [PresenceController::class, 'seance']);
        Route::post('presences/bulk', [PresenceController::class, 'bulkStore']);
    });

    // Module Q&A messaging — any user tied to the module (admin, its formateur,
    // or a stagiaire of its filière) may read/post; ModuleMessageController checks this.
    Route::get('modules/{module}/messages', [ModuleMessageController::class, 'index']);
    Route::post('modules/{module}/messages', [ModuleMessageController::class, 'store']);
    Route::delete('module-messages/{message}', [ModuleMessageController::class, 'destroy']);

    // Formateur personal reports — their own students and per-module stats.
    Route::middleware('role:formateur')->group(function () {
        Route::get('mes-etudiants', [FormateurController::class, 'mesEtudiants']);
        Route::get('mes-statistiques', [FormateurController::class, 'mesStatistiques']);
    });

    // Devoirs & soumissions — everyone reads their own scope (checked in
    // controller), formateur/admin manage, stagiaire submits.
    Route::get('devoirs', [DevoirController::class, 'index']);
    Route::middleware('role:admin,formateur')->group(function () {
        Route::post('devoirs', [DevoirController::class, 'store']);
        Route::put('devoirs/{devoir}', [DevoirController::class, 'update']);
        Route::delete('devoirs/{devoir}', [DevoirController::class, 'destroy']);
        Route::get('devoirs/{devoir}/soumissions', [SoumissionController::class, 'index']);
    });
    Route::middleware('role:stagiaire')->post('devoirs/{devoir}/soumissions', [SoumissionController::class, 'store']);
    Route::get('soumissions/{soumission}/download', [SoumissionController::class, 'download']);

    // Journal d'activité — admin only.
    Route::middleware('role:admin')->get('activity-logs', [ActivityLogController::class, 'index']);

    // Types d'évaluation — everyone reads (feeds the Notes entry form), admin manages.
    Route::get('types-evaluation', [TypeEvaluationController::class, 'index']);
    Route::middleware('role:admin')->group(function () {
        Route::post('types-evaluation', [TypeEvaluationController::class, 'store']);
        Route::put('types-evaluation/{typeEvaluation}', [TypeEvaluationController::class, 'update']);
        Route::delete('types-evaluation/{typeEvaluation}', [TypeEvaluationController::class, 'destroy']);
    });
});
