<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ContactMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Throwable;

class ContactController extends Controller
{
    // POST /api/contact — public, used by the landing page's "Contactez-nous" form.
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'    => 'required|string|max:150',
            'email'   => 'required|email',
            'message' => 'required|string|max:5000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            Mail::to(config('app.contact_email'))
                ->send(new ContactMail($request->name, $request->email, $request->message));
        } catch (Throwable $e) {
            return response()->json(['message' => "Erreur lors de l'envoi du message."], 500);
        }

        return response()->json(['message' => 'Votre message a bien été envoyé. Nous vous répondrons rapidement.']);
    }
}
