import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'faucon_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Helper to simulate the 'better-sqlite3' sync-like API or just export the pool
const db = {
    async execute(sql, params) {
        const [results] = await pool.execute(sql, params);
        return results;
    },
    async query(sql, params) {
        const [results] = await pool.query(sql, params);
        return results;
    },
    async get(sql, params) {
        const [results] = await pool.execute(sql, params);
        return results[0];
    },
    async run(sql, params) {
        const [result] = await pool.execute(sql, params);
        return {
            lastInsertRowid: result.insertId,
            changes: result.affectedRows
        };
    }
};

// Initialization function for tables
export const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                firstname VARCHAR(255),
                lastname VARCHAR(255),
                email VARCHAR(255) UNIQUE,
                password VARCHAR(255),
                googleId VARCHAR(255) UNIQUE,
                role VARCHAR(50) DEFAULT 'Étudiant',
                phone VARCHAR(50),
                gender VARCHAR(20),
                birth_date VARCHAR(100),
                birth_city VARCHAR(100),
                birth_country VARCHAR(100),
                nationality VARCHAR(100),
                address TEXT,
                filiere VARCHAR(255),
                level VARCHAR(100),
                parent_father_name VARCHAR(255),
                parent_father_firstname VARCHAR(255),
                parent_father_email VARCHAR(255),
                parent_father_phone VARCHAR(50),
                parent_father_job VARCHAR(255),
                parent_mother_name VARCHAR(255),
                parent_mother_firstname VARCHAR(255),
                parent_mother_email VARCHAR(255),
                parent_mother_phone VARCHAR(50),
                parent_mother_job VARCHAR(255),
                registration_complete TINYINT(1) DEFAULT 0,
                status_step INT DEFAULT 1,
                admin_notes TEXT,
                doc_acte_naissance VARCHAR(255),
                doc_photo VARCHAR(255),
                doc_attestation_bac VARCHAR(255),
                doc_bulletins VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Add news table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS news (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                image_url VARCHAR(255),
                description TEXT,
                gallery TEXT,
                category VARCHAR(100),
                date_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Migration for news table: Add description column if missing
        try {
            await pool.query('ALTER TABLE news ADD COLUMN description TEXT AFTER image_url');
            console.log('Colonne "description" ajoutée à la table news.');
        } catch (e) {
            // Column already exists
        }

        // Migration: Add role column if missing
        try {
            await pool.query('ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT "Étudiant" AFTER googleId');
            console.log('Colonne "role" ajoutée à la table users.');
        } catch (e) {
            // Column already exists, ignore
        }

        // Migration for news table: Add gallery column if missing
        try {
            await pool.query('ALTER TABLE news ADD COLUMN gallery TEXT AFTER image_url');
            console.log('Colonne "gallery" ajoutée à la table news.');
        } catch (e) {
            // Column already exists, ignore
        }

        // Migration for users table: Add OTP columns
        try {
            await pool.query('ALTER TABLE users ADD COLUMN otp_code VARCHAR(10) AFTER password');
            await pool.query('ALTER TABLE users ADD COLUMN otp_expiry DATETIME AFTER otp_code');
            console.log('Colonnes OTP ajoutées à la table users.');
        } catch (e) {
            // Columns already exist
        }

        // Seeding: Default Admin
        const seedUsers = [
            { email: 'admin@faucon.bj', pass: 'admin123', role: 'Admin', first: 'Admin', last: 'Faucon' },
            { email: 'admin@faucon.com', pass: 'password', role: 'Admin', first: 'Admin', last: 'Test' },
            { email: 'secretariat@faucon.com', pass: 'password', role: 'Secrétaire', first: 'Secrétaire', last: 'Test' },
            { email: 'comptable@faucon.com', pass: 'password', role: 'Comptable', first: 'Comptable', last: 'Test' },
            { email: 'surveillant@faucon.com', pass: 'password', role: 'Surveillant', first: 'Surveillant', last: 'Test' }
        ];

        const bcrypt = await import('bcryptjs');
        for (const u of seedUsers) {
            const existing = await db.get('SELECT * FROM users WHERE email = ?', [u.email]);
            if (!existing) {
                const hashedPassword = await bcrypt.default.hash(u.pass, 10);
                await db.run('INSERT INTO users (firstname, lastname, email, password, role) VALUES (?, ?, ?, ?, ?)', [
                    u.first, u.last, u.email, hashedPassword, u.role
                ]);
                console.log(`Compte créé : ${u.email} / ${u.pass} (${u.role})`);
            }
        }

        console.log('MySQL Database initialized successfully with role and news table.');
    } catch (error) {
        if (error.code === 'ER_BAD_DB_ERROR') {
            console.error('ERREUR : La base de données "faucon_db" n\'existe pas. Veuillez la créer dans phpMyAdmin.');
        } else {
            console.error('Database initialization error:', error.message);
        }
    }
};

export default db;
