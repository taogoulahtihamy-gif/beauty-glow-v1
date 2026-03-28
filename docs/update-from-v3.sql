ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_badge VARCHAR(120) NOT NULL DEFAULT 'Salon beauté premium';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_primary_cta VARCHAR(80) NOT NULL DEFAULT 'Réserver maintenant';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS hero_secondary_cta VARCHAR(80) NOT NULL DEFAULT 'Découvrir nos prestations';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS about_title VARCHAR(180) NOT NULL DEFAULT 'Un salon pensé pour sublimer chaque détail.';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS about_text TEXT NOT NULL DEFAULT 'Beauty Glow vous accueille pour une expérience douce, élégante et rassurante. Notre mission est simple : vous faire gagner du temps, vous mettre en confiance et révéler votre style.';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(30) NOT NULL DEFAULT '+221 77 000 00 00';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS contact_email VARCHAR(160) NOT NULL DEFAULT 'contact@beautyglow.sn';
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS contact_whatsapp VARCHAR(30) NOT NULL DEFAULT '221770000000';
