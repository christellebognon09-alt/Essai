<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class StudentController extends Controller
{
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'firstname' => 'string|max:255',
            'lastname' => 'string|max:255',
            'phone' => 'nullable|string|max:50',
            'genre' => 'nullable|string|max:20',
            'gender' => 'nullable|string|max:20',
            'birth_date' => 'nullable|string|max:100',
            'birth_city' => 'nullable|string|max:100',
            'birth_country' => 'nullable|string|max:100',
            'nationality' => 'nullable|string|max:100',
            'address' => 'nullable|string',
            'filiere' => 'nullable|string|max:255',
            'level' => 'nullable|string|max:100',
            'nomPere' => 'nullable|string|max:255',
            'prenomPere' => 'nullable|string|max:255',
            'emailPere' => 'nullable|email|max:255',
            'telephonePere' => 'nullable|string|max:50',
            'autreInfoPere' => 'nullable|string',
            'nomMere' => 'nullable|string|max:255',
            'prenomMere' => 'nullable|string|max:255',
            'emailMere' => 'nullable|email|max:255',
            'telephoneMere' => 'nullable|string|max:50',
            'autreInfoMere' => 'nullable|string',
        ]);

        // Map frontend fields to DB fields
        $dataToUpdate = [
            'firstname' => $validated['firstname'] ?? $user->firstname,
            'lastname' => $validated['lastname'] ?? $user->lastname,
            'phone' => $validated['phone'] ?? $user->phone,
            'gender' => $validated['genre'] ?? $validated['gender'] ?? $user->gender,
            'birth_date' => $validated['birth_date'] ?? $user->birth_date,
            'birth_city' => $validated['birth_city'] ?? $user->birth_city,
            'birth_country' => $validated['birth_country'] ?? $user->birth_country,
            'nationality' => $validated['nationality'] ?? $user->nationality,
            'address' => $validated['address'] ?? $user->address,
            'filiere' => $validated['filiere'] ?? $user->filiere,
            'level' => $validated['level'] ?? $user->level,
            'parent_father_name' => $validated['nomPere'] ?? $user->parent_father_name,
            'parent_father_firstname' => $validated['prenomPere'] ?? $user->parent_father_firstname,
            'parent_father_email' => $validated['emailPere'] ?? $user->parent_father_email,
            'parent_father_phone' => $validated['telephonePere'] ?? $user->parent_father_phone,
            'parent_father_job' => $validated['autreInfoPere'] ?? $user->parent_father_job,
            'parent_mother_name' => $validated['nomMere'] ?? $user->parent_mother_name,
            'parent_mother_firstname' => $validated['prenomMere'] ?? $user->parent_mother_firstname,
            'parent_mother_email' => $validated['emailMere'] ?? $user->parent_mother_email,
            'parent_mother_phone' => $validated['telephoneMere'] ?? $user->parent_mother_phone,
            'parent_mother_job' => $validated['autreInfoMere'] ?? $user->parent_mother_job,
            'registration_complete' => true,
            'status_step' => 1,
        ];

        // --- Automatiquement lier le filiere_id ---
        if (isset($validated['filiere'])) {
            $filiereStr = strtolower($validated['filiere']);
            $foundFiliere = null;

            if (str_contains($filiereStr, 'abb') || str_contains($filiereStr, 'bio')) {
                $foundFiliere = \App\Models\Filiere::where('nom', 'like', '%Analyses Biologiques%')->first();
            } elseif (str_contains($filiereStr, 'sil') || str_contains($filiereStr, 'info')) {
                $foundFiliere = \App\Models\Filiere::where('nom', 'like', '%Système Informatique%')->first();
            } elseif (str_contains($filiereStr, 'btp') || str_contains($filiereStr, 'travaux')) {
                $foundFiliere = \App\Models\Filiere::where('nom', 'like', '%Bâtiment%')->first();
            } else {
                $foundFiliere = \App\Models\Filiere::where('nom', 'like', '%' . $validated['filiere'] . '%')->first();
            }

            if ($foundFiliere) {
                $dataToUpdate['filiere_id'] = $foundFiliere->id;
            }
        }

        $user->fill($dataToUpdate);

        // Handle File Uploads
        if ($request->hasFile('acteNaissance')) {
            $user->doc_acte_naissance = $request->file('acteNaissance')->store('documents', 'public');
        }
        if ($request->hasFile('photoIdentite')) {
            $user->doc_photo = $request->file('photoIdentite')->store('documents', 'public');
        }
        if ($request->hasFile('attestationBac')) {
            $user->doc_attestation_bac = $request->file('attestationBac')->store('documents', 'public');
        }
        if ($request->hasFile('bulletinsNotes')) {
            $user->doc_bulletins = $request->file('bulletinsNotes')->store('documents', 'public');
        }

        $user->save();

        return response()->json([
            'message' => 'Profil mis à jour avec succès',
            'user' => $user
        ]);
    }

    public function submitReceipt(Request $request)
    {
        $request->validate([
            'receipt' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        $user = $request->user();
        $path = $request->file('receipt')->store('receipts', 'public');

        $user->receipt_url = $path;
        $user->status_step = 4; // Step 4: Payment waiting validation
        $user->save();

        return response()->json([
            'message' => 'Reçu soumis avec succès',
            'receipt_url' => $path
        ]);
    }

    public function getStatus(Request $request)
    {
        return response()->json([
            'status_step' => $request->user()->status_step,
            'is_rejected' => $request->user()->is_rejected,
            'admin_notes' => $request->user()->admin_notes,
            'matricule' => $request->user()->matricule,
        ]);
    }
    public function reEditProfile(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $user->update([
            'registration_complete' => false,
            'is_rejected' => false
        ]);
        return response()->json(['message' => 'Mode édition activé']);
    }
    public function updateStatusStep(Request $request)
    {
        $request->validate(['step' => 'required|integer']);
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $user->update(['status_step' => $request->step]);
        return response()->json(['message' => 'Statut mis à jour']);
    }
}
