<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    // GET /api/notifications — the authenticated user's own notifications, most recent first.
    public function index(Request $request)
    {
        $notifications = $request->user()
            ->appNotifications()
            ->latest()
            ->limit(30)
            ->get();

        return response()->json([
            'notifications' => $notifications,
            'unread_count'   => $request->user()->appNotifications()->unread()->count(),
        ]);
    }

    // POST /api/notifications/{notification}/read
    public function markRead(Request $request, Notification $notification)
    {
        abort_unless($notification->user_id === $request->user()->id, 403);

        $notification->update(['read_at' => now()]);
        return response()->json($notification);
    }

    // POST /api/notifications/read-all
    public function markAllRead(Request $request)
    {
        $request->user()->appNotifications()->unread()->update(['read_at' => now()]);
        return response()->json(['message' => 'Notifications marquées comme lues']);
    }
}
