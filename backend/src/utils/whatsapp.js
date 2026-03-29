import { pool } from '../config/db.js';

function normalizePhone(phone) {
  if (!phone) return null;

  let cleaned = String(phone)
    .trim()
    .replace(/\s+/g, '')
    .replace(/[^\d]/g, '');

  if (cleaned.startsWith('00')) {
    cleaned = cleaned.slice(2);
  }

  if (cleaned.startsWith('221')) {
    return cleaned;
  }

  if (cleaned.startsWith('0')) {
    return `221${cleaned.slice(1)}`;
  }

  return `221${cleaned}`;
}

export async function logNotification({ bookingId, type, recipient, payload }) {
  await pool.query(
    `INSERT INTO notifications (booking_id, notification_type, recipient, payload)
     VALUES ($1, $2, $3, $4)`,
    [bookingId, type, recipient, payload]
  );
}

export async function getSalonWhatsappNumber() {
  const settings = await pool.query(
    'SELECT contact_whatsapp FROM site_settings WHERE id = 1'
  );

  return (
    normalizePhone(settings.rows[0]?.contact_whatsapp) ||
    normalizePhone(process.env.WHATSAPP_SALON) ||
    '221778492779'
  );
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
  const phone = normalizePhone(booking.customer_phone || '');

  return phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    : null;
}

export async function sendWhatsAppMessage({ to, body }) {
  const instanceId = process.env.ULTRAMSG_INSTANCE_ID;
  const token = process.env.ULTRAMSG_TOKEN;

  if (!instanceId || !token) {
    console.warn('UltraMsg non configuré.');
    return null;
  }

  const normalizedTo = normalizePhone(to);

  if (!normalizedTo) {
    console.warn('Numéro WhatsApp invalide :', to);
    return null;
  }

  try {
    console.log('Envoi UltraMsg vers :', normalizedTo);
    console.log('Instance UltraMsg :', instanceId);

    const response = await fetch(
      `https://api.ultramsg.com/${instanceId}/messages/chat`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          token,
          to: normalizedTo,
          body,
        }),
      }
    );

    const data = await response.json();

    console.log('UltraMsg response:', data);

    return data;
  } catch (error) {
    console.error('Erreur UltraMsg :', error.message);
    return null;
  }
}

export async function sendSalonBookingNotification(booking) {
  const salonPhone = await getSalonWhatsappNumber();

  const body = [
    'Bonjour Beauty Glow ✨',
    'Nouvelle demande de réservation :',
    `Nom : ${booking.customer_name}`,
    `Téléphone : ${booking.customer_phone}`,
    `Prestation : ${booking.service_name}`,
    `Date : ${booking.booking_date}`,
    `Heure : ${booking.booking_time}`,
    `Note : ${booking.notes || 'Aucune'}`,
  ].join('\n');

  const result = await sendWhatsAppMessage({
    to: salonPhone,
    body,
  });

  await logNotification({
    bookingId: booking.id,
    type: 'salon_whatsapp',
    recipient: salonPhone,
    payload: JSON.stringify({
      body,
      sent: !!result,
      result,
    }),
  });

  return result;
}

export async function sendClientConfirmationNotification(booking) {
  const body = buildClientConfirmationText(booking);

  const result = await sendWhatsAppMessage({
    to: booking.customer_phone,
    body,
  });

  await logNotification({
    bookingId: booking.id,
    type: 'client_confirmation_whatsapp',
    recipient: booking.customer_phone,
    payload: JSON.stringify({
      body,
      sent: !!result,
      result,
    }),
  });

  return result;
}