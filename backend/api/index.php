<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

define('LARAVEL_START', microtime(true));

// Fix Vercel SCRIPT_NAME and HTTPS scheme for Laravel 11 Request URI matching
$_SERVER['SCRIPT_NAME'] = '/index.php';
if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
    $_SERVER['HTTPS'] = 'on';
}

// Force Accept header to application/json so Laravel returns JSON errors instead of 302 redirects
$_SERVER['HTTP_ACCEPT'] = 'application/json';

// Handle CORS Preflight OPTIONS requests for Vercel Serverless Function cleanly without duplication
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept');
    header('HTTP/1.1 200 OK');
    exit();
}

// Configure database: respect DB_CONNECTION / DB_URL from environment if set, fallback to SQLite
$dbConn = getenv('DB_CONNECTION');
$dbUrl = getenv('DB_URL');

if (!$dbConn && !$dbUrl) {
    $sqliteFile = '/tmp/database.sqlite';
    putenv('DB_CONNECTION=sqlite');
    putenv('DB_DATABASE=' . $sqliteFile);

    if (!file_exists($sqliteFile)) {
        touch($sqliteFile);
    }
}

// Register Autoloader
require __DIR__ . '/../vendor/autoload.php';

/** @var Application $app */
$app = require __DIR__ . '/../bootstrap/app.php';

// Guarantee Database Migration & Seeder on Cold Boot safely without wiping registered users
try {
    $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
    if (!Schema::hasTable('users')) {
        $kernel->call('migrate', ['--force' => true]);
        if (\App\Models\User::count() === 0) {
            $kernel->call('db:seed', ['--force' => true]);
        }
    }
} catch (\Throwable $e) {
    try {
        $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
        $kernel->call('migrate', ['--force' => true]);
        if (\App\Models\User::count() === 0) {
            $kernel->call('db:seed', ['--force' => true]);
        }
    } catch (\Throwable $ex) {}
}

$request = Request::capture();

// Parse JSON payload into Request parameter bag for Vercel Serverless PHP
$content = $request->getContent();
if (!empty($content)) {
    $data = json_decode($content, true);
    if (is_array($data)) {
        $request->request->add($data);
    }
}

$app->handleRequest($request);
