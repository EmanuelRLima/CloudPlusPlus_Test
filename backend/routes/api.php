<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Health check endpoint
Route::get('/health', function () {
    $health = [
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
        'services' => []
    ];

    // Check database connection
    try {
        DB::connection()->getPdo();
        $health['services']['database'] = 'connected';
    } catch (\Exception $e) {
        $health['services']['database'] = 'disconnected';
        $health['status'] = 'error';
    }

    // Check Redis connection
    try {
        Cache::store('redis')->put('health_check', 'ok', 1);
        $health['services']['redis'] = 'connected';
    } catch (\Exception $e) {
        $health['services']['redis'] = 'disconnected';
        $health['status'] = 'warning';
    }

    $status = $health['status'] === 'ok' ? 200 : ($health['status'] === 'warning' ? 200 : 503);

    return response()->json($health, $status);
});

// Sample API endpoints for testing
Route::prefix('v1')->group(function () {
    Route::get('/users', function () {
        return response()->json([
            'data' => [
                ['id' => 1, 'name' => 'John Doe', 'email' => 'john@example.com'],
                ['id' => 2, 'name' => 'Jane Smith', 'email' => 'jane@example.com']
            ],
            'message' => 'Users retrieved successfully'
        ]);
    });

    Route::post('/users', function (Request $request) {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
        ]);

        return response()->json([
            'data' => [
                'id' => rand(3, 1000),
                'name' => $request->name,
                'email' => $request->email,
                'created_at' => now()
            ],
            'message' => 'User created successfully'
        ], 201);
    });
});
