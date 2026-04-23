import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import db, { initDB } from './db.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static('dist'));
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'faucon_secret_key',
  resave: true,
  saveUninitialized: true,
  cookie: { 
    secure: false, // Set to true if using HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport serialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.get('SELECT * FROM users WHERE id = ?', [id]);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists
      let user = await db.get('SELECT * FROM users WHERE googleId = ? OR email = ?', [profile.id, profile.emails[0].value]);
      
      if (!user) {
        // Create user
        const result = await db.run('INSERT INTO users (firstname, lastname, email, googleId) VALUES (?, ?, ?, ?)', [
          profile.name.givenName,
          profile.name.familyName,
          profile.emails[0].value,
          profile.id
        ]);
        user = { id: result.lastInsertRowid, email: profile.emails[0].value };
      } else if (!user.googleId) {
        // Link google account to existing email
        await db.run('UPDATE users SET googleId = ? WHERE id = ?', [profile.id, user.id]);
      }
      
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));
}

// Routes
app.post('/api/register', async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.run('INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)', [
      firstname, lastname, email, hashedPassword
    ]);
    const user = { id: result.lastInsertRowid, email, firstname, lastname, registration_complete: 0 };
    
    req.login(user, (err) => {
      if (err) return res.status(500).json({ message: 'Login error after registration' });
      req.session.save((err) => {
        if (err) return res.status(500).json({ message: 'Session save error' });
        res.status(201).json({ message: 'User registered and logged in successfully', user });
      });
    });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      res.status(400).json({ message: 'Email already exists' });
    } else {
      res.status(500).json({ message: 'Database error', error: error.message });
    }
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
  
  if (!user || !user.password) {
    return res.status(401).json({ message: 'Identifiant invalid' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ message: 'Identifiant invalid' });
  }

  req.login(user, (err) => {
    if (err) return res.status(500).json({ message: 'Login error' });
    req.session.save((err) => {
      if (err) return res.status(500).json({ message: 'Session save error' });
      res.json({ 
        message: 'Login successful', 
        user: { 
          id: user.id, 
          email: user.email, 
          firstname: user.firstname,
          lastname: user.lastname,
          role: user.role,
          registration_complete: !!user.registration_complete
        } 
      });
    });
  });
});

// PASSWORD RECOVERY (OTP)
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) return res.status(404).json({ message: 'Email non trouvé' });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await db.run('UPDATE users SET otp_code = ?, otp_expiry = ? WHERE id = ?', [otp, expiry, user.id]);

    console.log(`[AUTH] OTP for ${email}: ${otp}`); // Simulated email sending
    res.json({ message: 'Code de récupération envoyé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la génération du code' });
  }
});

app.post('/api/verify-otp', async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await db.get('SELECT * FROM users WHERE email = ? AND otp_code = ? AND otp_expiry > CURRENT_TIMESTAMP', [email, code]);
    if (!user) return res.status(400).json({ message: 'Code invalide ou expiré' });
    res.json({ message: 'Code valide', verified: true });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la vérification' });
  }
});

app.post('/api/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;
  try {
    const user = await db.get('SELECT * FROM users WHERE email = ? AND otp_code = ?', [email, code]);
    if (!user) return res.status(400).json({ message: 'Invalid request' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.run('UPDATE users SET password = ?, otp_code = NULL, otp_expiry = NULL WHERE id = ?', [hashedPassword, user.id]);

    res.json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la réinitialisation' });
  }
});

app.get('/api/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.json({ authenticated: false });
  }
});

