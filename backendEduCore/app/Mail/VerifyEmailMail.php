<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VerifyEmailMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $prenom,
        public string $verifyUrl,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Confirmez votre adresse email EduCore',
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: <<<HTML
            <p>Bonjour {$this->prenom},</p>
            <p>Merci de votre inscription sur EduCore ! Confirmez votre adresse email pour activer votre compte.</p>
            <p><a href="{$this->verifyUrl}">Cliquez ici pour confirmer votre email</a></p>
            <p>Ce lien expire dans 60 minutes.</p>
            HTML,
        );
    }
}
