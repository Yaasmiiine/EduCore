<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('soumissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('devoir_id')->constrained('devoirs')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('fichier');
            $table->string('nom_fichier');
            $table->bigInteger('taille');
            $table->timestamps();

            $table->unique(['devoir_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('soumissions');
    }
};
