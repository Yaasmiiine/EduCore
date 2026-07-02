<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ResetPasswordMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $prenom,
        public string $resetUrl,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Réinitialisation de votre mot de passe EduCore',
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: <<<HTML
            <p>Bonjour {$this->prenom},</p>
            <p>Vous avez demandé la réinitialisation de votre mot de passe EduCore.</p>
            <p><a href="{$this->resetUrl}">Cliquez ici pour choisir un nouveau mot de passe</a></p>
            <p>Ce lien expire dans 60 minutes. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.</p>
            HTML,
        );
    }
}
