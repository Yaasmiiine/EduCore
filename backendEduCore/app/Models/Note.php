<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    protected $fillable = [
        'user_id', 'module_id', 'formateur_id', 'type', 'valeur', 'coefficient', 'commentaire', 'date_evaluation'
    ];

    protected $casts = [
        'valeur'          => 'float',
        'coefficient'     => 'float',
        'date_evaluation' => 'date',
    ];

    public function stagiaire()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function formateur()
    {
        return $this->belongsTo(User::class, 'formateur_id');
    }
}
