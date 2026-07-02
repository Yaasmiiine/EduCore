<?php

namespace App\Models;

use App\Models\Concerns\LogsActivity;
use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    use LogsActivity;

    protected $fillable = [
        'filiere_id', 'formateur_id', 'nom', 'code', 'description', 'heures_total'
    ];

    public function filiere()
    {
        return $this->belongsTo(Filiere::class);
    }

    public function formateur()
    {
        return $this->belongsTo(User::class, 'formateur_id');
    }

    public function fichiers()
    {
        return $this->hasMany(Fichier::class);
    }

    public function emploisDuTemps()
    {
        return $this->hasMany(EmploiDuTemps::class);
    }

    public function notes()
    {
        return $this->hasMany(Note::class);
    }

    public function messages()
    {
        return $this->hasMany(ModuleMessage::class);
    }
}
