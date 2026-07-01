<?php

namespace App\Observers;

use App\Models\EmploiDuTemps;
use App\Models\Module;
use App\Models\Notification;
use App\Models\User;

class EmploiDuTempsObserver
{
    public function created(EmploiDuTemps $seance): void
    {
        $this->notify($seance, 'Nouvelle séance ajoutée à votre emploi du temps');
    }

    public function updated(EmploiDuTemps $seance): void
    {
        $this->notify($seance, 'Une séance de votre emploi du temps a été modifiée');
    }

    private function notify(EmploiDuTemps $seance, string $verb): void
    {
        $recipientIds = User::where('groupe_id', $seance->groupe_id)->pluck('id');
        if ($seance->formateur_id) {
            $recipientIds->push($seance->formateur_id);
        }

        $moduleNom = Module::find($seance->module_id)?->nom ?? 'un module';
        $message = "{$verb} ({$moduleNom} - {$seance->jour})";

        $now = now();
        $rows = $recipientIds->unique()->map(fn ($id) => [
            'user_id'    => $id,
            'type'       => 'emploi_du_temps',
            'message'    => $message,
            'link'       => '/schedule',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        if ($rows->isNotEmpty()) {
            Notification::insert($rows->all());
        }
    }
}
