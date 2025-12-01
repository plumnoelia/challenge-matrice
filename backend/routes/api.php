<?php

use App\Http\Controllers\ServerController;
use Illuminate\Support\Facades\Route;

Route::apiResource('servers', ServerController::class);
Route::put('/servers/reorder/order', [ServerController::class, 'reorder']);
