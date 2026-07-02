<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $senderName,
        public string $senderEmail,
        public string $messageBody,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Nouveau message de contact — {$this->senderName}",
            replyTo: [$this->senderEmail],
        );
    }

    public function content(): Content
    {
        $safeMessage = nl2br(e($this->messageBody));

        return new Content(
            htmlString: <<<HTML
            <p><strong>Nom :</strong> {$this->senderName}</p>
            <p><strong>Email :</strong> {$this->senderEmail}</p>
            <p><strong>Message :</strong></p>
            <p>{$safeMessage}</p>
            HTML,
        );
    }
}
