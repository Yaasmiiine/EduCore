<?php

namespace App\Models;

use App\Models\Concerns\LogsActivity;
use Illuminate\Database\Eloquent\Model;

class Annonce extends Model
{
    use LogsActivity;

    protected $fillable = [
        'auteur_id', 'groupe_id', 'titre', 'contenu', 'priorite'
    ];

    public function auteur()
    {
        return $this->belongsTo(User::class, 'auteur_id');
    }

    public function groupe()
    {
        return $this->belongsTo(Groupe::class);
    }
}
