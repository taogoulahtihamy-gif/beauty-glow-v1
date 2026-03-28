import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { pool } from '../config/db.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({ storage });

function getBaseUrl(req) {
  return (
    process.env.PUBLIC_BACKEND_URL ||
    `${req.protocol}://${req.get('host')}`
  );
}

router.get('/dashboard', requireAdmin, async (_req, res) => {
  const [bookings, services, gallery] = await Promise.all([
    pool.query('SELECT COUNT(*)::int AS count FROM bookings'),
    pool.query('SELECT COUNT(*)::int AS count FROM services'),
    pool.query('SELECT COUNT(*)::int AS count FROM gallery_images'),
  ]);

  res.json({
    bookings: bookings.rows[0].count,
    services: services.rows[0].count,
    gallery: gallery.rows[0].count,
  });
});

router.get('/content', requireAdmin, async (_req, res) => {
  const settings = await pool.query('SELECT * FROM site_settings WHERE id = 1');
  const gallery = await pool.query('SELECT * FROM gallery_images ORDER BY id DESC');

  res.json({
    settings: settings.rows[0],
    gallery: gallery.rows,
  });
});

router.patch('/content', requireAdmin, async (req, res) => {
  const {
    heroBadge,
    heroTitle,
    heroSubtitle,
    heroPrimaryCta,
    heroSecondaryCta,
    heroImage,
    aboutTitle,
    aboutText,
    aboutImage,
    contactPhone,
    contactEmail,
    contactWhatsapp,
  } = req.body;

  const result = await pool.query(
    `UPDATE site_settings
     SET hero_badge = COALESCE($1, hero_badge),
         hero_title = COALESCE($2, hero_title),
         hero_subtitle = COALESCE($3, hero_subtitle),
         hero_primary_cta = COALESCE($4, hero_primary_cta),
         hero_secondary_cta = COALESCE($5, hero_secondary_cta),
         hero_image = COALESCE($6, hero_image),
         about_title = COALESCE($7, about_title),
         about_text = COALESCE($8, about_text),
         about_image = COALESCE($9, about_image),
         contact_phone = COALESCE($10, contact_phone),
         contact_email = COALESCE($11, contact_email),
         contact_whatsapp = COALESCE($12, contact_whatsapp),
         updated_at = NOW()
     WHERE id = 1
     RETURNING *`,
    [
      heroBadge || null,
      heroTitle || null,
      heroSubtitle || null,
      heroPrimaryCta || null,
      heroSecondaryCta || null,
      heroImage || null,
      aboutTitle || null,
      aboutText || null,
      aboutImage || null,
      contactPhone || null,
      contactEmail || null,
      contactWhatsapp || null,
    ]
  );

  res.json(result.rows[0]);
});

router.post('/upload', requireAdmin, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Image requise.' });
  }

  const baseUrl = getBaseUrl(req);
  const url = `${baseUrl}/uploads/${req.file.filename}`;

  res.status(201).json({
    url,
    filename: req.file.filename,
  });
});

router.post('/gallery', requireAdmin, async (req, res) => {
  const { imageUrl, altText, category } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ message: 'imageUrl est requis.' });
  }

  const result = await pool.query(
    `INSERT INTO gallery_images (image_url, alt_text, category)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [imageUrl, altText || 'Photo Beauty Glow', category || 'Galerie']
  );

  res.status(201).json({
    image: result.rows[0],
  });
});

router.delete('/gallery/:id', requireAdmin, async (req, res) => {
  await pool.query('DELETE FROM gallery_images WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

export default router;