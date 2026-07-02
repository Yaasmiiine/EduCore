<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TypeEvaluation extends Model
{
    protected $table = 'types_evaluation';

    protected $fillable = ['nom', 'coefficient_defaut'];

    protected $casts = [
        'coefficient_defaut' => 'float',
    ];
}
