<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Hash;

class MigrateLegacyData extends Command
{
    protected $signature = 'app:migrate-legacy-data';
    protected $description = 'Migrate data from legacy Node.js tables to new Laravel tables';

    public function handle()
    {
        $this->info('Starting migration of legacy data...');

        // 1. Rename existing tables if they don't have the "legacy_" prefix yet
        if (Schema::hasTable('users') && !Schema::hasTable('legacy_users')) {
            $this->line('Renaming users table to legacy_users...');
            DB::statement('RENAME TABLE users TO legacy_users');
        }

        if (Schema::hasTable('news') && !Schema::hasTable('legacy_news')) {
            $this->line('Renaming news table to legacy_news...');
            DB::statement('RENAME TABLE news TO legacy_news');
        }

        // 2. Run Laravel Migrations
        $this->line('Running Laravel migrations...');
        $this->call('migrate');

        // 3. Migrate Users
        if (Schema::hasTable('legacy_users')) {
            $legacyUsers = DB::table('legacy_users')->get();
            $this->info("Found " . $legacyUsers->count() . " users to migrate.");

            foreach ($legacyUsers as $user) {
                // Check if user already exists in new table
                if (DB::table('users')->where('email', $user->email)->exists()) {
                    continue;
                }

                DB::table('users')->insert([
                    'id' => $user->id,
                    'firstname' => $user->firstname,
                    'lastname' => $user->lastname,
                    'email' => $user->email,
                    'password' => $user->password, // Already bcrypt in legacy
                    'googleId' => $user->googleId,
                    'role' => $user->role ?? 'Étudiant',
                    'phone' => $user->phone,
                    'gender' => $user->gender,
                    'birth_date' => $user->birth_date,
                    'birth_city' => $user->birth_city,
                    'birth_country' => $user->birth_country,
                    'nationality' => $user->nationality,
                    'address' => $user->address,
                    'filiere' => $user->filiere,
                    'level' => $user->level,
                    'parent_father_name' => $user->parent_father_name,
                    'parent_father_firstname' => $user->parent_father_firstname,
                    'parent_father_email' => $user->parent_father_email,
                    'parent_father_phone' => $user->parent_father_phone,
                    'parent_father_job' => $user->parent_father_job,
                    'parent_mother_name' => $user->parent_mother_name,
                    'parent_mother_firstname' => $user->parent_mother_firstname,
                    'parent_mother_email' => $user->parent_mother_email,
                    'parent_mother_phone' => $user->parent_mother_phone,
                    'parent_mother_job' => $user->parent_mother_job,
                    'registration_complete' => $user->registration_complete ?? 0,
                    'status_step' => $user->status_step ?? 1,
                    'admin_notes' => $user->admin_notes,
                    'doc_acte_naissance' => $user->doc_acte_naissance,
                    'doc_photo' => $user->doc_photo,
                    'doc_attestation_bac' => $user->doc_attestation_bac,
                    'doc_bulletins' => $user->doc_bulletins,
                    'otp_code' => $user->otp_code ?? null,
                    'otp_expiry' => $user->otp_expiry ?? null,
                    'created_at' => $user->created_at ?? now(),
                    'updated_at' => now(),
                ]);
            }
            $this->info("Users migrated successfully.");
        }

        // 4. Migrate News
        if (Schema::hasTable('legacy_news')) {
            $legacyNews = DB::table('legacy_news')->get();
            $this->info("Found " . $legacyNews->count() . " news articles to migrate.");

            foreach ($legacyNews as $news) {
                DB::table('news')->insert([
                    'id' => $news->id,
                    'title' => $news->title,
                    'content' => $news->content,
                    'image_url' => $news->image_url,
                    'description' => $news->description,
                    'gallery' => $news->gallery,
                    'category' => $news->category,
                    'date_posted' => $news->date_posted ?? now(),
                    'created_at' => $news->date_posted ?? now(),
                    'updated_at' => now(),
                ]);
            }
            $this->info("News migrated successfully.");
        }

        $this->info('Migration completed!');
    }
}
