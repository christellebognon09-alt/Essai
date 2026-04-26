<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\News;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    // --- Students Management ---

    public function getStudents()
    {
        // Return all users who are students (not staff)
        $students = User::whereNull('role')
            ->orWhere('role', 'Étudiant')
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($students);
    }

    public function validateDossier(Request $request)
    {
        $request->validate([
            'studentId' => 'required|exists:users,id',
            'notes' => 'nullable|string'
        ]);
        
        $user = User::find($request->studentId);
        
        // Génération automatique du matricule s'il n'existe pas
        if (!$user->matricule) {
            $year = date('y'); // 25
            
            // Extraire les initiales de la filière (ex: "Génie Informatique" -> "GI")
            $filiere = $user->filiere ?? "GEN";
            $words = explode(' ', $filiere);
            $code = "";
            if (count($words) > 1) {
                foreach ($words as $w) {
                    if (strlen($w) > 3) $code .= strtoupper($w[0]);
                }
            } else {
                $code = strtoupper(substr($filiere, 0, 3));
            }
            if (empty($code)) $code = "STU";

            // Trouver le numéro d'ordre
            $count = User::where('matricule', 'like', "$year-$code-%")->count() + 1;
            $sequence = str_pad($count, 3, '0', STR_PAD_LEFT);
            
            $user->matricule = "$year-$code-$sequence";
        }

        $user->update([
            'status_step' => 2,
            'is_rejected' => false,
            'admin_notes' => $request->notes ?? $user->admin_notes,
            'matricule' => $user->matricule
        ]);

        return response()->json([
            'message' => 'Dossier validé et matricule généré : ' . $user->matricule,
            'matricule' => $user->matricule
        ]);
    }

    public function rejectDossier(Request $request)
    {
        $request->validate([
            'studentId' => 'required|exists:users,id',
            'notes' => 'required|string'
        ]);

        $user = User::find($request->studentId);
        $user->update([
            'is_rejected' => true,
            'admin_notes' => $request->notes
        ]);

        return response()->json(['message' => 'Dossier rejeté']);
    }

    public function saveNotes(Request $request)
    {
        foreach ($request->notes as $noteData) {
            $user = User::find($noteData['studentId']);
            if ($user) {
                $user->update(['grade' => $noteData['note']]);
            }
        }
        return response()->json(['message' => 'Notes enregistrées avec succès']);
    }

    public function validatePayment(Request $request)
    {
        $request->validate(['studentId' => 'required|exists:users,id']);

        $user = User::find($request->studentId);
        $user->update(['status_step' => 5]);

        return response()->json(['message' => 'Paiement validé']);
    }

    public function generateMatricule(Request $request)
    {
        $request->validate([
            'studentId' => 'required|exists:users,id',
            'matricule' => 'required|string|unique:users,matricule',
        ]);

        $user = User::find($request->studentId);
        $user->update(['matricule' => $request->matricule]);

        return response()->json(['message' => 'Matricule généré']);
    }

    // --- News Management ---

    public function getNews()
    {
        return response()->json(News::latest()->get());
    }

    public function storeNews(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'nullable|string',
            'description' => 'nullable|string',
            'cover' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('cover')) {
            $validated['image_url'] = $request->file('cover')->store('news', 'public');
        }

        $news = News::create($validated);
        return response()->json($news, 201);
    }

    public function deleteNews($id)
    {
        News::destroy($id);
        return response()->json(['message' => 'Article supprimé']);
    }
}
