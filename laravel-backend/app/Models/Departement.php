<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Departement extends Model
{
    protected $fillable = ['nom', 'description'];

    public function filieres(): HasMany
    {
        return $this->hasMany(Filiere::class);
    }
}
