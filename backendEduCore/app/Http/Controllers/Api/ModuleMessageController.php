<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Module;
use App\Models\ModuleMessage;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ModuleMessageController extends Controller
{
    // GET /api/modules/{module}/messages
    public function index(Request $request, Module $module)
    {
        $this->authorizeAccess($request->user(), $module);

        return response()->json(
            $module->messages()->with('user')->orderBy('created_at')->get()
        );
    }

    // POST /api/modules/{module}/messages
    public function store(Request $request, Module $module)
    {
        $this->authorizeAccess($request->user(), $module);

        $validator = Validator::make($request->all(), [
            'message' => 'required|string|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $message = ModuleMessage::create([
            'module_id' => $module->id,
            'user_id'   => $request->user()->id,
            'message'   => $request->message,
        ]);

        return response()->json($message->load('user'), 201);
    }

    // DELETE /api/module-messages/{message} — author or admin.
    public function destroy(Request $request, ModuleMessage $message)
    {
        $user = $request->user();
        if (! $user->isAdmin() && $message->user_id !== $user->id) {
            return response()->json(['message' => 'Non autorisé'], 403);
        }

        $message->delete();

        return response()->json(['message' => 'Message supprimé']);
    }

    private function authorizeAccess(User $user, Module $module): void
    {
        if ($user->isAdmin()) {
            return;
        }
        if ($user->isFormateur() && $module->formateur_id === $user->id) {
            return;
        }
        if ($user->isStagiaire() && $user->groupe?->filiere_id === $module->filiere_id) {
            return;
        }

        abort(403, 'Non autorisé');
    }
}
