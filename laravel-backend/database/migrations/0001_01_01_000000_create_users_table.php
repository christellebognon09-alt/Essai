<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('firstname');
            $table->string('lastname');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password')->nullable();
            $table->string('googleId')->unique()->nullable();
            $table->string('role')->default('Étudiant');
            $table->string('phone')->nullable();
            $table->string('gender')->nullable();
            $table->string('birth_date')->nullable();
            $table->string('birth_city')->nullable();
            $table->string('birth_country')->nullable();
            $table->string('nationality')->nullable();
            $table->text('address')->nullable();
            $table->string('filiere')->nullable();
            $table->string('level')->nullable();
            $table->string('parent_father_name')->nullable();
            $table->string('parent_father_firstname')->nullable();
            $table->string('parent_father_email')->nullable();
            $table->string('parent_father_phone')->nullable();
            $table->string('parent_father_job')->nullable();
            $table->string('parent_mother_name')->nullable();
            $table->string('parent_mother_firstname')->nullable();
            $table->string('parent_mother_email')->nullable();
            $table->string('parent_mother_phone')->nullable();
            $table->string('parent_mother_job')->nullable();
            $table->boolean('registration_complete')->default(false);
            $table->integer('status_step')->default(1);
            $table->text('admin_notes')->nullable();
            $table->string('doc_acte_naissance')->nullable();
            $table->string('doc_photo')->nullable();
            $table->string('doc_attestation_bac')->nullable();
            $table->string('doc_bulletins')->nullable();
            $table->string('receipt_url')->nullable();
            $table->string('matricule')->nullable();
            $table->string('otp_code')->nullable();
            $table->timestamp('otp_expiry')->nullable();
            $table->boolean('is_rejected')->default(false);
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
