<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    protected $fillable = [
        'title',
        'content',
        'image_url',
        'description',
        'gallery',
        'category',
        'date_posted',
    ];

    protected $casts = [
        'gallery' => 'array',
        'date_posted' => 'datetime',
    ];
}
