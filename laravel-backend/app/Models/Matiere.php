<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Matiere extends Model
{
    protected $fillable = ['nom', 'code', 'filiere_id', 'semestre', 'credits'];

    public function filiere(): BelongsTo
    {
        return $this->belongsTo(Filiere::class);
    }

    public function elementsConstitutifs(): HasMany
    {
        return $this->hasMany(ElementConstitutif::class);
    }
}
