<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmploiDuTemps;
use App\Models\Presence;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PresenceController extends Controller
{
    // GET /api/presences/seance?emploi_du_temps_id=X&date=YYYY-MM-DD
    // formateur (own séance) or admin: the groupe's student list plus any statut already recorded for that date.
    public function seance(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'emploi_du_temps_id' => 'required|exists:emplois_du_temps,id',
            'date'                => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $edt = EmploiDuTemps::with('groupe', 'module')->findOrFail($request->emploi_du_temps_id);
        $user = $request->user();

        if (! $user->isAdmin() && $edt->formateur_id !== $user->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $etudiants = User::where('groupe_id', $edt->groupe_id)->orderBy('nom')->get(['id', 'nom', 'prenom']);

        $existing = Presence::where('emploi_du_temps_id', $edt->id)
            ->whereDate('date', $request->date)
            ->get()
            ->keyBy('user_id');

        $liste = $etudiants->map(fn ($e) => [
            'user_id' => $e->id,
            'nom'     => $e->nom,
            'prenom'  => $e->prenom,
            'statut'  => $existing[$e->id]->statut ?? null,
        ]);

        return response()->json(['emploi_du_temps' => $edt, 'etudiants' => $liste]);
    }

    // POST /api/presences/bulk — { emploi_du_temps_id, date, presences: [{ user_id, statut }] }
    public function bulkStore(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'emploi_du_temps_id'    => 'required|exists:emplois_du_temps,id',
            'date'                   => 'required|date',
            'presences'              => 'required|array|min:1',
            'presences.*.user_id'    => 'required|exists:users,id',
            'presences.*.statut'     => 'required|in:present,absent,retard',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $edt = EmploiDuTemps::findOrFail($request->emploi_du_temps_id);
        $user = $request->user();

        if (! $user->isAdmin() && $edt->formateur_id !== $user->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        foreach ($request->presences as $p) {
            Presence::updateOrCreate(
                ['emploi_du_temps_id' => $edt->id, 'user_id' => $p['user_id'], 'date' => $request->date],
                ['statut' => $p['statut'], 'formateur_id' => $user->id]
            );
        }

        return response()->json(['message' => 'Présences enregistrées']);
    }

    // GET /api/presences/mine — the authenticated stagiaire's own attendance history, grouped by module.
    public function mine(Request $request)
    {
        $presences = Presence::with('emploiDuTemps.module')
            ->where('user_id', $request->user()->id)
            ->orderByDesc('date')
            ->get();

        $byModule = $presences->groupBy(fn ($p) => $p->emploiDuTemps->module_id)->map(function ($group) {
            $total = $group->count();
            $present = $group->where('statut', 'present')->count();
            $retard = $group->where('statut', 'retard')->count();
            $absent = $group->where('statut', 'absent')->count();

            return [
                'module'         => $group->first()->emploiDuTemps->module,
                'total'          => $total,
                'present'        => $present,
                'retard'         => $retard,
                'absent'         => $absent,
                'taux_presence'  => $total > 0 ? round((($present + $retard) / $total) * 100, 1) : null,
                'presences'      => $group->values(),
            ];
        })->values();

        return response()->json($byModule);
    }
}
