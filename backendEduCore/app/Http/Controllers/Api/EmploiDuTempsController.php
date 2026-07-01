<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EmploiDuTemps;
use App\Models\Groupe;
use App\Models\Module;
use App\Models\Salle;
use App\Services\GeminiClient;
use App\Services\ScheduleConflictService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Throwable;

class EmploiDuTempsController extends Controller
{
    public function index(Request $request)
    {
        $query = EmploiDuTemps::with('groupe', 'module', 'formateur', 'salle');

        // Filter by groupe
        if ($request->has('groupe_id')) {
            $query->where('groupe_id', $request->groupe_id);
        }
        // Filter by formateur
        if ($request->has('formateur_id')) {
            $query->where('formateur_id', $request->formateur_id);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'groupe_id'    => 'required|exists:groupes,id',
            'module_id'    => 'required|exists:modules,id',
            'formateur_id' => 'required|exists:users,id',
            'salle_id'     => 'required|exists:salles,id',
            'jour'         => 'required|in:Lundi,Mardi,Mercredi,Jeudi,Vendredi,Samedi',
            'heure_debut'  => 'required|date_format:H:i',
            'heure_fin'    => 'required|date_format:H:i|after:heure_debut',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $edt = EmploiDuTemps::create($request->all());
        return response()->json($edt->load('groupe', 'module', 'formateur', 'salle'), 201);
    }

    public function show(EmploiDuTemps $emploiDuTemps)
    {
        return response()->json($emploiDuTemps->load('groupe', 'module', 'formateur', 'salle'));
    }

    public function update(Request $request, EmploiDuTemps $emploiDuTemps)
    {
        $emploiDuTemps->update($request->only(
            'groupe_id', 'module_id', 'formateur_id', 'salle_id', 'jour', 'heure_debut', 'heure_fin'
        ));
        return response()->json($emploiDuTemps->load('groupe', 'module', 'formateur', 'salle'));
    }

    public function destroy(EmploiDuTemps $emploiDuTemps)
    {
        $emploiDuTemps->delete();
        return response()->json(['message' => 'Séance supprimée']);
    }

    // POST /api/emplois-du-temps/generate-ia — proposes a draft weekly schedule via Gemini.
    // Returns a draft only; nothing is persisted here.
    public function generateIA(Request $request, GeminiClient $gemini, ScheduleConflictService $conflicts)
    {
        $validator = Validator::make($request->all(), [
            'groupe_id' => 'required|exists:groupes,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $groupe = Groupe::with('filiere')->findOrFail($request->groupe_id);
        $modules = Module::with('formateur')->where('filiere_id', $groupe->filiere_id)->get();
        $salles = Salle::where('statut', 'disponible')->get();

        if ($modules->isEmpty() || $salles->isEmpty()) {
            return response()->json(['message' => "Aucun module ou aucune salle disponible pour la filière de ce groupe."], 422);
        }

        $modulesText = $modules->map(fn ($m) => "- id:{$m->id} \"{$m->nom}\" ({$m->heures_total}h) formateur_id:{$m->formateur_id} ({$m->formateur->prenom} {$m->formateur->nom})")->implode("\n");
        $sallesText = $salles->map(fn ($s) => "- id:{$s->id} \"{$s->nom}\" (capacité {$s->capacite})")->implode("\n");

        $prompt = <<<PROMPT
        Propose un emploi du temps hebdomadaire pour le groupe "{$groupe->nom}" de la filière "{$groupe->filiere->nom}".

        Modules à programmer (avec leur formateur) :
        {$modulesText}

        Salles disponibles :
        {$sallesText}

        Contraintes : jours possibles Lundi à Samedi, créneaux entre 08:30 et 17:30,
        séances de 1h30 à 3h, pas de chevauchement pour un même formateur ou une même salle,
        couvre chaque module au moins une fois.

        Réponds UNIQUEMENT avec un tableau JSON (aucun texte autour), au format exact :
        [{"module_id": 1, "formateur_id": 2, "salle_id": 1, "jour": "Lundi", "heure_debut": "08:30", "heure_fin": "11:30"}]
        PROMPT;

        try {
            $raw = $gemini->generate($prompt, generationConfig: ['response_mime_type' => 'application/json']);
        } catch (Throwable $e) {
            return response()->json(['message' => 'Erreur lors de la génération IA'], 500);
        }

        $proposals = json_decode($raw, true);

        if (! is_array($proposals)) {
            return response()->json(['message' => 'Réponse IA invalide, veuillez réessayer'], 500);
        }

        $draft = collect($proposals)->map(function ($p) use ($groupe, $conflicts) {
            $overlaps = $conflicts->findOverlaps(
                $p['jour'] ?? '',
                $p['heure_debut'] ?? '',
                $p['heure_fin'] ?? '',
                $groupe->id,
                (int) ($p['formateur_id'] ?? 0),
                (int) ($p['salle_id'] ?? 0)
            );

            return array_merge($p, [
                'groupe_id'    => $groupe->id,
                'has_conflict' => $overlaps->isNotEmpty(),
            ]);
        });

        return response()->json(['draft' => $draft]);
    }

    // GET /api/emplois-du-temps/conflicts — deterministic scan of the whole schedule for overlaps.
    public function conflicts(ScheduleConflictService $conflicts)
    {
        return response()->json($conflicts->findAllConflicts());
    }

    // POST /api/emplois-du-temps/conflicts/analyze — ask Gemini to suggest resolutions for given conflicts.
    public function analyzeConflicts(Request $request, GeminiClient $gemini)
    {
        $conflicts = $request->input('conflicts', []);

        if (empty($conflicts)) {
            return response()->json(['suggestions' => "Aucun conflit à analyser."]);
        }

        $summary = collect($conflicts)->map(function ($c) {
            $a = $c['seance_a'] ?? [];
            $b = $c['seance_b'] ?? [];
            return "- {$c['type']} ({$c['severity']}) le {$c['jour']} : "
                . "\"{$a['module']['nom']}\" ({$a['heure_debut']}-{$a['heure_fin']}, salle {$a['salle']['nom']}, formateur {$a['formateur']['prenom']} {$a['formateur']['nom']}, groupe {$a['groupe']['nom']}) "
                . "chevauche \"{$b['module']['nom']}\" ({$b['heure_debut']}-{$b['heure_fin']}, salle {$b['salle']['nom']}, formateur {$b['formateur']['prenom']} {$b['formateur']['nom']}, groupe {$b['groupe']['nom']})";
        })->implode("\n");

        $prompt = <<<PROMPT
        Voici une liste de conflits détectés dans un emploi du temps d'un établissement de formation :

        {$summary}

        Pour chaque conflit, propose une solution concrète et courte (changer de salle, décaler l'horaire, etc.).
        Réponds en français, sous forme de liste à puces concise.
        PROMPT;

        try {
            $suggestions = $gemini->generate($prompt, "Tu es un assistant pédagogique pour un établissement de formation, expert en planification d'emplois du temps.");
        } catch (Throwable $e) {
            return response()->json(['message' => 'Erreur lors de l\'analyse IA'], 500);
        }

        return response()->json(['suggestions' => $suggestions]);
    }

    // POST /api/emplois-du-temps/bulk — persists a reviewed batch of séances (e.g. an accepted AI draft).
    public function bulkStore(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'seances'                  => 'required|array|min:1',
            'seances.*.groupe_id'      => 'required|exists:groupes,id',
            'seances.*.module_id'      => 'required|exists:modules,id',
            'seances.*.formateur_id'   => 'required|exists:users,id',
            'seances.*.salle_id'       => 'required|exists:salles,id',
            'seances.*.jour'           => 'required|in:Lundi,Mardi,Mercredi,Jeudi,Vendredi,Samedi',
            'seances.*.heure_debut'    => 'required|date_format:H:i',
            'seances.*.heure_fin'      => 'required|date_format:H:i',
        ]);

        $validator->after(function ($validator) use ($request) {
            foreach ($request->input('seances', []) as $i => $seance) {
                if (($seance['heure_fin'] ?? '') <= ($seance['heure_debut'] ?? '')) {
                    $validator->errors()->add("seances.$i.heure_fin", "L'heure de fin doit être après l'heure de début.");
                }
            }
        });

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $created = collect($request->seances)->map(
            fn ($s) => EmploiDuTemps::create($s)->load('groupe', 'module', 'formateur', 'salle')
        );

        return response()->json($created, 201);
    }
}
