import express from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';
import { createToken } from '../utils/createToken.js';

const router = express.Router();

router.post('/register', async (req, res) => {
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
});

router.post('/login', async (req, res) => {
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
});

export default router;
