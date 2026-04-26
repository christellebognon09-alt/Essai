<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$paths = [
    storage_path('app/public/documents'),
    storage_path('app/public/receipts'),
];

foreach ($paths as $path) {
    if (!file_exists($path)) {
        mkdir($path, 0777, true);
        echo "Created: $path\n";
    } else {
        echo "Exists: $path\n";
    }
}

// Try to create symlink if on windows and not exists
$publicStorage = public_path('storage');
if (!file_exists($publicStorage)) {
    echo "Symlink missing. You should run: php artisan storage:link\n";
} else {
    echo "Symlink exists.\n";
}
