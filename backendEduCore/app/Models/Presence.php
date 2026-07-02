<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Presence extends Model
{
    protected $fillable = [
        'emploi_du_temps_id', 'user_id', 'formateur_id', 'date', 'statut'
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function emploiDuTemps()
    {
        return $this->belongsTo(EmploiDuTemps::class, 'emploi_du_temps_id');
    }

    public function stagiaire()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function formateur()
    {
        return $this->belongsTo(User::class, 'formateur_id');
    }
}
