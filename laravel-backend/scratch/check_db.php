<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$filieres = \App\Models\Filiere::all(['id', 'nom', 'code'])->toArray();
print_r($filieres);

$users = \App\Models\User::where('role', 'student')->get(['id', 'lastname', 'firstname', 'filiere', 'filiere_id'])->toArray();
print_r($users);
