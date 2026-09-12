<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned the "api" middleware group. Enjoy building your API!
|
*/

/**
 * Health Check — Verify the API is running.
 * GET /api/health
 */
Route::get('/health', function () {
    return response()->json([
        'status'  => 'ok',
        'message' => 'Restaurant POS API is running',
        'version' => '1.0.0',
    ]);
});

Route::post('/register', [\App\Http\Controllers\AuthController::class, 'register']);
Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [\App\Http\Controllers\AuthController::class, 'logout']);
    Route::get('/user', [\App\Http\Controllers\AuthController::class, 'user']);
    
    // Category Routes
    Route::get('/categories', [\App\Http\Controllers\CategoryController::class, 'index']);
    Route::get('/categories/{id}', [\App\Http\Controllers\CategoryController::class, 'show']);
    
    // Product Routes
    Route::get('/products', [\App\Http\Controllers\ProductController::class, 'index']);
    Route::get('/products/{id}', [\App\Http\Controllers\ProductController::class, 'show']);

    // Stock Movement Routes (Viewable by Admin and Cashier)
    Route::get('/stock-movements', [\App\Http\Controllers\StockMovementController::class, 'index']);
    Route::get('/stock-movements/{id}', [\App\Http\Controllers\StockMovementController::class, 'show']);

    // Customer Routes (Viewable and Creatable by Admin and Cashier)
    Route::get('/customers', [\App\Http\Controllers\CustomerController::class, 'index']);
    Route::post('/customers', [\App\Http\Controllers\CustomerController::class, 'store']);
    Route::get('/customers/{id}', [\App\Http\Controllers\CustomerController::class, 'show']);

    // Admin only routes
    Route::middleware('role:admin')->group(function () {
        // Category Admin Routes
        Route::post('/categories', [\App\Http\Controllers\CategoryController::class, 'store']);
        Route::put('/categories/{id}', [\App\Http\Controllers\CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [\App\Http\Controllers\CategoryController::class, 'destroy']);
        
        // Product Admin Routes
        Route::post('/products', [\App\Http\Controllers\ProductController::class, 'store']);
        Route::put('/products/{id}', [\App\Http\Controllers\ProductController::class, 'update']);
        Route::delete('/products/{id}', [\App\Http\Controllers\ProductController::class, 'destroy']);
        
        // Stock Movement Admin Routes (Modify stock)
        Route::post('/stock-movements', [\App\Http\Controllers\StockMovementController::class, 'store']);
        
        // Customer Admin Routes (Update and Delete)
        Route::put('/customers/{id}', [\App\Http\Controllers\CustomerController::class, 'update']);
        Route::delete('/customers/{id}', [\App\Http\Controllers\CustomerController::class, 'destroy']);
    });
});
