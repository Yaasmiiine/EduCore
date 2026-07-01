<?php

namespace App\Observers;

use App\Models\Annonce;
use App\Models\Notification;
use App\Models\User;

class AnnonceObserver
{
    public function created(Annonce $annonce): void
    {
        $recipients = $annonce->groupe_id
            ? User::where('groupe_id', $annonce->groupe_id)->pluck('id')
            : User::pluck('id');

        $now = now();
        $rows = $recipients
            ->reject(fn ($id) => $id === $annonce->auteur_id)
            ->map(fn ($id) => [
                'user_id'    => $id,
                'type'       => 'annonce',
                'message'    => "Nouvelle annonce : {$annonce->titre}",
                'link'       => '/announcements',
                'created_at' => $now,
                'updated_at' => $now,
            ]);

        if ($rows->isNotEmpty()) {
            Notification::insert($rows->all());
        }
    }
}
