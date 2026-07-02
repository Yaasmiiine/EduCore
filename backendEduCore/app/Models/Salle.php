<?php

namespace App\Models;

use App\Models\Concerns\LogsActivity;
use Illuminate\Database\Eloquent\Model;

class Salle extends Model
{
    use LogsActivity;

    protected $fillable = [
        'nom', 'code', 'batiment', 'capacite', 'equipement', 'statut'
    ];

    public function emploisDuTemps()
    {
        return $this->hasMany(EmploiDuTemps::class);
    }
}
