<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('emplois_du_temps', function (Blueprint $table) {
            $table->enum('type', ['cours', 'examen', 'tp', 'controle'])->default('cours')->after('salle_id');
            $table->date('date_examen')->nullable()->after('type');
        });
    }

    public function down(): void
    {
        Schema::table('emplois_du_temps', function (Blueprint $table) {
            $table->dropColumn(['type', 'date_examen']);
        });
    }
};
