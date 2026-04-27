<?php

namespace App\Http\Controllers;

use App\Models\Departement;
use App\Models\Filiere;
use App\Models\Matiere;
use App\Models\ElementConstitutif;
use App\Models\AnneeAcademique;
use Illuminate\Http\Request;

class AcademiqueController extends Controller
{
    // --- Départements ---
    public function getDepartements()
    {
        return response()->json(Departement::with(['filieres.matieres.elementsConstitutifs'])->get());
    }

    public function storeDepartement(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);
        $dept = Departement::create($validated);
        return response()->json(['message' => 'Département créé avec succès', 'departement' => $dept]);
    }

    public function destroyDepartement($id)
    {
        Departement::destroy($id);
        return response()->json(['message' => 'Département supprimé']);
    }

    // --- Filières ---
    public function getFilieres()
    {
        return response()->json(Filiere::with(['departement', 'matieres'])->get());
    }

    public function storeFiliere(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'code' => 'required|string|unique:filieres,code',
            'departement_id' => 'required|exists:departements,id'
        ]);
        $filiere = Filiere::create($validated);
        return response()->json(['message' => 'Filière créée avec succès', 'filiere' => $filiere]);
    }

    public function destroyFiliere($id)
    {
        Filiere::destroy($id);
        return response()->json(['message' => 'Filière supprimée']);
    }

    public function getFiliere($id)
    {
        return response()->json(Filiere::with(['matieres.elementsConstitutifs'])->findOrFail($id));
    }

    // --- Matières ---
    public function getMatieres()
    {
        return response()->json(Matiere::with(['filiere', 'elementsConstitutifs'])->get());
    }

    public function storeMatiere(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'code' => 'required|string|unique:matieres,code',
            'filiere_id' => 'required|exists:filieres,id',
            'semestre' => 'required|integer|min:1',
            'credits' => 'required|integer|min:1'
        ]);

        // Calcul automatique de l'année d'étude
        $validated['annee_etude'] = (int) ceil($validated['semestre'] / 2);

        $matiere = Matiere::create($validated);
        return response()->json(['message' => 'Matière créée avec succès', 'matiere' => $matiere]);
    }

    // --- Éléments Constitutifs ---
    public function storeElementConstitutif(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'matiere_id' => 'required|exists:matieres,id'
        ]);
        $ec = ElementConstitutif::create($validated);
        return response()->json(['message' => 'Élément constitutif ajouté avec succès', 'ec' => $ec]);
    }

    // --- Année Académique ---
    public function getAnnees()
    {
        return response()->json(AnneeAcademique::orderBy('date_debut', 'desc')->get());
    }

    public function storeAnnee(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string',
            'date_debut' => 'required|date',
            'date_fin' => 'nullable|date'
        ]);
        
        if (empty($validated['date_fin'])) {
            $validated['date_fin'] = $validated['date_debut'];
        }

        $annee = AnneeAcademique::create($validated);
        return response()->json(['message' => 'Année académique créée', 'annee' => $annee]);
    }

    public function activateAnnee($id)
    {
        // Désactiver toutes les années
        AnneeAcademique::where('est_active', true)->update(['est_active' => false]);
        
        // Activer celle demandée
        $annee = AnneeAcademique::findOrFail($id);
        $annee->est_active = true;
        $annee->save();

        return response()->json(['message' => 'Année académique activée', 'annee' => $annee]);
    }

    public function updateAnnee(Request $request, $id)
    {
        $validated = $request->validate([
            'nom' => 'required|string',
            'date_debut' => 'required|date',
            'date_fin' => 'nullable|date'
        ]);
        
        if (empty($validated['date_fin'])) {
            $validated['date_fin'] = $validated['date_debut'];
        }

        $annee = AnneeAcademique::findOrFail($id);
        $annee->update($validated);
        
        return response()->json(['message' => 'Période mise à jour', 'annee' => $annee]);
    }
}
