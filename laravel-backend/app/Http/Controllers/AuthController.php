<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        // Generate a simple matricule based on year and user count
        $year = date('y');
        $count = User::count() + 1;
        $matricule = $year . "-FAU-" . str_pad($count, 4, '0', STR_PAD_LEFT);

        $user = User::create([
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'Étudiant',
            'matricule' => $matricule,
            'status_step' => 1,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Inscription réussie',
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)
                    ->orWhere('matricule', $request->email)
                    ->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Identifiants invalides'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie',
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté avec succès']);
    }

    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Email non trouvé'], 404);
        }

        $otp = rand(100000, 900000);
        $user->update([
            'otp_code' => $otp,
            'otp_expiry' => now()->addMinutes(15)
        ]);

        // In a real app, send email here. For now, we simulate it.
        Log::info("OTP for {$request->email}: {$otp}");

        return response()->json(['message' => 'Code de récupération envoyé']);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string'
        ]);

        $user = User::where('email', $request->email)
            ->where('otp_code', $request->code)
            ->where('otp_expiry', '>', now())
            ->first();

        if (!$user) {
            return response()->json(['message' => 'Code invalide ou expiré'], 400);
        }

        return response()->json(['message' => 'Code valide', 'verified' => true]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string',
            'newPassword' => 'required|string|min:6'
        ]);

        $user = User::where('email', $request->email)
            ->where('otp_code', $request->code)
            ->first();

        if (!$user) {
            return response()->json(['message' => 'Requête invalide'], 400);
        }

        $user->update([
            'password' => Hash::make($request->newPassword),
            'otp_code' => null,
            'otp_expiry' => null
        ]);

        return response()->json(['message' => 'Mot de passe réinitialisé avec succès']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function redirectToGoogle()
    {
        return \Laravel\Socialite\Facades\Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = \Laravel\Socialite\Facades\Socialite::driver('google')->user();
            
            $user = User::where('email', $googleUser->getEmail())->first();

            if (!$user) {
                $year = date('y');
                $count = User::count() + 1;
                $matricule = $year . "-FAU-" . str_pad($count, 4, '0', STR_PAD_LEFT);

                $user = User::create([
                    'firstname' => $googleUser->user['given_name'] ?? $googleUser->getName(),
                    'lastname' => $googleUser->user['family_name'] ?? '',
                    'email' => $googleUser->getEmail(),
                    'password' => Hash::make(\Illuminate\Support\Str::random(16)),
                    'role' => 'Étudiant',
                    'matricule' => $matricule,
                    'status_step' => 1,
                ]);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            // Redirect back to frontend with token
            // In a real app, you might use a more secure way to pass the token
            return redirect('http://localhost:3000/login?token=' . $token);
            
        } catch (\Exception $e) {
            Log::error("Google Auth Error: " . $e->getMessage());
            return redirect('http://localhost:3000/login?error=google_failed');
        }
    }
}
