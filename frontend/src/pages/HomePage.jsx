import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ServiceCard from '../components/ServiceCard';
import { api } from '../services/api';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Aminata',
    service: 'Knotless braids',
    text: "J’ai adoré le résultat. Le salon est propre, l’accueil est doux et la coiffure a tenu super longtemps.",
  },
  {
    id: 2,
    name: 'Marième',
    service: 'Maquillage soirée',
    text: "Le make-up était lumineux, chic et exactement comme je voulais. J’ai reçu beaucoup de compliments.",
  },
  {
    id: 3,
    name: 'Fatou',
    service: 'Manucure & pédicure',
    text: "Très bon service, rapide et soigné. On sent tout de suite le côté professionnel et premium.",
  },
];

export default function HomePage() {
  const [site, setSite] = useState(null);

  useEffect(() => {
    api.getSite().then(setSite).catch(console.error);
  }, []);

  return (
    <>
      <Hero settings={site?.settings} />

      <section className="section home-services-section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Prestations</span>
            <h2>Les plus demandés</h2>
            <p>
              Découvrez nos prestations les plus demandées et choisissez la formule
              qui vous convient le mieux.
            </p>
          </div>

          <div className="service-grid">
            {site?.services?.slice(0, 3).map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          <div className="center-actions">
            <Link className="btn btn-light" to="/prestations">
              Voir toutes les prestations
            </Link>
          </div>
        </div>
      </section>

      <section className="section muted-bg testimonials-home-section">
        <div className="container">
          <div className="section-head testimonials-home-head">
            <span className="eyebrow">Avis clientes</span>
            <h2>Elles ont testé, elles ont validé</h2>
            <p>
              Des témoignages simples, crédibles et rassurants pour convertir davantage
              de réservations.
            </p>
          </div>

          <div className="testimonials-grid">
            {TESTIMONIALS.map((item) => (
              <article key={item.id} className="card testimonial-card">
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-text">“{item.text}”</p>
                <div className="testimonial-user">
                  <strong>{item.name}</strong>
                  <span>{item.service}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section home-gallery-section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Galerie</span>
            <h2>Quelques réalisations récentes</h2>
            <p>Un aperçu de notre style, de nos finitions et de notre univers.</p>
          </div>

          <div className="public-gallery-grid">
            {site?.gallery?.slice(0, 6).map((image) => (
              <article key={image.id} className="card public-gallery-card">
                <div className="public-gallery-image-wrap">
                  <img
                    src={image.image_url}
                    alt={image.alt_text || image.category || 'Galerie'}
                  />
                </div>

                <div className="public-gallery-body">
                  <span className="public-gallery-badge">
                    {image.category || 'Galerie'}
                  </span>
                  {image.alt_text ? (
                    <p className="public-gallery-caption">{image.alt_text}</p>
                  ) : null}
                </div>
              </article>
            ))}
          </div>

          <div className="center-actions">
            <Link className="btn btn-primary" to="/galerie">
              Voir toute la galerie
            </Link>
          </div>
        </div>
      </section>

      <section className="section muted-bg about-bottom-section">
        <div className="container home-about-split">
          <div className="home-about-image-column">
            <div className="card home-about-image-card">
              <img
                src={site?.settings?.about_image}
                alt="À propos Beauty Glow"
              />

              <div className="hero-floating-stats hero-floating-stats-home">
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

          <div className="home-about-content">
            <span className="eyebrow">Pourquoi nous choisir</span>
            <h2>À propos</h2>
            <p>
              {site?.settings?.about_text ||
                'Beauty Glow vous accueille dans une ambiance chic et douce.'}
            </p>

            <div className="home-about-features">
              <div className="card home-feature-card">
                <strong>Hygiène</strong>
                <span>Matériel soigné</span>
              </div>

              <div className="card home-feature-card">
                <strong>Rapidité</strong>
                <span>Réservation simple</span>
              </div>

              <div className="card home-feature-card">
                <strong>Style</strong>
                <span>Rendu premium</span>
              </div>
            </div>

            <div className="home-about-actions">
              <Link className="btn btn-primary" to="/a-propos">
                En savoir plus
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}