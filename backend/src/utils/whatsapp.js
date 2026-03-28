import { pool } from '../config/db.js';

export async function logNotification({ bookingId, type, recipient, payload }) {
  await pool.query(
    `INSERT INTO notifications (booking_id, notification_type, recipient, payload)
     VALUES ($1, $2, $3, $4)`,
    [bookingId, type, recipient, payload]
  );
}

export async function getSalonWhatsappNumber() {
  const settings = await pool.query('SELECT contact_whatsapp FROM site_settings WHERE id = 1');
  return settings.rows[0]?.contact_whatsapp || process.env.WHATSAPP_SALON || '221770000000';
}

export async function buildSalonWhatsAppUrl(booking) {
  const lines = [
    'Bonjour Beauty Glow ✨',
    'Nouvelle demande de réservation :',
    `Nom : ${booking.customer_name}`,
    `Téléphone : ${booking.customer_phone}`,
    `Prestation : ${booking.service_name}`,
    `Date : ${booking.booking_date}`,
    `Heure : ${booking.booking_time}`,
    `Note : ${booking.notes || 'Aucune'}`,
  ];
  const phone = await getSalonWhatsappNumber();
  return `https://wa.me/${phone}?text=${encodeURIComponent(lines.join('\n'))}`;
}

export function buildClientConfirmationText(booking) {
  return [
    'Bonjour ✨',
    'Votre réservation chez Beauty Glow est confirmée.',
    `Prestation : ${booking.service_name}`,
    `Date : ${booking.booking_date}`,
    `Heure : ${booking.booking_time}`,
    'Merci pour votre confiance 💖',
  ].join('\n');
}

export function buildClientConfirmationWhatsAppUrl(booking) {
  const message = buildClientConfirmationText(booking);
  const phone = (booking.customer_phone || '').replace(/\D/g, '');
  return phone ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}` : null;
}
