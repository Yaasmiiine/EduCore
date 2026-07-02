<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\Note;
use App\Models\Presence;
use App\Models\User;
use Illuminate\Http\Request;

class FormateurController extends Controller
{
    // GET /api/mes-etudiants — every stagiaire enrolled in a filière taught by
    // the authenticated formateur (admin sees none, they have no modules),
    // each with a quick moyenne/taux de présence computed across that
    // formateur's own modules only.
    public function mesEtudiants(Request $request)
    {
        $formateur = $request->user();

        $modules = Module::where('formateur_id', $formateur->id)->get();
        $moduleIds = $modules->pluck('id');
        $filiereIds = $modules->pluck('filiere_id')->unique();

        $etudiants = User::whereHas('groupe', fn ($q) => $q->whereIn('filiere_id', $filiereIds))
            ->with('groupe')
            ->orderBy('nom')
            ->get();

        $notes = Note::whereIn('module_id', $moduleIds)
            ->whereIn('user_id', $etudiants->pluck('id'))
            ->get()
            ->groupBy('user_id');

        $presences = Presence::whereHas('emploiDuTemps', fn ($q) => $q->whereIn('module_id', $moduleIds))
            ->whereIn('user_id', $etudiants->pluck('id'))
            ->get()
            ->groupBy('user_id');

        $result = $etudiants->map(function ($etudiant) use ($notes, $presences) {
            $studentNotes = $notes->get($etudiant->id, collect());
            $totalCoef = $studentNotes->sum('coefficient');
            $moyenne = $totalCoef > 0
                ? round($studentNotes->sum(fn ($n) => $n->valeur * $n->coefficient) / $totalCoef, 2)
                : null;

            $studentPresences = $presences->get($etudiant->id, collect());
            $total = $studentPresences->count();
            $present = $studentPresences->whereIn('statut', ['present', 'retard'])->count();
            $tauxPresence = $total > 0 ? round(($present / $total) * 100, 1) : null;

            return [
                'id'             => $etudiant->id,
                'nom'            => $etudiant->nom,
                'prenom'         => $etudiant->prenom,
                'email'          => $etudiant->email,
                'groupe'         => $etudiant->groupe,
                'moyenne'        => $moyenne,
                'taux_presence'  => $tauxPresence,
            ];
        });

        return response()->json($result);
    }

    // GET /api/mes-statistiques — per-module aggregate stats (moyenne
    // générale, taux de réussite, taux de présence, effectif) for every
    // module the authenticated formateur teaches.
    public function mesStatistiques(Request $request)
    {
        $formateur = $request->user();
        $modules = Module::where('formateur_id', $formateur->id)->get();

        $stats = $modules->map(function ($module) {
            $notesParEtudiant = Note::where('module_id', $module->id)->get()->groupBy('user_id');

            $moyennesEtudiants = $notesParEtudiant->map(function ($notes) {
                $totalCoef = $notes->sum('coefficient');
                return $totalCoef > 0
                    ? $notes->sum(fn ($n) => $n->valeur * $n->coefficient) / $totalCoef
                    : null;
            })->filter(fn ($m) => $m !== null);

            $moyenneGenerale = $moyennesEtudiants->count() ? round($moyennesEtudiants->avg(), 2) : null;
            $tauxReussite = $moyennesEtudiants->count()
                ? round(($moyennesEtudiants->filter(fn ($m) => $m >= 10)->count() / $moyennesEtudiants->count()) * 100, 1)
                : null;

            $presences = Presence::whereHas('emploiDuTemps', fn ($q) => $q->where('module_id', $module->id))->get();
            $totalPresences = $presences->count();
            $tauxPresence = $totalPresences > 0
                ? round(($presences->whereIn('statut', ['present', 'retard'])->count() / $totalPresences) * 100, 1)
                : null;

            $effectif = User::whereHas('groupe', fn ($q) => $q->where('filiere_id', $module->filiere_id))->count();

            return [
                'module'           => ['id' => $module->id, 'nom' => $module->nom, 'code' => $module->code],
                'effectif'         => $effectif,
                'moyenne_generale' => $moyenneGenerale,
                'taux_reussite'    => $tauxReussite,
                'taux_presence'    => $tauxPresence,
            ];
        });

        return response()->json($stats);
    }
}
