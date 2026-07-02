<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('types_evaluation', function (Blueprint $table) {
            $table->id();
            $table->string('nom')->unique();
            $table->decimal('coefficient_defaut', 3, 1)->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('types_evaluation');
    }
};
