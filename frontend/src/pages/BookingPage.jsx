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
          <p>Nous vous recontacterons.</p>
        </div>
        <BookingForm services={site?.services || []} />
      </div>
    </section>
  );
}
