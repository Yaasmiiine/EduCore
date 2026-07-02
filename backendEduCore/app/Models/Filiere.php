<?php

namespace App\Models;

use App\Models\Concerns\LogsActivity;
use Illuminate\Database\Eloquent\Model;

class Filiere extends Model
{
    use LogsActivity;

    protected $fillable = ['nom', 'code', 'description'];

    public function groupes()
    {
        return $this->hasMany(Groupe::class);
    }

    public function modules()
    {
        return $this->hasMany(Module::class);
    }
}
