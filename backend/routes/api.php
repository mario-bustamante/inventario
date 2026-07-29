<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

Route::post('/login',[AuthController::class,'login']);
Route::post('/register',[AuthController::class,'register']);
Route::post('/refresh',[AuthController::class,'refresh']);
Route::post('/logout',[AuthController::class,'logout']);

Route::middleware('auth:api')->group(function(){
    Route::get('/me',[AuthController::class,'me']);
});
