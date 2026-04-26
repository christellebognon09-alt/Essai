<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

try {
    $tables = DB::select('SHOW TABLES');
    $dbName = "Tables_in_" . env('DB_DATABASE');
    echo "Tables in " . env('DB_DATABASE') . ":\n";
    foreach ($tables as $table) {
        echo "- " . $table->$dbName . "\n";
    }
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage();
}
