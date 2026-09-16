<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'status' => 'success',
        'message' => '🚀 Restaurant POS & Management System Backend API is Running Live on Vercel',
        'version' => '2.0.0',
        'endpoints' => [
            'health' => '/api/health',
            'login' => '/api/login (POST)',
            'products' => '/api/products',
            'tables' => '/api/tables',
            'kitchen' => '/api/kitchen/queue',
        ]
    ]);
});
