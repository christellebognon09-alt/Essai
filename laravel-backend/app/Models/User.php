<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'firstname',
        'lastname',
        'email',
        'password',
        'googleId',
        'role',
        'phone',
        'gender',
        'birth_date',
        'birth_city',
        'birth_country',
        'nationality',
        'address',
        'filiere',
        'filiere_id',
        'level',
        'parent_father_name',
        'parent_father_firstname',
        'parent_father_email',
        'parent_father_phone',
        'parent_father_job',
        'parent_mother_name',
        'parent_mother_firstname',
        'parent_mother_email',
        'parent_mother_phone',
        'parent_mother_job',
        'registration_complete',
        'status_step',
        'admin_notes',
        'doc_acte_naissance',
        'doc_photo',
        'doc_attestation_bac',
        'doc_bulletins',
        'receipt_url',
        'matricule',
        'otp_code',
        'otp_expiry',
        'is_rejected',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'registration_complete' => 'boolean',
            'is_rejected' => 'boolean',
            'otp_expiry' => 'datetime',
        ];
    }
}
