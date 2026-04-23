import db from './db.js';
async function test() {
  await db.run("INSERT INTO users (firstname, lastname, email, registration_complete, status_step, phone, filiere, level) VALUES ('Test', 'Student', 'test@student.com', 1, 1, '+225 12345678', 'Informatique', 'L1')");
  process.exit();
}
test();
