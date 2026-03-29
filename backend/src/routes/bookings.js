import express from 'express';
import { pool } from '../config/db.js';
import { requireAdmin } from '../middleware/auth.js';
import {
  buildClientConfirmationText,
  buildClientConfirmationWhatsAppUrl,
  buildSalonWhatsAppUrl,
  logNotification,
  sendSalonBookingNotification,
  sendClientConfirmationNotification,
} from '../utils/whatsapp.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const {
    customerName,
    customerEmail,
    customerPhone,
    serviceName,
    bookingDate,
    bookingTime,
    notes,
  } = req.body;

  if (!customerName || !customerPhone || !serviceName || !bookingDate || !bookingTime) {
    return res.status(400).json({ message: 'Tous les champs requis ne sont pas remplis.' });
  }

  const result = await pool.query(
    `INSERT INTO bookings (
      customer_name, customer_email, customer_phone, service_name, booking_date, booking_time, notes
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [
      customerName,
      customerEmail || '',
      customerPhone,
      serviceName,
      bookingDate,
      bookingTime,
      notes || '',
    ]
  );

  const booking = result.rows[0];
  const whatsappSalonUrl = await buildSalonWhatsAppUrl(booking);

  await logNotification({
    bookingId: booking.id,
    type: 'reservation_created',
    recipient: 'salon',
    payload: JSON.stringify({ whatsappSalonUrl }),
  });

  // Envoi WhatsApp réel au salon via Twilio
  await sendSalonBookingNotification(booking);

  await pool.query(
    'UPDATE bookings SET whatsapp_notified = TRUE, updated_at = NOW() WHERE id = $1',
    [booking.id]
  );

  res.status(201).json({ booking, whatsappSalonUrl });
});

router.get('/', requireAdmin, async (_req, res) => {
  const result = await pool.query('SELECT * FROM bookings ORDER BY created_at DESC');
  res.json(result.rows);
});

router.patch('/:id/status', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const result = await pool.query(
    `UPDATE bookings
     SET status = $1,
         updated_at = NOW(),
         client_notified = CASE
           WHEN $1 = 'confirmee' THEN TRUE
           ELSE client_notified
         END
     WHERE id = $2
     RETURNING *`,
    [status, id]
  );

  if (result.rowCount === 0) {
    return res.status(404).json({ message: 'Réservation introuvable.' });
  }

  const booking = result.rows[0];
  let clientMessage = null;
  let clientWhatsAppUrl = null;

  if (status === 'confirmee') {
    clientMessage = buildClientConfirmationText(booking);
    clientWhatsAppUrl = buildClientConfirmationWhatsAppUrl(booking);

    await logNotification({
      bookingId: booking.id,
      type: 'booking_confirmed',
      recipient: booking.customer_phone,
      payload: clientMessage,
    });

    // Envoi WhatsApp réel à la cliente via Twilio
    await sendClientConfirmationNotification(booking);
  }

  res.json({ booking, clientMessage, clientWhatsAppUrl });
});

export default router;