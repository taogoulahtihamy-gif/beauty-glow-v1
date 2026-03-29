import express from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';
import { createToken } from '../utils/createToken.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Nom, email et mot de passe requis.' });
    }

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);

    if (existing.rowCount > 0) {
      return res.status(409).json({ message: 'Cet email existe déjà.' });
    }

    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (role, full_name, email, phone, password_hash)
       VALUES ('client', $1, $2, $3, $4)
       RETURNING id, role, full_name, email, phone`,
      [fullName, email, phone || '', hash]
    );

    const user = result.rows[0];
    const token = createToken(user);

    res.status(201).json({ token, user });
  } catch (error) {
    console.error('Erreur register :', error);
    res.status(500).json({
      message: "Impossible de créer le compte.",
      error: error.message,
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rowCount === 0) {
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.status(401).json({ message: 'Identifiants invalides.' });
    }

    const token = createToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        role: user.role,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error('Erreur login :', error);
    res.status(500).json({
      message: "Impossible de se connecter.",
      error: error.message,
    });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, role, full_name, email, phone
       FROM users
       WHERE id = $1`,
      [req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Erreur récupération profil :', error);
    res.status(500).json({
      message: 'Impossible de charger le profil.',
      error: error.message,
    });
  }
});

router.patch('/me', requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json({ message: 'Accès client requis.' });
    }

    const { fullName, email, phone } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET full_name = COALESCE($1, full_name),
           email = COALESCE($2, email),
           phone = COALESCE($3, phone)
       WHERE id = $4
       RETURNING id, role, full_name, email, phone`,
      [fullName || null, email || null, phone || null, req.user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Utilisateur introuvable.' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Erreur mise à jour profil :', error);
    res.status(500).json({
      message: 'Impossible de mettre à jour le profil.',
      error: error.message,
    });
  }
});

export default router;