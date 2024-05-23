<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CategoryProController;
use App\Http\Controllers\Api\CheckoutController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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
// Route::middleware('auth:sanctum')->group(function(){
// });
Route::get('/san-pham',[ProductController::class,'index']);
Route::get('/san-pham-moi',[ProductController::class,'moi']);
Route::get('/san-pham-ban-chay',[ProductController::class,'banChay']);
Route::get('/san-pham-hot',[ProductController::class,'hot']);
Route::get('/san-pham/{id}',[ProductController::class,'getDetail']);

// Cart
Route::post('/add-to-cart', [CartController::class, 'addToCart']);
Route::post('/carts', [CartController::class, 'getCartsByUser']);
Route::delete('/carts/{id}', [CartController::class, 'deleteCart']);
Route::put('/carts/{id}', [CartController::class, 'updateCart']);

// Checkout
Route::post('/checkout', [CheckoutController::class, 'checkout']);
Route::post('/checkpayment', [CheckoutController::class, 'checkpayment']);

// Orders
Route::post('/order', [OrderController::class, 'getAllOrder']);


Route::get('/danh-muc-san-pham',[CategoryProController::class,'index']);
Route::get('/danh-muc-tin-tuc',[CategoryProController::class,'index']);

//Auth
Route::post('/login', [AuthController::class, 'login']);
Route::post('/dang-ky', [AuthController::class, 'store']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/verify-code', [AuthController::class, 'changePasswordForgot']);
Route::post('/change-password', [AuthController::class, 'changePassword']);
// Route::get('forgot-password', [PasswordResetLinkController::class, 'create']);
// Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
// ->name('password.email');

// Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
// ->name('password.reset');

// Route::post('reset-password', [NewPasswordController::class, 'store'])
// ->name('password.store');
// Authrized
// Route::middleware('auth')->group(function () {
//     Route::get('verify-email', EmailVerificationPromptController::class)
//                 ->name('verification.notice');

//     Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
//                 ->middleware(['signed', 'throttle:6,1'])
//                 ->name('verification.verify');

//     Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
//                 ->middleware('throttle:6,1')
//                 ->name('verification.send');

//     Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
//                 ->name('password.confirm');

//     Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

//     Route::put('password', [PasswordController::class, 'update'])->name('password.update');

//     Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
//                 ->name('logout');
// });
