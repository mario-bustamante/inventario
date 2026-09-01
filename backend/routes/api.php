<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Role\RoleController;

Route::prefix('auth')->group(function () {
    // Rutas públicas — máximo 5 intentos por minuto (protección brute force)
    Route::middleware('throttle:5,1')->group(function () {
        Route::post('/login',    [AuthController::class, 'login']);
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/refresh',  [AuthController::class, 'refresh']);
    });

    // Rutas protegidas — requieren token válido
    Route::middleware(['auth:api', 'throttle:60,1'])->group(function () {
        Route::get('/me',       [AuthController::class, 'me']);
        Route::post('/logout',  [AuthController::class, 'logout']);
    });
});

Route::group([
    'middleware' => ['auth:api']
], function () {
    Route::resource('role', RoleController::class);
});