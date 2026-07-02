<?php

namespace App\Models;

use App\Models\Concerns\LogsActivity;
use Illuminate\Database\Eloquent\Model;

class Groupe extends Model
{
    use LogsActivity;

    protected $fillable = ['filiere_id', 'nom', 'annee'];

    public function filiere()
    {
        return $this->belongsTo(Filiere::class);
    }

    public function emploisDuTemps()
    {
        return $this->hasMany(EmploiDuTemps::class);
    }

    public function annonces()
    {
        return $this->hasMany(Annonce::class);
    }

    public function stagiaires()
    {
        return $this->hasMany(User::class);
    }
}
