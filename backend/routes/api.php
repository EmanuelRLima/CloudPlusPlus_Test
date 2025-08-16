<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\TaskController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/health', function () {
    $health = [
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
        'services' => []
    ];

    try {
        DB::connection()->getPdo();
        $health['services']['database'] = 'connected';
    } catch (\Exception $e) {
        $health['services']['database'] = 'disconnected';
        $health['status'] = 'error';
    }

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

Route::prefix('v1')
    ->middleware('throttle:20,1')
    ->name('api.v1.')
    ->group(function () {
        Route::post('/register', [RegisterController::class, 'register'])->name('register');
        Route::post('/login', [LoginController::class, 'login'])->name('login');

        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
            Route::apiResource('projects', ProjectController::class);
            Route::apiResource('projects.tasks', TaskController::class)->shallow();
        });
});
