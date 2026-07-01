<?php

namespace App\Services;

use App\Models\EmploiDuTemps;
use Illuminate\Support\Collection;

class ScheduleConflictService
{
    /**
     * Find existing séances that overlap the given slot on the same groupe,
     * formateur, or salle.
     */
    public function findOverlaps(
        string $jour,
        string $heureDebut,
        string $heureFin,
        int $groupeId,
        int $formateurId,
        int $salleId,
        ?int $excludeId = null
    ): Collection {
        return EmploiDuTemps::with('groupe', 'module', 'formateur', 'salle')
            ->where('jour', $jour)
            ->where(function ($q) use ($groupeId, $formateurId, $salleId) {
                $q->where('groupe_id', $groupeId)
                    ->orWhere('formateur_id', $formateurId)
                    ->orWhere('salle_id', $salleId);
            })
            ->where('heure_debut', '<', $heureFin)
            ->where('heure_fin', '>', $heureDebut)
            ->when($excludeId, fn ($q) => $q->where('id', '!=', $excludeId))
            ->get();
    }

    /**
     * Scan every séance against every other and report overlapping pairs
     * that share a salle, formateur, or groupe on the same jour.
     */
    public function findAllConflicts(): array
    {
        $seances = EmploiDuTemps::with('groupe', 'module', 'formateur', 'salle')->get();
        $conflicts = [];

        foreach ($seances as $a) {
            foreach ($seances as $b) {
                if ($a->id >= $b->id || $a->jour !== $b->jour) {
                    continue;
                }

                $overlaps = $a->heure_debut < $b->heure_fin && $a->heure_fin > $b->heure_debut;
                if (! $overlaps) {
                    continue;
                }

                $sharedSalle = $a->salle_id === $b->salle_id;
                $sharedFormateur = $a->formateur_id === $b->formateur_id;
                $sharedGroupe = $a->groupe_id === $b->groupe_id;

                if (! $sharedSalle && ! $sharedFormateur && ! $sharedGroupe) {
                    continue;
                }

                [$type, $severity] = match (true) {
                    $sharedSalle => ['Conflit Salle', 'Critique'],
                    $sharedFormateur => ['Conflit Enseignant', 'Moyen'],
                    default => ['Conflit Groupe', 'Faible'],
                };

                $conflicts[] = [
                    'id' => "{$a->id}-{$b->id}",
                    'type' => $type,
                    'severity' => $severity,
                    'jour' => $a->jour,
                    'seance_a' => $a,
                    'seance_b' => $b,
                ];
            }
        }

        return $conflicts;
    }
}