app.post('/api/update-profile', upload.fields([
  { name: 'acteNaissance', maxCount: 1 },
  { name: 'photoIdentite', maxCount: 1 },
  { name: 'attestationBac', maxCount: 1 },
  { name: 'bulletinsNotes', maxCount: 1 }
]), async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const {
    firstname, lastname, telephone, genre, birth_date, birth_city, birth_country,
    nationality, address, filiere, level,
    nomPere, prenomPere, emailPere, telephonePere, autreInfoPere,
    nomMere, prenomMere, emailMere, telephoneMere, autreInfoMere
  } = req.body;

  const files = req.files;
  const doc_acte = files.acteNaissance ? `/uploads/${files.acteNaissance[0].filename}` : null;
  const doc_photo = files.photoIdentite ? `/uploads/${files.photoIdentite[0].filename}` : null;
  const doc_bac = files.attestationBac ? `/uploads/${files.attestationBac[0].filename}` : null;
  const doc_bulletins = files.bulletinsNotes ? `/uploads/${files.bulletinsNotes[0].filename}` : null;

  try {
    await db.run(`
      UPDATE users SET 
        firstname = ?, lastname = ?, phone = ?, gender = ?, birth_date = ?, 
        birth_city = ?, birth_country = ?, nationality = ?, address = ?, 
        filiere = ?, level = ?,
        parent_father_name = ?, parent_father_firstname = ?, parent_father_email = ?, parent_father_phone = ?, parent_father_job = ?,
        parent_mother_name = ?, parent_mother_firstname = ?, parent_mother_email = ?, parent_mother_phone = ?, parent_mother_job = ?,
        doc_acte_naissance = COALESCE(?, doc_acte_naissance),
        doc_photo = COALESCE(?, doc_photo),
        doc_attestation_bac = COALESCE(?, doc_attestation_bac),
        doc_bulletins = COALESCE(?, doc_bulletins),
        registration_complete = 1,
        status_step = 1
      WHERE id = ?
    `, [
      firstname, lastname, telephone, genre, birth_date, birth_city, birth_country,
      nationality, address, filiere, level,
      nomPere, prenomPere, emailPere, telephonePere, autreInfoPere,
      nomMere, prenomMere, emailMere, telephoneMere, autreInfoMere,
      doc_acte, doc_photo, doc_bac, doc_bulletins,
      req.user.id
    ]);
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

app.post('/api/update-status-step', async (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({ message: 'Unauthorized' });
  const { step } = req.body;
  try {
    await db.run('UPDATE users SET status_step = ? WHERE id = ?', [step, req.user.id]);
    res.json({ message: 'Status step updated' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating status step' });
  }
});

app.post('/api/submit-receipt', upload.single('receipt'), async (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({ message: 'Unauthorized' });
  const receipt_url = req.file ? `/uploads/${req.file.filename}` : null;
  try {
    await db.run('UPDATE users SET status_step = 4, receipt_url = ? WHERE id = ?', [receipt_url, req.user.id]);
    res.json({ message: 'Receipt submitted successfully', receipt_url });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting receipt' });
  }
});

app.post('/api/admin/validate-payment', async (req, res) => {
  const { studentId } = req.body;
  try {
    await db.run('UPDATE users SET status_step = 5 WHERE id = ?', [studentId]);
    res.json({ message: 'Payment validated' });
  } catch (error) {
    res.status(500).json({ message: 'Error validating payment' });
  }
});

// Admin/Staff APIs
app.get('/api/admin/students', async (req, res) => {
  try {
    const students = await db.query('SELECT * FROM users WHERE registration_complete = 1');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students' });
  }
});

app.post('/api/admin/validate-dossier', async (req, res) => {
  const { studentId } = req.body;
  try {
    await db.run('UPDATE users SET status_step = 2, is_rejected = 0 WHERE id = ?', [studentId]);
    res.json({ message: 'Dossier validated' });
  } catch (error) {
    res.status(500).json({ message: 'Error validating dossier' });
  }
});

app.post('/api/admin/reject-dossier', async (req, res) => {
  const { studentId, notes } = req.body;
  try {
    // Keep at step 1 (waiting) but marked as rejected
    await db.run('UPDATE users SET is_rejected = 1, admin_notes = ? WHERE id = ?', [notes, studentId]);
    res.json({ message: 'Dossier rejected' });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting dossier' });
  }
});

app.post('/api/admin/save-notes', async (req, res) => {
  const { studentId, notes } = req.body;
  try {
    await db.run('UPDATE users SET admin_notes = ? WHERE id = ?', [notes, studentId]);
    res.json({ message: 'Notes saved' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving notes' });
  }
});

app.post('/api/admin/generate-matricule', async (req, res) => {
  const { studentId, matricule, email } = req.body;
  try {
    await db.run('UPDATE users SET matricule = ?, email = ? WHERE id = ?', [matricule, email, studentId]);
    res.json({ message: 'Matricule and email generated' });
  } catch (error) {
    res.status(500).json({ message: 'Error generating matricule' });
  }
});

// News APIs
app.get('/api/news', async (req, res) => {
  try {
    const news = await db.query('SELECT * FROM news ORDER BY date_posted DESC');
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching news' });
  }
});

app.post('/api/admin/news', upload.fields([
  { name: 'cover', maxCount: 1 },
  { name: 'photos', maxCount: 10 }
]), async (req, res) => {
  if (!req.isAuthenticated() || req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Reserved for Admins' });
  }

  const { title, content, category, description } = req.body;
  const files = req.files || {};
  const image_url = files.cover ? `/uploads/${files.cover[0].filename}` : null;
  const gallery = files.photos ? JSON.stringify(files.photos.map(f => `/uploads/${f.filename}`)) : null;

  console.log(`[NEWS] Creating article: ${title}`);
  
  try {
    const result = await db.run(
      'INSERT INTO news (title, content, image_url, description, gallery, category) VALUES (?, ?, ?, ?, ?, ?)',
      [title, content, image_url, description, gallery, category]
    );
    res.status(201).json({ message: 'News article created', id: result.lastInsertRowid });
  } catch (error) {
    console.error('[NEWS] Insert Error:', error);
    res.status(500).json({ message: 'Error creating news article' });
  }
});

app.put('/api/admin/news/:id', upload.fields([
  { name: 'cover', maxCount: 1 },
  { name: 'photos', maxCount: 10 }
]), async (req, res) => {
  if (!req.isAuthenticated() || req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Reserved for Admins' });
  }

  const { title, content, category, description } = req.body;
  const files = req.files || {};
  
  console.log(`[NEWS] Updating article ${req.params.id}: ${title}`);
  
  let updateSQL = 'UPDATE news SET title = ?, content = ?, category = ?, description = ?';
  let params = [title, content, category, description];

  if (files.cover) {
    updateSQL += ', image_url = ?';
    params.push(`/uploads/${files.cover[0].filename}`);
  }
  if (files.photos) {
    updateSQL += ', gallery = ?';
    params.push(JSON.stringify(files.photos.map(f => `/uploads/${f.filename}`)));
  }

  updateSQL += ' WHERE id = ?';
  params.push(req.params.id);

  try {
    await db.run(updateSQL, params);
    res.json({ message: 'News article updated' });
  } catch (error) {
    console.error('[NEWS] Update Error:', error);
    res.status(500).json({ message: 'Error updating news article' });
  }
});

app.delete('/api/admin/news/:id', async (req, res) => {
  if (!req.isAuthenticated() || req.user.role !== 'Admin') {
    return res.status(403).json({ message: 'Reserved for Admins' });
  }

  try {
    await db.run('DELETE FROM news WHERE id = ?', [req.params.id]);
    res.json({ message: 'News article deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting news article' });
  }
});

// Google Auth Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login.html' }),
  (req, res) => {
    // Successful authentication, redirect to dashboard.
    res.redirect('/dashboard.html');
  });

app.post('/api/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: 'Logout error' });
    res.json({ message: 'Logged out successfully' });
  });
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to start server due to DB error:', err);
});
