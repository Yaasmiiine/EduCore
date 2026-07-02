<?php

namespace App\Models;

use App\Models\Concerns\LogsActivity;
use Illuminate\Database\Eloquent\Model;

class EmploiDuTemps extends Model
{
    use LogsActivity;

    protected $table = 'emplois_du_temps';

    protected $fillable = [
        'groupe_id', 'module_id', 'formateur_id', 'salle_id', 'jour', 'heure_debut', 'heure_fin',
        'type', 'date_examen'
    ];

    protected $casts = [
        'date_examen' => 'date',
    ];

    public function groupe()
    {
        return $this->belongsTo(Groupe::class);
    }

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function formateur()
    {
        return $this->belongsTo(User::class, 'formateur_id');
    }

    public function salle()
    {
        return $this->belongsTo(Salle::class);
    }

    public function presences()
    {
        return $this->hasMany(Presence::class, 'emploi_du_temps_id');
    }

    protected function activityDescription(string $action): string
    {
        $verbe = match ($action) {
            'created' => 'créée',
            'updated' => 'modifiée',
            'deleted' => 'supprimée',
            default   => $action,
        };

        return "Séance « {$this->module?->nom} — {$this->jour} » {$verbe}";
    }
}
