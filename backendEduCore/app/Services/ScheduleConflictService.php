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
}
