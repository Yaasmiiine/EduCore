<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable;

    protected $fillable = [
        'role_id', 'groupe_id', 'nom', 'prenom', 'email', 'password', 'photo'
    ];

    protected $hidden = ['password'];

    // JWT required methods
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    // Relations
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function groupe()
    {
        return $this->belongsTo(Groupe::class);
    }

    public function modules()
    {
        return $this->hasMany(Module::class, 'formateur_id');
    }

    public function annonces()
    {
        return $this->hasMany(Annonce::class, 'auteur_id');
    }

    public function fichiers()
    {
        return $this->hasMany(Fichier::class);
    }

    public function emploisDuTemps()
    {
        return $this->hasMany(EmploiDuTemps::class, 'formateur_id');
    }

    // Helpers
    public function isAdmin()
    {
        return $this->role->nom === 'admin';
    }

    public function isFormateur()
    {
        return $this->role->nom === 'formateur';
    }

    public function isStagiaire()
    {
        return $this->role->nom === 'stagiaire';
    }
}
