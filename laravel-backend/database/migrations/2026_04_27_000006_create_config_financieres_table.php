<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('config_financieres', function (Blueprint $table) {
            $table->id();
            $table->foreignId('filiere_id')->constrained('filieres')->onDelete('cascade');
            $table->integer('inscription')->default(0);
            $table->date('inscription_deadline')->nullable();
            $table->integer('tranche1')->default(0);
            $table->date('tranche1_deadline')->nullable();
            $table->integer('tranche2')->default(0);
            $table->date('tranche2_deadline')->nullable();
            $table->integer('tranche3')->default(0);
            $table->date('tranche3_deadline')->nullable();
            $table->integer('frais_stage')->default(0);
            $table->date('frais_stage_deadline')->nullable();
            $table->integer('frais_dossier')->default(0);
            $table->date('frais_dossier_deadline')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('config_financieres');
    }
};
