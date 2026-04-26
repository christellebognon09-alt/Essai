<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

$columns = Schema::getColumnListing('users');
echo "Columns in 'users' table:\n";
foreach ($columns as $column) {
    $type = Schema::getColumnType('users', $column);
    echo "- $column ($type)\n";
}
