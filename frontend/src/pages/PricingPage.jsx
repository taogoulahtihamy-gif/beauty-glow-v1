import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

export default function PricingPage() {
  const [site, setSite] = useState(null);

  useEffect(() => {
    api.getSite().then(setSite).catch(console.error);
  }, []);

  return (
    <section className="section pricing-page-section">
      <div className="container">
        <div className="section-head pricing-page-head">
          <span className="eyebrow">Tarifs</span>
          <h1>Nos prix</h1>
          <p>
            Des prix lisibles, pensés pour rassurer la cliente avant même le premier message.
          </p>
        </div>

        <div className="pricing-grid">
          {site?.services?.map((service) => (
            <article key={service.id} className="card pricing-card">
              <div className="pricing-card-top">
                <div className="pricing-text">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>

                <div className="pricing-badge-wrap">
                  <span className="pricing-price">{service.price_label}</span>
                </div>
              </div>

              <div className="pricing-card-bottom">
                <span className="pricing-duration">{service.duration_label}</span>
              </div>
            </article>
          ))}
        </div>

        <div className="center-actions pricing-cta-row">
          <Link className="btn btn-primary" to="/reservation">
            Réserver maintenant
          </Link>
        </div>
      </div>
    </section>
  );
}