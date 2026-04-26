<?php
require __DIR__.'/laravel-backend/vendor/autoload.php';
$app = require_once __DIR__.'/laravel-backend/bootstrap/app.php';

use Illuminate\Support\Facades\DB;

try {
    DB::connection()->getPdo();
    echo "Database connection successful!\n";
    $databases = DB::select('SHOW DATABASES');
    foreach ($databases as $db) {
        echo $db->Database . "\n";
    }
} catch (\Exception $e) {
    echo "Database connection failed: " . $e->getMessage() . "\n";
}
