<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

echo "Démarrage de la configuration du système...\n";

// 1. Création de la table personal_access_tokens
try {
    if (!Schema::hasTable('personal_access_tokens')) {
        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->morphs('tokenable');
            $table->string('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
        });
        echo "✅ Table 'personal_access_tokens' créée avec succès.\n";
    } else {
        echo "ℹ️ La table 'personal_access_tokens' existe déjà.\n";
    }
} catch (\Exception $e) {
    echo "❌ Erreur lors de la création de la table : " . $e->getMessage() . "\n";
}

// 2. Configuration des comptes Staff
$staffAccounts = [
    ['email' => 'admin@faucon.com', 'role' => 'Admin', 'firstname' => 'Admin', 'lastname' => 'Faucon'],
    ['email' => 'secretariat@faucon.com', 'role' => 'Secrétaire', 'firstname' => 'Secrétariat', 'lastname' => 'Faucon'],
    ['email' => 'comptable@faucon.com', 'role' => 'Comptable', 'firstname' => 'Comptabilité', 'lastname' => 'Faucon'],
    ['email' => 'surveillant@faucon.com', 'role' => 'Surveillant', 'firstname' => 'Surveillant', 'lastname' => 'Faucon'],
];

foreach ($staffAccounts as $account) {
    $user = User::where('email', $account['email'])->first();
    
    if ($user) {
        // Mettre à jour le mot de passe et le rôle si le compte existe
        $user->password = Hash::make('password');
        $user->role = $account['role'];
        $user->save();
        echo "✅ Compte mis à jour (mot de passe corrigé) : {$account['email']}\n";
    } else {
        // Créer le compte s'il n'existe pas
        User::create([
            'firstname' => $account['firstname'],
            'lastname' => $account['lastname'],
            'email' => $account['email'],
            'password' => Hash::make('password'),
            'role' => $account['role'],
            'matricule' => 'STAFF-' . rand(1000, 9999),
            'registration_complete' => true
        ]);
        echo "✅ Compte créé : {$account['email']}\n";
    }
}

echo "\n🎉 Configuration terminée ! Vous pouvez maintenant vous connecter.\n";
