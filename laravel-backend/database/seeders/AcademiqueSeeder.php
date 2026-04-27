<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Departement;

class AcademiqueSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            'Génie Biologique' => [
                ['nom' => 'Analyses Biologiques et Biochimiques', 'code' => 'ABB'],
                ['nom' => "Génie de l'Environnement-Traitement des Déchets et Eaux", 'code' => 'GETDE']
            ],
            'Génie Civil' => [
                ['nom' => 'Bâtiment et Travaux Publics', 'code' => 'BTP'],
                ['nom' => 'Géomètre Topographe', 'code' => 'GT']
            ],
            'Génie Électrique' => [
                ['nom' => 'Génie Electrique et Energies Renouvelables', 'code' => 'GEER']
            ],
            'Génie Informatique' => [
                ['nom' => 'Système Informatique et logiciel', 'code' => 'SIL']
            ],
            'Sciences de Gestion' => [
                ['nom' => 'Banque Finance Assurance', 'code' => 'BFA'],
                ['nom' => 'Finance Comptabilité Audit', 'code' => 'FCA'],
                ['nom' => 'Gestion des Ressources Humaines', 'code' => 'GRH'],
                ['nom' => 'Hôtellerie Tourisme', 'code' => 'HT'],
                ['nom' => 'Marketing Communication Commerce', 'code' => 'MCC'],
                ['nom' => 'Transport Logistique', 'code' => 'TL']
            ]
        ];

        foreach ($data as $deptNom => $filieres) {
            $departement = Departement::firstOrCreate(['nom' => $deptNom]);

            foreach ($filieres as $filiereData) {
                $departement->filieres()->firstOrCreate([
                    'code' => $filiereData['code']
                ], [
                    'nom' => $filiereData['nom']
                ]);
            }
        }
        
        // Créer une année académique par défaut
        \App\Models\AnneeAcademique::firstOrCreate([
            'nom' => '2025-2026',
        ], [
            'date_debut' => '2025-09-01',
            'date_fin' => '2026-07-31',
            'est_active' => true
        ]);
    }
}
