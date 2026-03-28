import { useEffect, useState } from 'react';
import BookingForm from '../components/BookingForm';
import { api } from '../services/api';

export default function BookingPage() {
  const [site, setSite] = useState(null);
  useEffect(() => { api.getSite().then(setSite).catch(console.error); }, []);

  return (
    <section className="section">
      <div className="container booking-page-grid">
        <div>
          <span className="eyebrow">Réservation</span>
          <h1>Réservez votre créneau</h1>
          <p>Le salon reçoit la réservation immédiatement. Ensuite, WhatsApp s’ouvre avec un message prêt à envoyer au salon.</p>
          <div className="booking-side-note card compact-note">
            <strong>Ce qui se passe ensuite</strong>
            <p>Quand l’admin confirme la réservation dans son interface, un message de confirmation client est généré automatiquement côté backend.</p>
          </div>
        </div>
        <BookingForm services={site?.services || []} />
      </div>
    </section>
  );
}
