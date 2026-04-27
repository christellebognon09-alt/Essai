<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConfigFinanciere extends Model
{
    protected $fillable = [
        'filiere_id',
        'inscription',
        'inscription_deadline',
        'tranche1',
        'tranche1_deadline',
        'tranche2',
        'tranche2_deadline',
        'tranche3',
        'tranche3_deadline',
        'frais_stage',
        'frais_stage_deadline',
        'frais_dossier',
        'frais_dossier_deadline',
    ];

    public function filiere()
    {
        return $this->belongsTo(Filiere::class);
    }
}
