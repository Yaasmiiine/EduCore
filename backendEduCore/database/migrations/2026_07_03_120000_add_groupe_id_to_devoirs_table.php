<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('devoirs', function (Blueprint $table) {
            // Nullable: a devoir without a groupe_id targets every groupe of
            // the module's filière (the original behavior); setting it
            // narrows the assignment to a single class.
            $table->foreignId('groupe_id')->nullable()->after('module_id')->constrained('groupes')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('devoirs', function (Blueprint $table) {
            $table->dropConstrainedForeignId('groupe_id');
        });
    }
};
