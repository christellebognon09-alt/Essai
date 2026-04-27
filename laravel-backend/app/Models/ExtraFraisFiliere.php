<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExtraFraisFiliere extends Model
{
    protected $fillable = ['filiere_id', 'label', 'amount', 'deadline'];

    public function filiere()
    {
        return $this->belongsTo(Filiere::class);
    }
}
