<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AcademiqueController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/test-db', function() {
    try {
        \Illuminate\Support\Facades\DB::connection()->getPdo();
        return response()->json(['status' => 'success', 'message' => 'Connected to ' . \Illuminate\Support\Facades\DB::getDatabaseName()]);
    } catch (\Exception $e) {
        return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
});
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::post('/register', [AuthController::class, 'register']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Student routes
    Route::post('/update-profile', [\App\Http\Controllers\StudentController::class, 'updateProfile']);
    Route::post('/submit-receipt', [\App\Http\Controllers\StudentController::class, 'submitReceipt']);
    Route::post('/re-edit-profile', [\App\Http\Controllers\StudentController::class, 'reEditProfile']);
    Route::post('/update-status-step', [\App\Http\Controllers\StudentController::class, 'updateStatusStep']);
    Route::get('/status', [\App\Http\Controllers\StudentController::class, 'getStatus']);

    // Admin/Secretary routes
    Route::get('/admin/students', [AdminController::class, 'getStudents']);
    Route::post('/admin/validate-dossier', [AdminController::class, 'validateDossier']);
    Route::post('/admin/reject-dossier', [AdminController::class, 'rejectDossier']);
    Route::post('/admin/validate-payment', [AdminController::class, 'validatePayment']);
    Route::post('/admin/generate-matricule', [AdminController::class, 'generateMatricule']);
    Route::post('/admin/save-notes', [AdminController::class, 'saveNotes']);

    // Admin routes
    Route::prefix('admin')->group(function () {
        Route::get('/students', [AdminController::class, 'getStudents']);
        Route::post('/validate-dossier', [AdminController::class, 'validateDossier']);
        Route::post('/reject-dossier', [AdminController::class, 'rejectDossier']);
        Route::post('/validate-payment', [AdminController::class, 'validatePayment']);
        Route::post('/generate-matricule', [AdminController::class, 'generateMatricule']);
        
        // News management
        Route::get('/news', [AdminController::class, 'getNews']);
        Route::post('/news', [AdminController::class, 'storeNews']);
        Route::delete('/news/{id}', [AdminController::class, 'deleteNews']);
    });

    // Structure Académique
    Route::prefix('academique')->group(function () {
        Route::get('/departements', [AcademiqueController::class, 'getDepartements']);
        Route::post('/departements', [AcademiqueController::class, 'storeDepartement']);
        Route::delete('/departements/{id}', [AcademiqueController::class, 'destroyDepartement']);
        
        Route::get('/filieres', [AcademiqueController::class, 'getFilieres']);
        Route::get('/filieres/{id}', [AcademiqueController::class, 'getFiliere']);
        Route::post('/filieres', [AcademiqueController::class, 'storeFiliere']);
        Route::delete('/filieres/{id}', [AcademiqueController::class, 'destroyFiliere']);
        
        Route::get('/matieres', [AcademiqueController::class, 'getMatieres']);
        Route::post('/matieres', [AcademiqueController::class, 'storeMatiere']);
        
        Route::post('/elements', [AcademiqueController::class, 'storeElementConstitutif']);
        
        Route::get('/annees', [AcademiqueController::class, 'getAnnees']);
        Route::post('/annees', [AcademiqueController::class, 'storeAnnee']);
        Route::put('/annees/{id}', [AcademiqueController::class, 'updateAnnee']);
        Route::post('/annees/{id}/activer', [AcademiqueController::class, 'activateAnnee']);
    });

    // Finances
    Route::prefix('finances')->group(function () {
        Route::get('/configs', [\App\Http\Controllers\FinancesController::class, 'getConfigs']);
        Route::post('/configs', [\App\Http\Controllers\FinancesController::class, 'storeConfig']);
        Route::post('/tariffs', [\App\Http\Controllers\FinancesController::class, 'storeTariff']);
        Route::delete('/tariffs/{id}', [\App\Http\Controllers\FinancesController::class, 'deleteTariff']);
    });
});
