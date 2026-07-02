<?php

namespace App\Models;

use App\Models\Concerns\LogsActivity;
use Illuminate\Database\Eloquent\Model;

class Devoir extends Model
{
    use LogsActivity;

    protected $fillable = ['module_id', 'groupe_id', 'formateur_id', 'titre', 'description', 'date_limite'];

    protected $casts = [
        'date_limite' => 'datetime',
    ];

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function groupe()
    {
        return $this->belongsTo(Groupe::class);
    }

    public function formateur()
    {
        return $this->belongsTo(User::class, 'formateur_id');
    }

    public function soumissions()
    {
        return $this->hasMany(Soumission::class);
    }

    // date_limite comes from a <input type="datetime-local"> with no timezone
    // info — the browser means it as local wall-clock time. Serializing
    // without a timezone suffix means `new Date(...)` on the frontend parses
    // it back as local time too, so the round-trip stays exact regardless of
    // server/browser timezone (this app has no multi-timezone requirement).
    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('Y-m-d\TH:i:s');
    }
}
