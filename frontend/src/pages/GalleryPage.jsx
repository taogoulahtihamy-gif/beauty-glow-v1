import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';

export default function GalleryPage() {
  const [site, setSite] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryFromUrl = searchParams.get('categorie') || 'Toutes';
  const [filter, setFilter] = useState(categoryFromUrl);

  useEffect(() => {
    api.getSite().then(setSite).catch(console.error);
  }, []);

  useEffect(() => {
    setFilter(categoryFromUrl);
  }, [categoryFromUrl]);

  const categories = useMemo(() => {
    const rawCategories = (site?.gallery || [])
      .map((item) => item.category)
      .filter(Boolean);

    return ['Toutes', ...new Set(rawCategories)];
  }, [site]);

  const gallery = useMemo(() => {
    if (filter === 'Toutes') return site?.gallery || [];
    return (site?.gallery || []).filter((item) => item.category === filter);
  }, [site, filter]);

  const handleFilterChange = (category) => {
    setFilter(category);

    if (category === 'Toutes') {
      setSearchParams({});
    } else {
      setSearchParams({ categorie: category });
    }
  };

  return (
    <section className="section gallery-page-section">
      <div className="container">
        <div className="section-head gallery-page-head">
          <span className="eyebrow">Galerie</span>
          <h1>Nos réalisations</h1>
          <p>
            Un aperçu clair de notre style, de nos finitions et de l’ambiance du salon.
          </p>
        </div>

        <div className="filter-row gallery-filter-row">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`filter-chip ${filter === category ? 'active' : ''}`}
              onClick={() => handleFilterChange(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="public-gallery-grid">
          {gallery.map((image) => (
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
      </div>
    </section>
  );
}