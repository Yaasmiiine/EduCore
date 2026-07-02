<?php

namespace Database\Seeders;

use App\Models\Annonce;
use App\Models\Devoir;
use App\Models\EmploiDuTemps;
use App\Models\Filiere;
use App\Models\Groupe;
use App\Models\Module;
use App\Models\ModuleMessage;
use App\Models\Note;
use App\Models\Presence;
use App\Models\Role;
use App\Models\Salle;
use App\Models\TypeEvaluation;
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
            'nom'               => 'Admin',
            'prenom'            => 'EduCore',
            'email'             => 'admin@educore.test',
            'password'          => Hash::make('password123'),
            'role_id'           => $admin->id,
            'email_verified_at' => now(),
        ]);

        // Formateurs
        $mohammed = User::create([
            'nom'               => 'Alami',
            'prenom'            => 'Mohammed',
            'email'             => 'formateur@educore.test',
            'password'          => Hash::make('password123'),
            'role_id'           => $formateur->id,
            'email_verified_at' => now(),
        ]);

        $nadia = User::create([
            'nom'               => 'Bensouda',
            'prenom'            => 'Nadia',
            'email'             => 'formateur2@educore.test',
            'password'          => Hash::make('password123'),
            'role_id'           => $formateur->id,
            'email_verified_at' => now(),
        ]);

        $karim = User::create([
            'nom'               => 'Tazi',
            'prenom'            => 'Karim',
            'email'             => 'formateur3@educore.test',
            'password'          => Hash::make('password123'),
            'role_id'           => $formateur->id,
            'email_verified_at' => now(),
        ]);

        // Filières
        $filiereDev = Filiere::create([
            'nom'         => 'Développement Digital',
            'code'        => 'DEV101',
            'description' => 'Filière de développement web et mobile.',
        ]);

        $filiereReseaux = Filiere::create([
            'nom'         => 'Réseaux et Systèmes',
            'code'        => 'RS101',
            'description' => 'Filière administration réseaux et systèmes informatiques.',
        ]);

        $filiereGestion = Filiere::create([
            'nom'         => 'Gestion des Entreprises',
            'code'        => 'GE101',
            'description' => 'Filière gestion, comptabilité et management.',
        ]);

        // Groupes
        $devG1 = Groupe::create(['filiere_id' => $filiereDev->id, 'nom' => 'DEV101-G1', 'annee' => 1]);
        $devG2 = Groupe::create(['filiere_id' => $filiereDev->id, 'nom' => 'DEV101-G2', 'annee' => 2]);
        $rsG1  = Groupe::create(['filiere_id' => $filiereReseaux->id, 'nom' => 'RS101-G1', 'annee' => 1]);
        $geG1  = Groupe::create(['filiere_id' => $filiereGestion->id, 'nom' => 'GE101-G1', 'annee' => 1]);

        // Stagiaires
        $verified = ['email_verified_at' => now()];
        $youssef = User::create(['nom' => 'Benali', 'prenom' => 'Youssef', 'email' => 'stagiaire@educore.test', 'password' => Hash::make('password123'), 'role_id' => $stagiaire->id, 'groupe_id' => $devG1->id] + $verified);
        $sara = User::create(['nom' => 'Amrani', 'prenom' => 'Sara', 'email' => 'stagiaire2@educore.test', 'password' => Hash::make('password123'), 'role_id' => $stagiaire->id, 'groupe_id' => $devG1->id] + $verified);
        User::create(['nom' => 'Chafik', 'prenom' => 'Nabil', 'email' => 'stagiaire3@educore.test', 'password' => Hash::make('password123'), 'role_id' => $stagiaire->id, 'groupe_id' => $devG2->id] + $verified);
        User::create(['nom' => 'Ouali', 'prenom' => 'Imane', 'email' => 'stagiaire4@educore.test', 'password' => Hash::make('password123'), 'role_id' => $stagiaire->id, 'groupe_id' => $devG2->id] + $verified);
        User::create(['nom' => 'Rachidi', 'prenom' => 'Hamza', 'email' => 'stagiaire5@educore.test', 'password' => Hash::make('password123'), 'role_id' => $stagiaire->id, 'groupe_id' => $rsG1->id] + $verified);
        User::create(['nom' => 'Bouzid', 'prenom' => 'Salma', 'email' => 'stagiaire6@educore.test', 'password' => Hash::make('password123'), 'role_id' => $stagiaire->id, 'groupe_id' => $rsG1->id] + $verified);
        User::create(['nom' => 'Fassi', 'prenom' => 'Yassine', 'email' => 'stagiaire7@educore.test', 'password' => Hash::make('password123'), 'role_id' => $stagiaire->id, 'groupe_id' => $geG1->id] + $verified);
        User::create(['nom' => 'Naciri', 'prenom' => 'Khadija', 'email' => 'stagiaire8@educore.test', 'password' => Hash::make('password123'), 'role_id' => $stagiaire->id, 'groupe_id' => $geG1->id] + $verified);

        // Salles
        $salleA101 = Salle::create(['nom' => 'Salle A101', 'code' => 'A101', 'batiment' => 'Bâtiment A', 'capacite' => 30, 'equipement' => 'Vidéoprojecteur, postes informatiques', 'statut' => 'disponible']);
        $salleB203 = Salle::create(['nom' => 'Salle B203', 'code' => 'B203', 'batiment' => 'Bâtiment B', 'capacite' => 25, 'equipement' => 'Vidéoprojecteur', 'statut' => 'disponible']);
        $salleC105 = Salle::create(['nom' => 'Salle C105', 'code' => 'C105', 'batiment' => 'Bâtiment C', 'capacite' => 40, 'equipement' => 'Postes informatiques, Vidéoprojecteur', 'statut' => 'disponible']);

        // Modules
        $modDevWeb = Module::create(['filiere_id' => $filiereDev->id, 'formateur_id' => $mohammed->id, 'nom' => 'Développement Web', 'code' => 'DEV-WEB-101', 'description' => 'Introduction au développement web full stack.', 'heures_total' => 120]);
        $modBdd    = Module::create(['filiere_id' => $filiereDev->id, 'formateur_id' => $mohammed->id, 'nom' => 'Bases de Données', 'code' => 'DEV-BDD-102', 'description' => 'Conception et administration de bases de données relationnelles.', 'heures_total' => 90]);
        $modReseaux = Module::create(['filiere_id' => $filiereReseaux->id, 'formateur_id' => $nadia->id, 'nom' => 'Réseaux Informatiques', 'code' => 'RS-NET-101', 'description' => 'Architecture et administration des réseaux.', 'heures_total' => 100]);
        $modSysteme = Module::create(['filiere_id' => $filiereReseaux->id, 'formateur_id' => $nadia->id, 'nom' => "Systèmes d'Exploitation", 'code' => 'RS-SYS-102', 'description' => 'Administration Windows et Linux.', 'heures_total' => 80]);
        $modCompta = Module::create(['filiere_id' => $filiereGestion->id, 'formateur_id' => $karim->id, 'nom' => 'Comptabilité Générale', 'code' => 'GE-CPT-101', 'description' => 'Principes fondamentaux de la comptabilité.', 'heures_total' => 90]);
        $modMgmt   = Module::create(['filiere_id' => $filiereGestion->id, 'formateur_id' => $karim->id, 'nom' => "Management d'Entreprise", 'code' => 'GE-MNG-102', 'description' => "Fondamentaux du management et de l'organisation.", 'heures_total' => 70]);

        // Emplois du temps
        $devWebSeance = EmploiDuTemps::create(['groupe_id' => $devG1->id, 'module_id' => $modDevWeb->id, 'formateur_id' => $mohammed->id, 'salle_id' => $salleA101->id, 'jour' => 'Lundi', 'heure_debut' => '08:30', 'heure_fin' => '11:30']);
        $bddSeance = EmploiDuTemps::create(['groupe_id' => $devG1->id, 'module_id' => $modBdd->id, 'formateur_id' => $mohammed->id, 'salle_id' => $salleA101->id, 'jour' => 'Mercredi', 'heure_debut' => '08:30', 'heure_fin' => '11:00']);
        EmploiDuTemps::create(['groupe_id' => $devG2->id, 'module_id' => $modDevWeb->id, 'formateur_id' => $mohammed->id, 'salle_id' => $salleB203->id, 'jour' => 'Lundi', 'heure_debut' => '11:30', 'heure_fin' => '14:00']);
        EmploiDuTemps::create(['groupe_id' => $devG2->id, 'module_id' => $modBdd->id, 'formateur_id' => $mohammed->id, 'salle_id' => $salleB203->id, 'jour' => 'Jeudi', 'heure_debut' => '08:30', 'heure_fin' => '10:30']);
        EmploiDuTemps::create(['groupe_id' => $rsG1->id, 'module_id' => $modReseaux->id, 'formateur_id' => $nadia->id, 'salle_id' => $salleA101->id, 'jour' => 'Mardi', 'heure_debut' => '08:30', 'heure_fin' => '11:00']);
        EmploiDuTemps::create(['groupe_id' => $rsG1->id, 'module_id' => $modSysteme->id, 'formateur_id' => $nadia->id, 'salle_id' => $salleC105->id, 'jour' => 'Jeudi', 'heure_debut' => '11:00', 'heure_fin' => '13:00']);
        EmploiDuTemps::create(['groupe_id' => $geG1->id, 'module_id' => $modCompta->id, 'formateur_id' => $karim->id, 'salle_id' => $salleB203->id, 'jour' => 'Mercredi', 'heure_debut' => '11:30', 'heure_fin' => '13:30']);
        EmploiDuTemps::create(['groupe_id' => $geG1->id, 'module_id' => $modMgmt->id, 'formateur_id' => $karim->id, 'salle_id' => $salleC105->id, 'jour' => 'Vendredi', 'heure_debut' => '08:30', 'heure_fin' => '10:30']);

        // Examens à venir (alimentent le calendrier des examens des stagiaires)
        EmploiDuTemps::create(['groupe_id' => $devG1->id, 'module_id' => $modDevWeb->id, 'formateur_id' => $mohammed->id, 'salle_id' => $salleA101->id, 'jour' => 'Lundi', 'heure_debut' => '08:30', 'heure_fin' => '11:30', 'type' => 'examen', 'date_examen' => now()->addDays(12)->toDateString()]);
        EmploiDuTemps::create(['groupe_id' => $devG1->id, 'module_id' => $modBdd->id, 'formateur_id' => $mohammed->id, 'salle_id' => $salleA101->id, 'jour' => 'Mercredi', 'heure_debut' => '08:30', 'heure_fin' => '11:00', 'type' => 'controle', 'date_examen' => now()->addDays(5)->toDateString()]);

        // Annonces
        Annonce::create(['auteur_id' => $adminUser->id, 'groupe_id' => null, 'titre' => 'Bienvenue sur EduCore', 'contenu' => 'La plateforme académique EduCore est maintenant disponible pour toute la communauté éducative.', 'priorite' => 'normale']);
        Annonce::create(['auteur_id' => $adminUser->id, 'groupe_id' => null, 'titre' => 'Réunion pédagogique de rentrée', 'contenu' => "Une réunion pédagogique aura lieu la semaine prochaine pour tous les formateurs. Merci de consulter votre emploi du temps.", 'priorite' => 'importante']);
        Annonce::create(['auteur_id' => $nadia->id, 'groupe_id' => $rsG1->id, 'titre' => 'Changement de salle', 'contenu' => "Le cours de Systèmes d'Exploitation de jeudi se déroulera exceptionnellement en salle C105.", 'priorite' => 'normale']);
        Annonce::create(['auteur_id' => $mohammed->id, 'groupe_id' => $devG1->id, 'titre' => 'Rendu de projet vendredi', 'contenu' => 'Rappel : le projet de fin de module Développement Web est à rendre avant vendredi 17h.', 'priorite' => 'urgente']);

        // Notes — bulletin de démonstration pour les stagiaires de DEV101-G1
        foreach ([$youssef->id => [14.5, 16, 12.5], $sara->id => [17, 15.5, 18]] as $studentId => [$tp, $cc, $examen]) {
            Note::create(['user_id' => $studentId, 'module_id' => $modDevWeb->id, 'formateur_id' => $mohammed->id, 'type' => 'TP', 'valeur' => $tp, 'coefficient' => 1, 'date_evaluation' => now()->subDays(20)->toDateString()]);
            Note::create(['user_id' => $studentId, 'module_id' => $modDevWeb->id, 'formateur_id' => $mohammed->id, 'type' => 'Contrôle continu', 'valeur' => $cc, 'coefficient' => 1.5, 'date_evaluation' => now()->subDays(10)->toDateString()]);
            Note::create(['user_id' => $studentId, 'module_id' => $modBdd->id, 'formateur_id' => $mohammed->id, 'type' => 'Examen', 'valeur' => $examen, 'coefficient' => 2, 'commentaire' => 'Bon travail dans l’ensemble.', 'date_evaluation' => now()->subDays(3)->toDateString()]);
        }

        // Présences — historique de démonstration sur les 3 dernières séances de chaque module
        $presenceHistory = [
            $devWebSeance->id => [
                now()->subDays(21)->toDateString() => [$youssef->id => 'present', $sara->id => 'present'],
                now()->subDays(14)->toDateString() => [$youssef->id => 'retard', $sara->id => 'present'],
                now()->subDays(7)->toDateString()  => [$youssef->id => 'absent', $sara->id => 'present'],
            ],
            $bddSeance->id => [
                now()->subDays(19)->toDateString() => [$youssef->id => 'present', $sara->id => 'retard'],
                now()->subDays(12)->toDateString() => [$youssef->id => 'present', $sara->id => 'present'],
                now()->subDays(5)->toDateString()  => [$youssef->id => 'present', $sara->id => 'absent'],
            ],
        ];
        foreach ($presenceHistory as $emploiDuTempsId => $dates) {
            foreach ($dates as $date => $statuts) {
                foreach ($statuts as $studentId => $statut) {
                    Presence::create(['emploi_du_temps_id' => $emploiDuTempsId, 'user_id' => $studentId, 'formateur_id' => $mohammed->id, 'date' => $date, 'statut' => $statut]);
                }
            }
        }

        // Messagerie de module — fil de discussion de démonstration
        ModuleMessage::create(['module_id' => $modDevWeb->id, 'user_id' => $youssef->id, 'message' => 'Bonjour, est-ce que le TP de la semaine prochaine porte sur React ou sur Node.js ?']);
        ModuleMessage::create(['module_id' => $modDevWeb->id, 'user_id' => $mohammed->id, 'message' => 'Bonjour Youssef, ce sera sur React côté front-end. Je posterai le support avant vendredi.']);
        ModuleMessage::create(['module_id' => $modDevWeb->id, 'user_id' => $sara->id, 'message' => 'Merci pour la précision, est-ce qu’on peut travailler en binôme ?']);

        // Types d'évaluation — coefficients par défaut utilisés par le formulaire de saisie des notes
        TypeEvaluation::create(['nom' => 'TP', 'coefficient_defaut' => 1]);
        TypeEvaluation::create(['nom' => 'Devoir', 'coefficient_defaut' => 1]);
        TypeEvaluation::create(['nom' => 'Contrôle continu', 'coefficient_defaut' => 1.5]);
        TypeEvaluation::create(['nom' => 'Examen', 'coefficient_defaut' => 2]);

        // Devoirs — pas de soumissions pré-créées (elles nécessiteraient un vrai
        // fichier sur disque) ; les étudiants peuvent en déposer une réelle en testant.
        Devoir::create(['module_id' => $modDevWeb->id, 'formateur_id' => $mohammed->id, 'titre' => 'Maquette de la page d’accueil', 'description' => 'Réaliser une maquette HTML/CSS responsive de la page d’accueil vue en cours.', 'date_limite' => now()->addDays(10)]);
        Devoir::create(['module_id' => $modBdd->id, 'formateur_id' => $mohammed->id, 'titre' => 'Modélisation MCD', 'description' => 'Proposer un modèle conceptuel de données pour le projet fil rouge.', 'date_limite' => now()->addDays(4)]);
    }
}
