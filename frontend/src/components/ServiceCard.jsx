import { Link } from 'react-router-dom';

function getGalleryCategory(service) {
  const title = (service.title || '').toLowerCase();
  const category = (service.category || '').toLowerCase();

  if (category.includes('coiffure')) return 'Coiffure';
  if (category.includes('maquillage')) return 'Maquillage';
  if (category.includes('manucure')) return 'Manucure';
  if (category.includes('ongle')) return 'Manucure';
  if (category.includes('tresse')) return 'Coiffure';

  if (title.includes('coiffure')) return 'Coiffure';
  if (title.includes('tresse')) return 'Coiffure';
  if (title.includes('maquillage')) return 'Maquillage';
  if (title.includes('manucure')) return 'Manucure';
  if (title.includes('pédicure')) return 'Manucure';
  if (title.includes('ongle')) return 'Manucure';

  return 'Galerie';
}

export default function ServiceCard({ service }) {
  const galleryCategory = getGalleryCategory(service);

  return (
    <Link
      to={`/galerie?categorie=${encodeURIComponent(galleryCategory)}`}
      className="service-card-link"
    >
      <article className="card service-card service-card-clickable">
        <div className="service-card-image-wrap">
          <img src={service.image_url} alt={service.title} />
        </div>

        <div className="service-card-body">
          <h3>{service.title}</h3>
          <p>{service.description}</p>

          <div className="meta-row">
            <span>{service.price_label}</span>
            <span>{service.duration_label}</span>
          </div>

          <div className="service-card-footer">
            <span className="service-card-badge">
              Voir les photos {galleryCategory.toLowerCase()}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}