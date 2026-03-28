import { Link } from 'react-router-dom';

function Star({ className }) {
  return <span className={`hero-star ${className || ''}`}>✦</span>;
}

export default function Hero({ settings }) {
  return (
    <section className="hero section">
      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="stars-wrap">
            <Star className="star-1" />
            <Star className="star-2" />
            <Star className="star-3" />
          </div>

          <span className="eyebrow">
            {settings?.hero_badge || 'Salon beauté premium'}
          </span>

          <h1>{settings?.hero_title || 'Une expérience beauté élégante, douce et mémorable.'}</h1>

          <p>
            {settings?.hero_subtitle ||
              'Coiffure, tresses, maquillage, ongles et soins dans une ambiance chic, pensée pour rassurer et faire réserver vite.'}
          </p>

          <div className="hero-actions">
            <Link className="btn btn-primary" to="/reservation">
              {settings?.hero_primary_cta || 'Réserver maintenant'}
            </Link>

            <Link className="btn btn-light" to="/prestations">
              {settings?.hero_secondary_cta || 'Découvrir nos prestations'}
            </Link>
          </div>
        </div>

        <div className="hero-image-wrap card hero-image-card">
          <img
            src={settings?.hero_image}
            alt="Beauty Glow hero"
            className="hero-image"
          />

          <div className="hero-floating-stats">
            <div className="hero-stat-card">
              <strong>+500</strong>
              <span>clientes satisfaites</span>
            </div>

            <div className="hero-stat-card">
              <strong>4.9/5</strong>
              <span>avis clients</span>
            </div>

            <div className="hero-stat-card">
              <strong>6j/7</strong>
              <span>ouvert sur rendez-vous</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}