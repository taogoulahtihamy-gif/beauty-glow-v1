import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './config/db.js';
import authRoutes from './routes/auth.js';
import publicRoutes from './routes/public.js';
import bookingsRoutes from './routes/bookings.js';
import adminRoutes from './routes/admin.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '5mb' }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/api/health', async (_req, res) => {
  const result = await pool.query('SELECT NOW()');
  res.json({ status: 'ok', now: result.rows[0].now });
});

app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/admin', adminRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Erreur serveur.' });
});

app.listen(port, () => {
  console.log(`Beauty Glow backend running on http://localhost:${port}`);
});
