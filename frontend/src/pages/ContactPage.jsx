import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function ContactPage() {
  const [site, setSite] = useState(null);
  useEffect(() => { api.getSite().then(setSite).catch(console.error); }, []);

  return (
    <section className="section">
      <div className="container">
        <div className="section-head page-hero-head">
          <span className="eyebrow">Contact</span>
          <h1>Contact</h1>
          <p>Toutes les coordonnées utiles du salon, dans une page claire et mobile-friendly.</p>
        </div>

        <div className="contact-cards-grid">
          <article className="card contact-card">
            <h3>Téléphone</h3>
            <p>{site?.settings?.contact_phone}</p>
          </article>
          <article className="card contact-card">
            <h3>Email</h3>
            <p>{site?.settings?.contact_email}</p>
          </article>
          <article className="card contact-card">
            <h3>Adresse</h3>
            <p>Dakar, Sénégal</p>
          </article>
        </div>

        <div className="card contact-cta-card">
          <div>
            <h3>Horaires</h3>
            <p>Lundi - Samedi · 09h00 - 20h00</p>
          </div>
          <a
            className="btn btn-primary"
            href={`https://wa.me/${site?.settings?.contact_whatsapp || '221770000000'}`}
            target="_blank"
            rel="noreferrer"
          >
            Écrire sur WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
