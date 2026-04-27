<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Filiere;

class SILSeeder extends Seeder
{
    public function run(): void
    {
        $filiere = Filiere::where('code', 'SIL')->first();
        if (!$filiere) return;

        $matieresS1 = [
            ['code' => 'ALP1104', 'nom' => 'Algorithme et Programmation', 'credits' => 6, 'ecs' => ['Informatique Fondamentale', 'Algorithmique', 'Langage C']],
            ['code' => 'COM1100', 'nom' => 'Communication', 'credits' => 4, 'ecs' => ['TEEO', 'Anglais']],
            ['code' => 'ICE1102', 'nom' => 'Architecture et Mesures', 'credits' => 5, 'ecs' => ['Logique Combinatoire', 'Mesures électriques']],
            ['code' => 'IWL1110', 'nom' => 'Administration Windows & Linux', 'credits' => 6, 'ecs' => ['Admin Windows', 'Admin Linux']],
            ['code' => 'MAT1101', 'nom' => 'Mathématiques Générales', 'credits' => 5, 'ecs' => ['Analyse', 'Algèbre']],
            ['code' => 'TCM1103', 'nom' => 'Techno. Composants & Mesures', 'credits' => 4, 'ecs' => ['Schéma Électriques', 'Circuits Électriques']],
        ];

        $matieresS2 = [
            ['code' => 'ECO1209', 'nom' => 'Economie et Comptabilité', 'credits' => 6, 'ecs' => ['Comptabilité générale', "Economie d'entreprise"]],
            ['code' => 'IGW1210', 'nom' => 'Génie Logiciel & Programmation Web', 'credits' => 6, 'ecs' => ['Programmation Web', 'Génie Logiciel']],
            ['code' => 'PRJ1210', 'nom' => 'Projet Informatique', 'credits' => 6, 'ecs' => ["Projet d'informatique"]],
            ['code' => 'PRS1210', 'nom' => 'Probabilités et Statistiques', 'credits' => 6, 'ecs' => ['Probabilités', 'Statistiques']],
            ['code' => 'SSI1207', 'nom' => 'Système d\'information', 'credits' => 6, 'ecs' => ['Bases de données', 'Mérise']],
        ];

        foreach ($matieresS1 as $m) {
            $matiere = $filiere->matieres()->firstOrCreate(
                ['code' => $m['code']],
                ['nom' => $m['nom'], 'credits' => $m['credits'], 'semestre' => 1]
            );
            foreach ($m['ecs'] as $ec) {
                $matiere->elementsConstitutifs()->firstOrCreate(['nom' => $ec]);
            }
        }

        foreach ($matieresS2 as $m) {
            $matiere = $filiere->matieres()->firstOrCreate(
                ['code' => $m['code']],
                ['nom' => $m['nom'], 'credits' => $m['credits'], 'semestre' => 2]
            );
            foreach ($m['ecs'] as $ec) {
                $matiere->elementsConstitutifs()->firstOrCreate(['nom' => $ec]);
            }
        }
    }
}
