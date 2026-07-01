<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Annonce;
use App\Models\Fichier;
use App\Models\Groupe;
use App\Models\Module;
use App\Models\User;

class DashboardController extends Controller
{
    // GET /api/dashboard
    public function index()
    {
        $stats = [
            'total_users'      => User::count(),
            'total_formateurs' => User::whereHas('role', fn($q) => $q->where('nom', 'formateur'))->count(),
            'total_stagiaires' => User::whereHas('role', fn($q) => $q->where('nom', 'stagiaire'))->count(),
            'total_modules'    => Module::count(),
            'total_groupes'    => Groupe::count(),
            'total_annonces'   => Annonce::count(),
            'total_fichiers'   => Fichier::count(),
            'annonces_recentes'=> Annonce::with('auteur')->latest()->take(5)->get(),
        ];

        return response()->json($stats);
    }
}
