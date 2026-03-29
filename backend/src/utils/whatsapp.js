import twilio from 'twilio';
import { pool } from '../config/db.js';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioFrom = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';

const client =
  accountSid && authToken ? twilio(accountSid, authToken) : null;

function normalizePhone(phone) {
  if (!phone) return null;

  let cleaned = String(phone)
    .trim()
    .replace(/\s+/g, '')
    .replace(/[^\d+]/g, '');

  if (cleaned.startsWith('00')) {
    cleaned = `+${cleaned.slice(2)}`;
  }

  if (!cleaned.startsWith('+')) {
    if (cleaned.startsWith('221')) {
      cleaned = `+${cleaned}`;
    } else if (cleaned.startsWith('0')) {
      cleaned = `+221${cleaned.slice(1)}`;
    } else {
      cleaned = `+221${cleaned}`;
    }
  }

  return cleaned;
}

function formatWhatsAppAddress(phone) {
  const normalized = normalizePhone(phone);
  return normalized ? `whatsapp:${normalized}` : null;
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
    settings.rows[0]?.contact_whatsapp ||
    process.env.WHATSAPP_SALON ||
    '+221778492779'
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
  const sanitizedPhone = String(phone).replace(/\D/g, '');

  return `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(
    lines.join('\n')
  )}`;
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
  const phone = String(booking.customer_phone || '').replace(/\D/g, '');

  return phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    : null;
}

export async function sendWhatsAppMessage({ to, body }) {
  if (!client) {
    console.warn('Twilio non configuré.');
    return null;
  }

  const formattedTo = formatWhatsAppAddress(to);

  if (!formattedTo) {
    console.warn('Numéro WhatsApp invalide :', to);
    return null;
  }

  try {
    const message = await client.messages.create({
      from: twilioFrom,
      to: formattedTo,
      body,
    });

    return message;
  } catch (error) {
    console.error('Erreur Twilio WhatsApp :', error.message);
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
      sid: result?.sid || null,
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
      sid: result?.sid || null,
    }),
  });

  return result;
}