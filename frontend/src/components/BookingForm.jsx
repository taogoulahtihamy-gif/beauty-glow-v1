import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function BookingForm({ services, compact = false }) {
  const [values, setValues] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    serviceName: '',
    bookingDate: '',
    bookingTime: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (services?.length && !values.serviceName) {
      setValues((prev) => ({ ...prev, serviceName: services[0].title }));
    }
  }, [services, values.serviceName]);

  const handleChange = (e) => setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const data = await api.createBooking(values);
      window.open(data.whatsappSalonUrl, '_blank');
      setMessage('Votre demande a bien été prise en compte. Nous vous contacterons rapidement pour confirmer votre rendez-vous                            ');
      setValues({

        customerName: '',
        customerEmail: '',
        customerPhone: '',
        serviceName: services?.[0]?.title || '',
        bookingDate: '',
        bookingTime: '',
        notes: '',
      });
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={`card booking-card ${compact ? 'compact-booking' : ''}`} onSubmit={handleSubmit}>
      <div className="form-grid two-col booking-grid">
        <label className="field"><span>Nom</span><input name="customerName" value={values.customerName} onChange={handleChange} required /></label>
        <label className="field"><span>Email</span><input type="email" name="customerEmail" value={values.customerEmail} onChange={handleChange} /></label>
        <label className="field"><span>Téléphone</span><input name="customerPhone" value={values.customerPhone} onChange={handleChange} required /></label>
        <label className="field"><span>Prestation</span>
          <select name="serviceName" value={values.serviceName} onChange={handleChange} required>
            {services?.map((service) => <option key={service.id} value={service.title}>{service.title}</option>)}
          </select>
        </label>
        <label className="field"><span>Date</span><input type="date" name="bookingDate" value={values.bookingDate} onChange={handleChange} required /></label>
        <label className="field"><span>Heure</span><input type="time" name="bookingTime" value={values.bookingTime} onChange={handleChange} required /></label>
        <label className="field full-width"><span>Message</span><textarea name="notes" value={values.notes} onChange={handleChange} rows="5" /></label>
      </div>
      {message && <p className="info-text">{message}</p>}
      <div className="form-submit-space">
        <button className="btn btn-primary full-mobile" disabled={loading}>{loading ? 'Envoi...' : 'Continuer sur WhatsApp pour réserver'}</button>
      </div>
    </form>
  );
}
