import db from './db.js';

const columns = [
    { name: 'phone', type: 'TEXT' },
    { name: 'gender', type: 'TEXT' },
    { name: 'birth_date', type: 'TEXT' },
    { name: 'birth_city', type: 'TEXT' },
    { name: 'birth_country', type: 'TEXT' },
    { name: 'nationality', type: 'TEXT' },
    { name: 'address', type: 'TEXT' },
    { name: 'filiere', type: 'TEXT' },
    { name: 'level', type: 'TEXT' },
    { name: 'parent_father_name', type: 'TEXT' },
    { name: 'parent_father_firstname', type: 'TEXT' },
    { name: 'parent_father_email', type: 'TEXT' },
    { name: 'parent_father_phone', type: 'TEXT' },
    { name: 'parent_father_job', type: 'TEXT' },
    { name: 'parent_mother_name', type: 'TEXT' },
    { name: 'parent_mother_firstname', type: 'TEXT' },
    { name: 'parent_mother_email', type: 'TEXT' },
    { name: 'parent_mother_phone', type: 'TEXT' },
    { name: 'parent_mother_job', type: 'TEXT' },
    { name: 'registration_complete', type: 'INTEGER DEFAULT 0' },
    { name: 'status_step', type: 'INTEGER DEFAULT 1' },
    { name: 'admin_notes', type: 'TEXT' }
];

const tableInfo = db.prepare('PRAGMA table_info(users)').all();
const existingColumns = tableInfo.map(c => c.name);

for (const col of columns) {
    if (!existingColumns.includes(col.name)) {
        console.log(`Adding column ${col.name}...`);
        try {
            db.exec(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`);
        } catch (e) {
            console.error(`Error adding ${col.name}:`, e.message);
        }
    }
}

console.log('Database schema update complete.');
process.exit(0);
