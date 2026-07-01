<?php

namespace App\Providers;

use App\Models\Annonce;
use App\Models\EmploiDuTemps;
use App\Observers\AnnonceObserver;
use App\Observers\EmploiDuTempsObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Annonce::observe(AnnonceObserver::class);
        EmploiDuTemps::observe(EmploiDuTempsObserver::class);
    }
}
