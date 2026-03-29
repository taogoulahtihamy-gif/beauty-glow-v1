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
  try {
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
      return res.status(400).json({
        message: 'Tous les champs requis ne sont pas remplis.',
      });
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

    try {
      await logNotification({
        bookingId: booking.id,
        type: 'reservation_created',
        recipient: 'salon',
        payload: JSON.stringify({ whatsappSalonUrl }),
      });
    } catch (error) {
      console.error('Erreur log réservation créée :', error);
    }

    try {
      await sendSalonBookingNotification(booking);

      await pool.query(
        'UPDATE bookings SET whatsapp_notified = TRUE, updated_at = NOW() WHERE id = $1',
        [booking.id]
      );
    } catch (error) {
      console.error('Erreur notification salon :', error);
    }

    res.status(201).json({ booking, whatsappSalonUrl });
  } catch (error) {
    console.error('Erreur création réservation :', error);
    res.status(500).json({
      message: "Impossible d'enregistrer la réservation.",
      error: error.message,
    });
  }
});

router.get('/', requireAdmin, async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bookings ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur récupération réservations :', error);
    res.status(500).json({
      message: 'Impossible de charger les réservations.',
      error: error.message,
    });
  }
});

router.patch('/:id/status', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['en_attente', 'confirmee', 'annulee'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Statut invalide.' });
    }

    const result = await pool.query(
      `UPDATE bookings
       SET status = $1::varchar,
           updated_at = NOW(),
           client_notified = CASE
             WHEN $1::varchar = 'confirmee' THEN TRUE
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
    let notificationWarning = null;

    if (status === 'confirmee') {
      clientMessage = buildClientConfirmationText(booking);
      clientWhatsAppUrl = buildClientConfirmationWhatsAppUrl(booking);

      try {
        await logNotification({
          bookingId: booking.id,
          type: 'booking_confirmed',
          recipient: booking.customer_phone,
          payload: clientMessage,
        });
      } catch (error) {
        console.error('Erreur log confirmation réservation :', error);
      }

      try {
        await sendClientConfirmationNotification(booking);
      } catch (error) {
        console.error('Erreur notification client confirmation :', error);
        notificationWarning =
          "Le statut a été mis à jour, mais la notification client n'a pas pu être envoyée.";
      }
    }

    if (status === 'annulee') {
      try {
        await logNotification({
          bookingId: booking.id,
          type: 'booking_cancelled',
          recipient: booking.customer_phone,
          payload: 'Réservation annulée',
        });
      } catch (error) {
        console.error('Erreur log annulation réservation :', error);
      }
    }

    res.json({
      booking,
      clientMessage,
      clientWhatsAppUrl,
      notificationWarning,
    });
  } catch (error) {
    console.error('Erreur PATCH statut réservation :', error);
    res.status(500).json({
      message: 'Impossible de mettre à jour le statut de la réservation.',
      error: error.message,
    });
  }
});

export default router;