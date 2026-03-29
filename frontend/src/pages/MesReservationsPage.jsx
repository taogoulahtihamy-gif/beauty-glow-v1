import { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function formatBookingDate(value) {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('fr-FR');
}

function formatStatusLabel(status) {
  switch (status) {
    case 'en_attente':
      return 'En attente';
    case 'confirmee':
      return 'Confirmée';
    case 'annulee':
      return 'Annulée';
    default:
      return status || '-';
  }
}

export default function MesReservationsPage() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/connexion" replace />;
  }

  const reservations = useMemo(() => {
    return Array.isArray(user?.bookings) ? user.bookings : [];
  }, [user]);

  return (
    <section className="section">
      <div className="container">
        <div className="page-heading">
          <span className="eyebrow">Mon espace</span>
          <h1>Mes réservations</h1>
          <p>
            Retrouve ici tes demandes de rendez-vous et leur statut.
          </p>
        </div>

        {reservations.length ? (
          <div className="client-bookings-grid">
            {reservations.map((booking) => (
              <article key={booking.id} className="card client-booking-card">
                <div className="client-booking-row">
                  <strong>Prestation</strong>
                  <span>{booking.service_name || '-'}</span>
                </div>

                <div className="client-booking-row">
                  <strong>Date</strong>
                  <span>{formatBookingDate(booking.booking_date)}</span>
                </div>

                <div className="client-booking-row">
                  <strong>Heure</strong>
                  <span>{booking.booking_time || '-'}</span>
                </div>

                <div className="client-booking-row">
                  <strong>Statut</strong>
                  <span className={`status-pill ${booking.status}`}>
                    {formatStatusLabel(booking.status)}
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="card empty-client-state">
            <h2>Aucune réservation pour le moment</h2>
            <p>
              Tu n’as pas encore de réservation enregistrée sur ton compte.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}