<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Création de l'Admin
        User::create([
            'firstname' => 'Admin',
            'lastname' => 'Principal',
            'email' => 'admin@faucon.ci',
            'password' => Hash::make('admin123'),
            'role' => 'Admin',
        ]);

        // Création du Secrétaire
        User::create([
            'firstname' => 'Marie',
            'lastname' => 'Secrétaire',
            'email' => 'secretaire@faucon.ci',
            'password' => Hash::make('staff123'),
            'role' => 'Secrétaire',
        ]);

        // Création du Comptable
        User::create([
            'firstname' => 'Jean',
            'lastname' => 'Comptable',
            'email' => 'comptable@faucon.ci',
            'password' => Hash::make('staff123'),
            'role' => 'Comptable',
        ]);

        // Création du Professeur
        User::create([
            'firstname' => 'Koffi',
            'lastname' => 'Prof',
            'email' => 'prof@faucon.ci',
            'password' => Hash::make('staff123'),
            'role' => 'Professeur',
        ]);
    }
}
