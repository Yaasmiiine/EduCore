<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\GeminiClient;
use Illuminate\Http\Request;
use Throwable;

class AiController extends Controller
{
    public function chat(Request $request, GeminiClient $gemini)
    {
        $request->validate(['message' => 'required|string']);

        try {
            $text = $gemini->generate(
                $request->message,
                "Tu es un assistant pédagogique pour un établissement de formation. Réponds en français, de façon concise et utile pour des stagiaires et formateurs."
            );
        } catch (Throwable $e) {
            return response()->json(['message' => 'Erreur lors de la génération de la réponse'], 500);
        }

        return response()->json(['response' => $text]);
    }
}
