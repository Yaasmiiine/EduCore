<?php

namespace App\Models;

use App\Models\Concerns\LogsActivity;
use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    use LogsActivity;

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

    protected function activityDescription(string $action): string
    {
        $verbe = match ($action) {
            'created' => 'ajoutée',
            'updated' => 'modifiée',
            'deleted' => 'supprimée',
            default   => $action,
        };

        $eleve = $this->stagiaire ? "{$this->stagiaire->prenom} {$this->stagiaire->nom}" : "#{$this->user_id}";

        return "Note {$this->type} de {$eleve} {$verbe}";
    }
}
