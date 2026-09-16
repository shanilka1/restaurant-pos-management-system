<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::get('/health', function () {
    return response()->json([
        'status'  => 'ok',
        'message' => 'Restaurant POS API is running',
        'version' => '2.0.0',
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

    // Table Floor Routes
    Route::get('/tables', [\App\Http\Controllers\TableController::class, 'index']);
    Route::post('/tables', [\App\Http\Controllers\TableController::class, 'store']);
    Route::put('/tables/{id}', [\App\Http\Controllers\TableController::class, 'update']);
    Route::post('/tables/switch', [\App\Http\Controllers\TableController::class, 'switchTable']);
    Route::delete('/tables/{id}', [\App\Http\Controllers\TableController::class, 'destroy']);

    // Shift Register Routes
    Route::get('/shifts/current', [\App\Http\Controllers\ShiftController::class, 'current']);
    Route::post('/shifts/open', [\App\Http\Controllers\ShiftController::class, 'open']);
    Route::post('/shifts/{id}/close', [\App\Http\Controllers\ShiftController::class, 'close']);
    Route::post('/shifts/cash-movement', [\App\Http\Controllers\ShiftController::class, 'cashMovement']);
    Route::get('/shifts/history', [\App\Http\Controllers\ShiftController::class, 'history']);

    // Kitchen Display (KDS) Routes
    Route::get('/kitchen/queue', [\App\Http\Controllers\KitchenController::class, 'queue']);
    Route::put('/kitchen/orders/{id}/status', [\App\Http\Controllers\KitchenController::class, 'updateOrderStatus']);
    Route::put('/kitchen/items/{itemId}/status', [\App\Http\Controllers\KitchenController::class, 'updateItemStatus']);

    // Reservations Routes
    Route::get('/reservations', [\App\Http\Controllers\ReservationController::class, 'index']);
    Route::post('/reservations', [\App\Http\Controllers\ReservationController::class, 'store']);
    Route::put('/reservations/{id}/status', [\App\Http\Controllers\ReservationController::class, 'updateStatus']);
    Route::delete('/reservations/{id}', [\App\Http\Controllers\ReservationController::class, 'destroy']);

    // Ingredient & Recipe Routes
    Route::get('/ingredients', [\App\Http\Controllers\IngredientController::class, 'index']);
    Route::post('/ingredients', [\App\Http\Controllers\IngredientController::class, 'store']);
    Route::put('/ingredients/{id}', [\App\Http\Controllers\IngredientController::class, 'update']);
    Route::delete('/ingredients/{id}', [\App\Http\Controllers\IngredientController::class, 'destroy']);
    Route::get('/products/{productId}/recipes', [\App\Http\Controllers\IngredientController::class, 'getRecipes']);
    Route::post('/products/{productId}/recipes', [\App\Http\Controllers\IngredientController::class, 'saveRecipes']);

    // Parked / Held Order Routes
    Route::get('/held-orders', [\App\Http\Controllers\HeldOrderController::class, 'index']);
    Route::post('/held-orders', [\App\Http\Controllers\HeldOrderController::class, 'store']);
    Route::delete('/held-orders/{id}', [\App\Http\Controllers\HeldOrderController::class, 'destroy']);

    // Stock Movement Routes
    Route::get('/stock-movements', [\App\Http\Controllers\StockMovementController::class, 'index']);
    Route::get('/stock-movements/{id}', [\App\Http\Controllers\StockMovementController::class, 'show']);

    // Customer Routes
    Route::get('/customers', [\App\Http\Controllers\CustomerController::class, 'index']);
    Route::post('/customers', [\App\Http\Controllers\CustomerController::class, 'store']);
    Route::get('/customers/{id}', [\App\Http\Controllers\CustomerController::class, 'show']);

    // Order Routes
    Route::get('/orders', [\App\Http\Controllers\OrderController::class, 'index']);
    Route::post('/orders', [\App\Http\Controllers\OrderController::class, 'store']);
    Route::get('/orders/{id}', [\App\Http\Controllers\OrderController::class, 'show']);
    Route::put('/orders/{id}/status', [\App\Http\Controllers\OrderController::class, 'updateStatus']);

    // Reports Routes
    Route::get('/reports/sales', [\App\Http\Controllers\ReportController::class, 'sales']);
    Route::get('/reports/products', [\App\Http\Controllers\ReportController::class, 'products']);

    // Dashboard Route
    Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index']);

    // Admin only routes
    Route::middleware('role:admin')->group(function () {
        Route::post('/categories', [\App\Http\Controllers\CategoryController::class, 'store']);
        Route::put('/categories/{id}', [\App\Http\Controllers\CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [\App\Http\Controllers\CategoryController::class, 'destroy']);
        
        Route::post('/products', [\App\Http\Controllers\ProductController::class, 'store']);
        Route::put('/products/{id}', [\App\Http\Controllers\ProductController::class, 'update']);
        Route::delete('/products/{id}', [\App\Http\Controllers\ProductController::class, 'destroy']);
        
        Route::post('/stock-movements', [\App\Http\Controllers\StockMovementController::class, 'store']);
        
        Route::put('/customers/{id}', [\App\Http\Controllers\CustomerController::class, 'update']);
        Route::delete('/customers/{id}', [\App\Http\Controllers\CustomerController::class, 'destroy']);
    });
});
