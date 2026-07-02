<?php
return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    // Comma-separated in production, e.g. "https://educore.vercel.app,https://educore-git-main.vercel.app"
    'allowed_origins' => array_filter(array_map('trim', explode(',', env('CORS_ALLOWED_ORIGINS', 'http://localhost:5173')))),
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];