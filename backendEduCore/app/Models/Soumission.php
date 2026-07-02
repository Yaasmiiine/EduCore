<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Soumission extends Model
{
    protected $fillable = ['devoir_id', 'user_id', 'fichier', 'nom_fichier', 'taille'];

    public function devoir()
    {
        return $this->belongsTo(Devoir::class);
    }

    public function stagiaire()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
