<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Filiere;

class UserFiliereSeeder extends Seeder
{
    public function run()
    {
        $users = User::whereIn('role', ['student', 'Étudiant', 'Etudiant'])->whereNull('filiere_id')->get();
        
        foreach ($users as $user) {
            $filiereStr = strtolower($user->filiere);
            $filiere = null;

            if (str_contains($filiereStr, 'abb') || str_contains($filiereStr, 'bio')) {
                $filiere = Filiere::where('nom', 'like', '%Analyses Biologiques%')->first();
            } elseif (str_contains($filiereStr, 'sil') || str_contains($filiereStr, 'info')) {
                $filiere = Filiere::where('nom', 'like', '%Système Informatique%')->first();
            } elseif (str_contains($filiereStr, 'btp') || str_contains($filiereStr, 'travaux')) {
                $filiere = Filiere::where('nom', 'like', '%Bâtiment%')->first();
            } else {
                $filiere = Filiere::where('nom', 'like', '%' . $user->filiere . '%')->first();
            }

            if ($filiere) {
                $user->filiere_id = $filiere->id;
                $user->save();
            }
        }
    }
}
