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
use App\Models\Role;
use Illuminate\Support\Facades\Route;

// ─── Public routes ──────────────────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login']);
});

// Filieres & groupes reads are public — a prospective stagiaire needs to see
// the list of filières/groupes to pick one on the registration form, before
// they have a token.
Route::apiResource('filieres', FiliereController::class)->only(['index', 'show']);
Route::apiResource('groupes', GroupeController::class)->only(['index', 'show']);

// ─── Protected routes ───────────────────────────────────────────────────────
Route::middleware('auth:api')->group(function () {

    // Auth
    Route::prefix('auth')->group(function () {
        Route::post('logout',  [AuthController::class, 'logout']);
        Route::post('refresh', [AuthController::class, 'refresh']);
        Route::get('me',       [AuthController::class, 'me']);
    });

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
    Route::apiResource('emplois-du-temps', EmploiDuTempsController::class)->only(['index', 'show']);
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('emplois-du-temps', EmploiDuTempsController::class)->only(['store', 'update', 'destroy']);
        Route::post('emplois-du-temps/generate-ia', [EmploiDuTempsController::class, 'generateIA']);
        Route::post('emplois-du-temps/bulk', [EmploiDuTempsController::class, 'bulkStore']);
    });

    // Fichiers — everyone reads, admin + formateur upload/delete, anyone may request an AI résumé
    Route::apiResource('fichiers', FichierController::class)->only(['index', 'show']);
    Route::middleware('role:admin,formateur')->group(function () {
        Route::apiResource('fichiers', FichierController::class)->only(['store', 'destroy']);
    });
    Route::post('fichiers/{fichier}/resume', [FichierController::class, 'resumeIA']);

    Route::post('ai/chat', [AiController::class, 'chat']);
});
