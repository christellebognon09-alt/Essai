<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ElementConstitutif extends Model
{
    protected $table = 'elements_constitutifs';

    protected $fillable = ['nom', 'matiere_id'];

    public function matiere(): BelongsTo
    {
        return $this->belongsTo(Matiere::class);
    }
}
