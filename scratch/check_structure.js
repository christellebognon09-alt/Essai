import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function check() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'faucon_db'
    });

    try {
        console.log('--- TABLE USERS ---');
        const [usersFields] = await connection.query('DESCRIBE users');
        console.table(usersFields);

        console.log('\n--- TABLES IN DB ---');
        const [tables] = await connection.query('SHOW TABLES');
        console.table(tables);

        const [usersCount] = await connection.query('SELECT COUNT(*) as count FROM users');
        console.log('\nUsers count:', usersCount[0].count);

        if (tables.some(t => Object.values(t).includes('legacy_users'))) {
            const [legacyCount] = await connection.query('SELECT COUNT(*) as count FROM legacy_users');
            console.log('Legacy users count:', legacyCount[0].count);
        }

    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await connection.end();
    }
}

check();
