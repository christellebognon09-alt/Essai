<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('elements_constitutifs', function (Blueprint $table) {
            $table->float('credits')->default(0)->after('nom');
        });
    }

    public function down(): void
    {
        Schema::table('elements_constitutifs', function (Blueprint $table) {
            $table->dropColumn('credits');
        });
    }
};
