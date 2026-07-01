<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use RuntimeException;

class GeminiClient
{
    protected string $apiKey;
    protected string $model;

    public function __construct()
    {
        $this->apiKey = (string) env('GEMINI_API_KEY');
        $this->model = (string) env('GEMINI_MODEL', 'gemini-2.5-flash');
    }

    /**
     * Send a prompt to the Gemini API and return the generated text.
     *
     * @throws RuntimeException
     */
    public function generate(string $prompt, ?string $systemInstruction = null, array $generationConfig = []): string
    {
        if (! $this->apiKey) {
            throw new RuntimeException('GEMINI_API_KEY manquante dans .env');
        }

        $payload = [
            'contents' => [
                ['role' => 'user', 'parts' => [['text' => $prompt]]],
            ],
        ];

        if ($systemInstruction) {
            $payload['system_instruction'] = ['parts' => [['text' => $systemInstruction]]];
        }

        if ($generationConfig) {
            $payload['generation_config'] = $generationConfig;
        }

        // Force-disable any proxy: a stray HTTPS_PROXY env var on this machine
        // makes Guzzle hang until timeout otherwise, even though the Gemini
        // host is directly reachable.
        $response = Http::timeout(60)
            ->connectTimeout(15)
            ->withOptions(['curl' => [CURLOPT_PROXY => '']])
            ->post(
                "https://generativelanguage.googleapis.com/v1beta/models/{$this->model}:generateContent?key={$this->apiKey}",
                $payload
            );

        if ($response->failed()) {
            throw new RuntimeException('Erreur API Gemini: ' . $response->body());
        }

        $text = $response->json('candidates.0.content.parts.0.text');

        if ($text === null) {
            throw new RuntimeException('Réponse Gemini invalide ou vide.');
        }

        return $text;
    }
}
