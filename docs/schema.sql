CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  role VARCHAR(20) NOT NULL DEFAULT 'client',
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(160) UNIQUE NOT NULL,
  phone VARCHAR(30),
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  hero_badge VARCHAR(120) NOT NULL DEFAULT 'Salon beauté premium',
  hero_title VARCHAR(255) NOT NULL DEFAULT 'Révélez votre éclat avec Beauty Glow',
  hero_subtitle TEXT NOT NULL DEFAULT 'Coiffure, maquillage, ongles et soins avec une expérience premium pensée pour vous.',
  hero_primary_cta VARCHAR(80) NOT NULL DEFAULT 'Réserver maintenant',
  hero_secondary_cta VARCHAR(80) NOT NULL DEFAULT 'Découvrir nos prestations',
  hero_image TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
  about_title VARCHAR(180) NOT NULL DEFAULT 'Un salon pensé pour sublimer chaque détail.',
  about_text TEXT NOT NULL DEFAULT 'Beauty Glow vous accueille pour une expérience douce, élégante et rassurante. Notre mission est simple : vous faire gagner du temps, vous mettre en confiance et révéler votre style.',
  about_image TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1200&q=80',
  contact_phone VARCHAR(30) NOT NULL DEFAULT '+221 77 000 00 00',
  contact_email VARCHAR(160) NOT NULL DEFAULT 'contact@beautyglow.sn',
  contact_whatsapp VARCHAR(30) NOT NULL DEFAULT '221770000000',
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  title VARCHAR(120) NOT NULL,
  description TEXT NOT NULL,
  price_label VARCHAR(80) NOT NULL,
  duration_label VARCHAR(80) NOT NULL,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery_images (
  id SERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  alt_text VARCHAR(160) NOT NULL DEFAULT 'Photo Beauty Glow',
  category VARCHAR(80) NOT NULL DEFAULT 'Galerie',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(120) NOT NULL,
  customer_email VARCHAR(160),
  customer_phone VARCHAR(30) NOT NULL,
  service_name VARCHAR(120) NOT NULL,
  booking_date DATE NOT NULL,
  booking_time VARCHAR(10) NOT NULL,
  notes TEXT,
  status VARCHAR(30) NOT NULL DEFAULT 'en_attente',
  whatsapp_notified BOOLEAN NOT NULL DEFAULT FALSE,
  client_notified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
  notification_type VARCHAR(50) NOT NULL,
  recipient VARCHAR(160) NOT NULL,
  payload TEXT,
  sent_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO services (title, description, price_label, duration_label, image_url)
SELECT 'Coiffure premium', 'Tresses, nattes, vanilles, finitions soignées et conseils personnalisés.', 'À partir de 10 000 FCFA', '2h à 4h', 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=1000&q=80'
WHERE NOT EXISTS (SELECT 1 FROM services);

INSERT INTO services (title, description, price_label, duration_label, image_url)
SELECT 'Maquillage', 'Mise en beauté naturelle, cérémonie, shooting ou soirée.', 'À partir de 20 000 FCFA', '45 min à 1h30', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80'
WHERE (SELECT COUNT(*) FROM services) = 1;

INSERT INTO services (title, description, price_label, duration_label, image_url)
SELECT 'Manucure & pédicure', 'Soin des mains et des pieds avec finition propre et durable.', 'À partir de 5 000 FCFA', '45 min à 1h', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1000&q=80'
WHERE (SELECT COUNT(*) FROM services) = 2;

INSERT INTO gallery_images (image_url, alt_text, category)
SELECT 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=80', 'Coiffure 1', 'Coiffure'
WHERE NOT EXISTS (SELECT 1 FROM gallery_images);

INSERT INTO gallery_images (image_url, alt_text, category)
SELECT 'https://images.unsplash.com/photo-1498842812179-c81beecf902c?auto=format&fit=crop&w=900&q=80', 'Makeup 1', 'Maquillage'
WHERE (SELECT COUNT(*) FROM gallery_images) = 1;

INSERT INTO gallery_images (image_url, alt_text, category)
SELECT 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=900&q=80', 'Nails 1', 'Ongles'
WHERE (SELECT COUNT(*) FROM gallery_images) = 2;
