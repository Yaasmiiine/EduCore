<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    // GET /api/activity-logs — admin only. Paginated (and filterable) only
    // when a `page` param is sent, matching the rest of the app's convention.
    public function index(Request $request)
    {
        $query = ActivityLog::with('user')->orderByDesc('created_at');

        if ($request->filled('action')) {
            $query->where('action', $request->string('action'));
        }

        if ($request->filled('sujet_type')) {
            $query->where('sujet_type', $request->string('sujet_type'));
        }

        if ($request->has('page')) {
            return response()->json($query->paginate($request->integer('per_page', 20)));
        }

        return response()->json($query->limit(200)->get());
    }
}
