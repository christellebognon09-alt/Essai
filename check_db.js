import db from './db.js';
console.log(JSON.stringify(db.prepare('PRAGMA table_info(users)').all(), null, 2));
