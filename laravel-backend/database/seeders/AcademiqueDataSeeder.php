<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Filiere;
use App\Models\Matiere;
use App\Models\ElementConstitutif;

class AcademiqueDataSeeder extends Seeder
{
    public function run()
    {
        $commonL1 = [
            'S1' => [
                ['nom' => 'Anglais Technique', 'code' => 'ANG101', 'credits' => 2, 'ec' => ['Grammar', 'Communication']],
                ['nom' => 'Français / Expression', 'code' => 'FRA101', 'credits' => 2, 'ec' => ['Techniques d\'expression', 'Rédaction']],
                ['nom' => 'Informatique de base', 'code' => 'INF101', 'credits' => 3, 'ec' => ['Word/Excel', 'Internet']],
            ]
        ];

        $filiereData = [
            'Système Informatique et logiciel' => [
                'L1' => ['S1' => [['nom' => 'Algorithmique', 'code' => 'SIL101', 'credits' => 6, 'ec' => ['Pseudo-code', 'C']], ['nom' => 'Architecture', 'code' => 'SIL102', 'credits' => 4, 'ec' => ['Hardware']]], 'S2' => [['nom' => 'Web Statique', 'code' => 'SIL103', 'credits' => 5, 'ec' => ['HTML/CSS']]]],
                'L2' => ['S3' => [['nom' => 'POO', 'code' => 'SIL201', 'credits' => 6, 'ec' => ['Java/C#']]], 'S4' => [['nom' => 'Réseaux', 'code' => 'SIL202', 'credits' => 5, 'ec' => ['Cisco']]]],
                'L3' => ['S5' => [['nom' => 'Génie Logiciel', 'code' => 'SIL301', 'credits' => 6, 'ec' => ['UML', 'Agile']]], 'S6' => [['nom' => 'PFE', 'code' => 'SIL304', 'credits' => 15, 'ec' => ['Mémoire', 'Soutenance']]]]
            ],
            'Analyses Biologiques et Biochimiques' => [
                'L1' => [
                    'S1' => [
                        ['nom' => 'Chimie Bio-organique', 'code' => 'ABB101', 'credits' => 5, 'ec' => ['Atomes', 'Liaisons']],
                        ['nom' => 'Biologie Cellulaire', 'code' => 'ABB102', 'credits' => 6, 'ec' => ['Organites', 'Cycle cellulaire']],
                        ['nom' => 'Physique Appliquée', 'code' => 'ABB103', 'credits' => 4, 'ec' => ['Optique', 'Rayonnements']],
                    ],
                    'S2' => [
                        ['nom' => 'Biochimie Structurale', 'code' => 'ABB104', 'credits' => 6, 'ec' => ['Glucides', 'Lipides', 'Protéines']],
                        ['nom' => 'Microbiologie Générale', 'code' => 'ABB105', 'credits' => 5, 'ec' => ['Bactériologie', 'Virologie']],
                        ['nom' => 'Santé au Laboratoire', 'code' => 'ABB106', 'credits' => 3, 'ec' => ['Risques', 'Premiers secours']],
                    ]
                ],
                'L2' => [
                    'S3' => [
                        ['nom' => 'Immunologie', 'code' => 'ABB201', 'credits' => 6, 'ec' => ['Innée', 'Adaptative']],
                        ['nom' => 'Hématologie I', 'code' => 'ABB202', 'credits' => 5, 'ec' => ['Globules rouges', 'Anémies']],
                        ['nom' => 'Physiologie Humaine', 'code' => 'ABB203', 'credits' => 4, 'ec' => ['Digestif', 'Respiratoire']],
                    ],
                    'S4' => [
                        ['nom' => 'Biochimie Métabolique', 'code' => 'ABB204', 'credits' => 6, 'ec' => ['Glycolyse', 'Cycle de Krebs']],
                        ['nom' => 'Génétique Moléculaire', 'code' => 'ABB205', 'credits' => 5, 'ec' => ['ADN', 'Réplication']],
                        ['nom' => 'Microbiologie Médicale', 'code' => 'ABB206', 'credits' => 4, 'ec' => ['Pathogènes', 'Antibiotiques']],
                    ]
                ],
                'L3' => [
                    'S5' => [
                        ['nom' => 'Parasitologie/Mycologie', 'code' => 'ABB301', 'credits' => 6, 'ec' => ['Paludisme', 'Champignons']],
                        ['nom' => 'Enzymologie Clinique', 'code' => 'ABB302', 'credits' => 5, 'ec' => ['Marqueurs', 'Cinétique']],
                        ['nom' => 'Qualité en Labo', 'code' => 'ABB303', 'credits' => 4, 'ec' => ['ISO 15189', 'Audit']],
                    ],
                    'S6' => [
                        ['nom' => 'Projet Professionnel', 'code' => 'ABB304', 'credits' => 15, 'ec' => ['Mémoire', 'Soutenance']],
                    ]
                ]
            ],
            'Bâtiment et Travaux Publics' => [
                'L1' => ['S1' => [['nom' => 'RDM I', 'code' => 'BTP101', 'credits' => 6, 'ec' => ['Statique']]], 'S2' => [['nom' => 'Matériaux', 'code' => 'BTP103', 'credits' => 5, 'ec' => ['Béton']]]],
                'L2' => ['S3' => [['nom' => 'Géotechnique', 'code' => 'BTP201', 'credits' => 5, 'ec' => ['Sols']]], 'S4' => [['nom' => 'Topographie', 'code' => 'BTP202', 'credits' => 5, 'ec' => ['Levés']]]],
                'L3' => ['S5' => [['nom' => 'Calcul Structures', 'code' => 'BTP301', 'credits' => 6, 'ec' => ['BIM']]], 'S6' => [['nom' => 'Projet Fin Etude', 'code' => 'BTP303', 'credits' => 15, 'ec' => ['Mémoire']]]]
            ],
            'Banque Finance Assurance' => [
                'L1' => ['S1' => [['nom' => 'Economie', 'code' => 'BFA101', 'credits' => 5, 'ec' => ['Micro']]], 'S2' => [['nom' => 'Comptabilité', 'code' => 'BFA103', 'credits' => 5, 'ec' => ['Bilan']]]],
                'L2' => ['S3' => [['nom' => 'Math Financières', 'code' => 'BFA201', 'credits' => 6, 'ec' => ['Annuités']]], 'S4' => [['nom' => 'Assurances', 'code' => 'BFA202', 'credits' => 5, 'ec' => ['IARD']]]],
                'L3' => ['S5' => [['nom' => 'Gestion Portefeuille', 'code' => 'BFA301', 'credits' => 6, 'ec' => ['Bourse']]], 'S6' => [['nom' => 'Stage', 'code' => 'BFA303', 'credits' => 15, 'ec' => ['Rapport']]]]
            ],
            'Finance Comptabilité Audit' => [
                'L1' => ['S1' => [['nom' => 'Comptabilité I', 'code' => 'FCA101', 'credits' => 6, 'ec' => ['Journal']]], 'S2' => [['nom' => 'Droit Civil', 'code' => 'FCA103', 'credits' => 4, 'ec' => ['Contrats']]]],
                'L2' => ['S3' => [['nom' => 'Compta Analytique', 'code' => 'FCA201', 'credits' => 6, 'ec' => ['Coûts']]], 'S4' => [['nom' => 'Fiscalité I', 'code' => 'FCA202', 'credits' => 5, 'ec' => ['TVA']]]],
                'L3' => ['S5' => [['nom' => 'Audit Financier', 'code' => 'FCA301', 'credits' => 6, 'ec' => ['Contrôle']]], 'S6' => [['nom' => 'Mémoire', 'code' => 'FCA303', 'credits' => 15, 'ec' => ['Soutenance']]]]
            ],
            'Gestion des Ressources Humaines' => [
                'L1' => ['S1' => [['nom' => 'Management', 'code' => 'GRH101', 'credits' => 5, 'ec' => ['Théories']]], 'S2' => [['nom' => 'Droit Travail', 'code' => 'GRH103', 'credits' => 5, 'ec' => ['Contrats']]]],
                'L2' => ['S3' => [['nom' => 'Gestion de Paie', 'code' => 'GRH201', 'credits' => 6, 'ec' => ['Salaires']]], 'S4' => [['nom' => 'Recrutement', 'code' => 'GRH202', 'credits' => 5, 'ec' => ['Tests']]]],
                'L3' => ['S5' => [['nom' => 'Stratégie RH', 'code' => 'GRH301', 'credits' => 6, 'ec' => ['GPEC']]], 'S6' => [['nom' => 'Stage', 'code' => 'GRH303', 'credits' => 15, 'ec' => ['Soutenance']]]]
            ],
            'Marketing Communication Commerce' => [
                'L1' => ['S1' => [['nom' => 'Marketing Base', 'code' => 'MCC101', 'credits' => 5, 'ec' => ['4P']]], 'S2' => [['nom' => 'Communication', 'code' => 'MCC103', 'credits' => 5, 'ec' => ['Médias']]]],
                'L2' => ['S3' => [['nom' => 'Comportement Conso', 'code' => 'MCC201', 'credits' => 6, 'ec' => ['Psychologie']]], 'S4' => [['nom' => 'Négociation', 'code' => 'MCC202', 'credits' => 5, 'ec' => ['Vente']]]],
                'L3' => ['S5' => [['nom' => 'Marketing Digital', 'code' => 'MCC301', 'credits' => 6, 'ec' => ['SEO/Social']]], 'S6' => [['nom' => 'Stage', 'code' => 'MCC303', 'credits' => 15, 'ec' => ['Rapport']]]]
            ],
            'Transport Logistique' => [
                'L1' => ['S1' => [['nom' => 'Intro Logistique', 'code' => 'TL101', 'credits' => 5, 'ec' => ['Supply Chain']]], 'S2' => [['nom' => 'Modes Transport', 'code' => 'TL103', 'credits' => 5, 'ec' => ['Maritime/Air']]]],
                'L2' => ['S3' => [['nom' => 'Gestion Stocks', 'code' => 'TL201', 'credits' => 6, 'ec' => ['Inventaire']]], 'S4' => [['nom' => 'Transit/Douane', 'code' => 'TL202', 'credits' => 5, 'ec' => ['Import/Export']]]],
                'L3' => ['S5' => [['nom' => 'Logistique Inter', 'code' => 'TL301', 'credits' => 6, 'ec' => ['Incoterms']]], 'S6' => [['nom' => 'Mémoire', 'code' => 'TL303', 'credits' => 15, 'ec' => ['Soutenance']]]]
            ],
            'Géomètre Topographe' => [
                'L1' => ['S1' => [['nom' => 'Optique/Physique', 'code' => 'GT101', 'credits' => 5, 'ec' => ['Lumière']]], 'S2' => [['nom' => 'Levé Plan', 'code' => 'GT103', 'credits' => 5, 'ec' => ['Théodolite']]]],
                'L2' => ['S3' => [['nom' => 'Géodésie', 'code' => 'GT201', 'credits' => 6, 'ec' => ['GPS']]], 'S4' => [['nom' => 'Cartographie', 'code' => 'GT202', 'credits' => 5, 'ec' => ['SIG']]]],
                'L3' => ['S5' => [['nom' => 'Foncier/Droit', 'code' => 'GT301', 'credits' => 6, 'ec' => ['Cadastre']]], 'S6' => [['nom' => 'PFE', 'code' => 'GT303', 'credits' => 15, 'ec' => ['Terrain']]]]
            ],
            'Génie Electrique et Energies Renouvelables' => [
                'L1' => ['S1' => [['nom' => 'Electromagnétisme', 'code' => 'GE101', 'credits' => 5, 'ec' => ['Magnéto']]], 'S2' => [['nom' => 'Electronique Base', 'code' => 'GE103', 'credits' => 5, 'ec' => ['Diodes']]]],
                'L2' => ['S3' => [['nom' => 'Machines Electr', 'code' => 'GE201', 'credits' => 6, 'ec' => ['Moteurs']]], 'S4' => [['nom' => 'Energies Solaire', 'code' => 'GE202', 'credits' => 5, 'ec' => ['PV']]]],
                'L3' => ['S5' => [['nom' => 'Maintenance Indu', 'code' => 'GE301', 'credits' => 6, 'ec' => ['Automates']]], 'S6' => [['nom' => 'Stage', 'code' => 'GE303', 'credits' => 15, 'ec' => ['Rapport']]]]
            ],
            'Hôtellerie Tourisme' => [
                'L1' => ['S1' => [['nom' => 'Intro Hôtellerie', 'code' => 'HT101', 'credits' => 5, 'ec' => ['Accueil']]], 'S2' => [['nom' => 'Gastronomie', 'code' => 'HT103', 'credits' => 5, 'ec' => ['Cuisine']]]],
                'L2' => ['S3' => [['nom' => 'Gestion Hôtel', 'code' => 'HT201', 'credits' => 6, 'ec' => ['Réception']]], 'S4' => [['nom' => 'Tourisme Local', 'code' => 'HT202', 'credits' => 5, 'ec' => ['Guides']]]],
                'L3' => ['S5' => [['nom' => 'Marketing Tourist', 'code' => 'HT301', 'credits' => 6, 'ec' => ['Promo']]], 'S6' => [['nom' => 'Stage', 'code' => 'HT303', 'credits' => 15, 'ec' => ['Pratique']]]]
            ],
            'Génie de l’Environnement-Traitement des Déchets et Eaux' => [
                'L1' => ['S1' => [['nom' => 'Ecologie', 'code' => 'GEE101', 'credits' => 5, 'ec' => ['Biosphère']]], 'S2' => [['nom' => 'Pollution Eau', 'code' => 'GEE103', 'credits' => 5, 'ec' => ['Chimie Eau']]]],
                'L2' => ['S3' => [['nom' => 'Gestion Déchets', 'code' => 'GEE201', 'credits' => 6, 'ec' => ['Tri/Recyclage']]], 'S4' => [['nom' => 'Assainissement', 'code' => 'GEE202', 'credits' => 5, 'ec' => ['Stations']]]],
                'L3' => ['S5' => [['nom' => 'Audit Environ', 'code' => 'GEE301', 'credits' => 6, 'ec' => ['Normes ISO']]], 'S6' => [['nom' => 'Projet', 'code' => 'GEE303', 'credits' => 15, 'ec' => ['Soutenance']]]]
            ],
        ];

        foreach ($filiereData as $filiereNom => $niveaux) {
            $filiere = Filiere::where('nom', 'like', "%$filiereNom%")->first();
            if (!$filiere) continue;

            foreach ($niveaux as $niveau => $semestres) {
                $anneeEtude = (int) filter_var($niveau, FILTER_SANITIZE_NUMBER_INT);
                
                // Add common L1 subjects
                if ($anneeEtude === 1) {
                    $semestres['S1'] = array_merge($semestres['S1'] ?? [], $commonL1['S1']);
                }

                foreach ($semestres as $semestre => $matieres) {
                    $semNum = (int) filter_var($semestre, FILTER_SANITIZE_NUMBER_INT);
                    
                    foreach ($matieres as $mdata) {
                        $uniqueCode = $mdata['code'];
                        // Ensure code is unique by prefixing with filiere code if it might clash
                        if (strlen($uniqueCode) < 7) { 
                            $uniqueCode = strtoupper($filiere->code) . "_" . $uniqueCode;
                        }

                        $matiere = Matiere::updateOrCreate(
                            ['code' => $uniqueCode],
                            [
                                'filiere_id' => $filiere->id,
                                'nom' => $mdata['nom'],
                                'credits' => $mdata['credits'],
                                'semestre' => $semNum,
                                'annee_etude' => $anneeEtude
                            ]
                        );

                        ElementConstitutif::where('matiere_id', $matiere->id)->delete();
                        foreach ($mdata['ec'] as $ecNom) {
                            ElementConstitutif::create([
                                'matiere_id' => $matiere->id,
                                'nom' => $ecNom,
                                'credits' => round($mdata['credits'] / count($mdata['ec']), 1)
                            ]);
                        }
                    }
                }
            }
        }
    }
}
