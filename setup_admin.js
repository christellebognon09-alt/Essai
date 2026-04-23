import db, { initDB } from './db.js';
import bcrypt from 'bcryptjs';

async function setup() {
    try {
        console.log('--- Initialisation de la base de données ---');
        await initDB();

        console.log('--- Ajout de la colonne role (si manquante) ---');
        try {
            await db.run('ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT "Étudiant" AFTER googleId');
            console.log('Colonne "role" ajoutée.');
        } catch (e) {
            console.log('La colonne "role" existe déjà ou erreur mineure (continuons...).');
        }

        console.log('--- Création du compte Admin par défaut ---');
        const adminEmail = 'admin@faucon.bj';
        const rawPassword = 'admin123';
        
        // Vérifier si l'admin existe déjà
        const existingAdmin = await db.get('SELECT * FROM users WHERE email = ?', [adminEmail]);
        
        if (existingAdmin) {
            console.log(`L'utilisateur ${adminEmail} existe déjà. Mise à jour du rôle en Admin.`);
            await db.run('UPDATE users SET role = "Admin" WHERE email = ?', [adminEmail]);
        } else {
            const hashedPassword = await bcrypt.hash(rawPassword, 10);
            await db.run('INSERT INTO users (firstname, lastname, email, password, role) VALUES (?, ?, ?, ?, ?)', [
                'Admin',
                'Faucon',
                adminEmail,
                hashedPassword,
                'Admin'
            ]);
            console.log(`Compte Admin créé avec succès !`);
            console.log(`Email : ${adminEmail}`);
            console.log(`Password : ${rawPassword}`);
        }

        console.log('--- Configuration terminée ---');
        process.exit(0);
    } catch (err) {
        console.error('Erreur lors de la configuration :', err);
        process.exit(1);
    }
}

setup();
