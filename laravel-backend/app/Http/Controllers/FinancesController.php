<?php

namespace App\Http\Controllers;

use App\Models\ConfigFinanciere;
use App\Models\Filiere;
use Illuminate\Http\Request;

class FinancesController extends Controller
{
    public function getConfigs()
    {
        return response()->json([
            'configs' => ConfigFinanciere::with('filiere')->get(),
            'tariffs' => \App\Models\AcademicTariff::all(),
            'extra_frais' => \App\Models\ExtraFraisFiliere::all(),
        ]);
    }

    public function storeConfig(Request $request)
    {
        $data = $request->validate([
            'filiere_id' => 'required|exists:filieres,id',
            'inscription' => 'required|integer',
            'inscription_deadline' => 'nullable|date',
            'tranche1' => 'required|integer',
            'tranche1_deadline' => 'nullable|date',
            'tranche2' => 'required|integer',
            'tranche2_deadline' => 'nullable|date',
            'tranche3' => 'required|integer',
            'tranche3_deadline' => 'nullable|date',
            'frais_stage' => 'required|integer',
            'frais_stage_deadline' => 'nullable|date',
            'frais_dossier' => 'required|integer',
            'frais_dossier_deadline' => 'nullable|date',
            'extra_frais' => 'nullable|array'
        ]);

        $config = ConfigFinanciere::updateOrCreate(
            ['filiere_id' => $data['filiere_id']],
            collect($data)->except('extra_frais')->toArray()
        );

        // Handle extra fees
        if (isset($data['extra_frais'])) {
            \App\Models\ExtraFraisFiliere::where('filiere_id', $data['filiere_id'])->delete();
            foreach ($data['extra_frais'] as $extra) {
                \App\Models\ExtraFraisFiliere::create([
                    'filiere_id' => $data['filiere_id'],
                    'label' => $extra['label'],
                    'amount' => $extra['amount'],
                    'deadline' => $extra['deadline'] ?? null
                ]);
            }
        }

        return response()->json(['status' => 'success', 'config' => $config]);
    }

    public function storeTariff(Request $request)
    {
        $data = $request->validate([
            'id' => 'nullable|exists:academic_tariffs,id',
            'label' => 'required|string',
            'price' => 'required|integer'
        ]);

        $tariff = \App\Models\AcademicTariff::updateOrCreate(
            ['id' => $data['id'] ?? null],
            ['label' => $data['label'], 'price' => $data['price']]
        );

        return response()->json($tariff);
    }

    public function deleteTariff($id)
    {
        \App\Models\AcademicTariff::destroy($id);
        return response()->json(['status' => 'success']);
    }
}
