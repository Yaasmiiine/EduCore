<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ModuleMessage extends Model
{
    protected $fillable = ['module_id', 'user_id', 'message'];

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
