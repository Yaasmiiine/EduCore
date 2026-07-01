<?php

namespace Database\Seeders;

use App\Models\Annonce;
use App\Models\EmploiDuTemps;
use App\Models\Filiere;
use App\Models\Groupe;
use App\Models\Module;
use App\Models\Role;
use App\Models\Salle;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Roles
        $admin     = Role::create(['nom' => 'admin']);
        $formateur = Role::create(['nom' => 'formateur']);
        $stagiaire = Role::create(['nom' => 'stagiaire']);

        // Admin
        $adminUser = User::create([
            'nom'      => 'Admin',
            'prenom'   => 'OFPPT',
            'email'    => 'admin@ofppt.ma',
            'password' => Hash::make('password123'),
            'role_id'  => $admin->id,
        ]);

        // Formateur
        $formateurUser = User::create([
            'nom'      => 'Alami',
            'prenom'   => 'Mohammed',
            'email'    => 'formateur@ofppt.ma',
            'password' => Hash::make('password123'),
            'role_id'  => $formateur->id,
        ]);

        // Filière + groupe
        $filiere = Filiere::create([
            'nom'         => 'Développement Digital',
            'code'        => 'DEV101',
            'description' => 'Filière de développement web et mobile.',
        ]);

        $groupe = Groupe::create([
            'filiere_id' => $filiere->id,
            'nom'        => 'DEV101-G1',
            'annee'      => 1,
        ]);

        // Stagiaire, attaché au groupe
        User::create([
            'nom'       => 'Benali',
            'prenom'    => 'Youssef',
            'email'     => 'stagiaire@ofppt.ma',
            'password'  => Hash::make('password123'),
            'role_id'   => $stagiaire->id,
            'groupe_id' => $groupe->id,
        ]);

        // Salle
        $salle = Salle::create([
            'nom'        => 'Salle A101',
            'code'       => 'A101',
            'batiment'   => 'Bâtiment A',
            'capacite'   => 30,
            'equipement' => 'Vidéoprojecteur, postes informatiques',
            'statut'     => 'disponible',
        ]);

        // Module assigné au formateur
        $module = Module::create([
            'filiere_id'   => $filiere->id,
            'formateur_id' => $formateurUser->id,
            'nom'          => 'Développement Web',
            'code'         => 'DEV-WEB-101',
            'description'  => 'Introduction au développement web full stack.',
            'heures_total' => 120,
        ]);

        // Séance d'emploi du temps
        EmploiDuTemps::create([
            'groupe_id'    => $groupe->id,
            'module_id'    => $module->id,
            'formateur_id' => $formateurUser->id,
            'salle_id'     => $salle->id,
            'jour'         => 'Lundi',
            'heure_debut'  => '08:30',
            'heure_fin'    => '11:30',
        ]);

        // Annonce de bienvenue
        Annonce::create([
            'auteur_id' => $adminUser->id,
            'groupe_id' => null,
            'titre'     => 'Bienvenue sur EduCore',
            'contenu'   => 'La plateforme académique EduCore est maintenant disponible pour toute la communauté OFPPT.',
            'priorite'  => 'normale',
        ]);
    }
}
