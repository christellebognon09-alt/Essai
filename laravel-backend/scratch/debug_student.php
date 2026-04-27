<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$user = \App\Models\User::where('lastname', 'Telle')->first();
if ($user) {
    echo "USER INFO:\n";
    echo "Name: " . $user->firstname . " " . $user->lastname . "\n";
    echo "Filiere (text): " . $user->filiere . "\n";
    echo "Filiere ID: " . $user->filiere_id . "\n";
    echo "Level: " . $user->level . "\n";
    
    if ($user->filiere_id) {
        $filiere = \App\Models\Filiere::find($user->filiere_id);
        echo "FILIERE INFO:\n";
        echo "Nom: " . $filiere->nom . "\n";
        echo "Code: " . $filiere->code . "\n";
        
        $matieres = \App\Models\Matiere::where('filiere_id', $user->filiere_id)->get();
        echo "MATIERES COUNT: " . $matieres->count() . "\n";
        foreach ($matieres as $m) {
            echo "- " . $m->nom . " (Sem: " . $m->semestre . ", Year: " . $m->annee_etude . ")\n";
        }
    } else {
        echo "WARNING: filiere_id is NULL\n";
    }
} else {
    echo "User Telle not found\n";
}
