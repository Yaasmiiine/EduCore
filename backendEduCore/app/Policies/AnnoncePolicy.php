<?php

namespace App\Policies;

use App\Models\Annonce;
use App\Models\User;

class AnnoncePolicy
{
    public function update(User $user, Annonce $annonce): bool
    {
        return $user->isAdmin() || $user->id === $annonce->auteur_id;
    }

    public function delete(User $user, Annonce $annonce): bool
    {
        return $user->isAdmin() || $user->id === $annonce->auteur_id;
    }
}
