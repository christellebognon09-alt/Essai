<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Filiere;
use App\Models\ConfigFinanciere;

class FinancesSeeder extends Seeder
{
    public function run()
    {
        $filieres = Filiere::all();

        foreach ($filieres as $filiere) {
            ConfigFinanciere::updateOrCreate(
                ['filiere_id' => $filiere->id],
                [
                    'inscription' => 30000,
                    'inscription_deadline' => '2026-09-01',
                    'tranche1' => 250000,
                    'tranche1_deadline' => '2026-10-15',
                    'tranche2' => 100000,
                    'tranche2_deadline' => '2026-12-15',
                    'tranche3' => 90000,
                    'tranche3_deadline' => '2027-02-15',
                    'frais_stage' => 10000,
                    'frais_stage_deadline' => '2027-05-15',
                    'frais_dossier' => 30000,
                    'frais_dossier_deadline' => '2026-12-15',
                ]
            );
        }
    }
}
