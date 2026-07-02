<?php

namespace App\Models\Concerns;

use App\Models\ActivityLog;

// Writes a row to activity_logs whenever a model using this trait is
// created/updated/deleted by an authenticated user. Skips seeder/console
// writes (no authenticated actor) so the log only reflects real app activity.
trait LogsActivity
{
    protected static function bootLogsActivity(): void
    {
        static::created(fn ($model) => $model->recordActivity('created'));
        static::updated(fn ($model) => $model->recordActivity('updated'));
        static::deleted(fn ($model) => $model->recordActivity('deleted'));
    }

    public function recordActivity(string $action): void
    {
        $userId = auth('api')->id();

        if (! $userId) {
            return;
        }

        ActivityLog::create([
            'user_id'     => $userId,
            'action'      => $action,
            'sujet_type'  => class_basename(static::class),
            'sujet_id'    => $this->getKey(),
            'description' => $this->activityDescription($action),
        ]);
    }

    protected function activityDescription(string $action): string
    {
        $label = $this->nom ?? $this->titre ?? $this->code ?? "#{$this->getKey()}";
        $verbe = match ($action) {
            'created' => 'créé',
            'updated' => 'modifié',
            'deleted' => 'supprimé',
            default   => $action,
        };

        return class_basename(static::class) . " « {$label} » {$verbe}";
    }
}
