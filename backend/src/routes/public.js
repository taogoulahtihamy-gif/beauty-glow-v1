import express from 'express';
import { pool } from '../config/db.js';

const router = express.Router();

router.get('/site', async (_req, res) => {
  const settings = await pool.query('SELECT * FROM site_settings WHERE id = 1');
  const services = await pool.query('SELECT * FROM services WHERE is_active = TRUE ORDER BY id ASC');
  const gallery = await pool.query('SELECT * FROM gallery_images ORDER BY id DESC');

  res.json({
    settings: settings.rows[0],
    services: services.rows,
    gallery: gallery.rows,
  });
});

export default router;
