<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('academic_tariffs', function (Blueprint $table) {
            $table->id();
            $table->string('label');
            $table->integer('price');
            $table->timestamps();
        });

        Schema::create('extra_frais_filieres', function (Blueprint $table) {
            $table->id();
            $table->foreignId('filiere_id')->constrained('filieres')->onDelete('cascade');
            $table->string('label');
            $table->integer('amount');
            $table->date('deadline')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('academic_tariffs');
        Schema::dropIfExists('extra_frais_filieres');
    }
};
