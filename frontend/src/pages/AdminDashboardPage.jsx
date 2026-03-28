import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const EMPTY_FORM = {
  heroBadge: '',
  heroTitle: '',
  heroSubtitle: '',
  heroPrimaryCta: '',
  heroSecondaryCta: '',
  aboutTitle: '',
  aboutText: '',
  contactPhone: '',
  contactEmail: '',
  contactWhatsapp: '',
};

const CATEGORY_OPTIONS = [
  'Galerie',
  'Coiffure',
  'Tresses',
  'Manucure',
  'Maquillage',
  'Soins',
];

export default function AdminDashboardPage() {
  const { logout } = useAuth();

  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [content, setContent] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadData, setUploadData] = useState(null);
  const [message, setMessage] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [fileInputKey, setFileInputKey] = useState(0);

  const [activeTab, setActiveTab] = useState('reservations');
  const [statusFilter, setStatusFilter] = useState('toutes');

  const [formValues, setFormValues] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [galleryForm, setGalleryForm] = useState({
    altText: '',
    category: 'Galerie',
  });

  const load = async () => {
    const [dashboard, bookingList, contentData] = await Promise.all([
      api.getAdminDashboard(),
      api.getBookings(),
      api.getContent(),
    ]);

    setStats(dashboard);
    setBookings(bookingList);
    setContent(contentData);

    setFormValues({
      heroBadge: contentData?.settings?.hero_badge || '',
      heroTitle: contentData?.settings?.hero_title || '',
      heroSubtitle: contentData?.settings?.hero_subtitle || '',
      heroPrimaryCta: contentData?.settings?.hero_primary_cta || '',
      heroSecondaryCta: contentData?.settings?.hero_secondary_cta || '',
      aboutTitle: contentData?.settings?.about_title || '',
      aboutText: contentData?.settings?.about_text || '',
      contactPhone: contentData?.settings?.contact_phone || '',
      contactEmail: contentData?.settings?.contact_email || '',
      contactWhatsapp: contentData?.settings?.contact_whatsapp || '',
    });
  };

  useEffect(() => {
    load().catch(console.error);
  }, []);

  const filteredBookings = useMemo(() => {
    if (statusFilter === 'toutes') return bookings;
    return bookings.filter((booking) => booking.status === statusFilter);
  }, [bookings, statusFilter]);

  const reusableImages = useMemo(() => {
    const items = content?.gallery || [];
    return items.filter((item) => (item.image_url || '').includes('/uploads/'));
  }, [content]);

  const updateStatus = async (id, status) => {
    const data = await api.updateBookingStatus(id, status);

    if (data.clientMessage) {
      alert(`Message client prêt :\n\n${data.clientMessage}`);
      if (data.clientWhatsAppUrl) {
        window.open(data.clientWhatsAppUrl, '_blank');
      }
    }

    await load();
  };

  const handleUploadAndAdd = async () => {
    setUploadError('');
    setMessage('');

    if (!selectedFile) {
      setUploadError('Choisis une image avant de lancer l’upload.');
      return;
    }

    setUploading(true);

    try {
      const uploaded = await api.uploadImage(selectedFile);
      setUploadData(uploaded);

      const payload = {
        imageUrl: uploaded.url,
        altText: galleryForm.altText?.trim() || selectedFile.name || 'Photo Beauty Glow',
        category: galleryForm.category || 'Galerie',
      };

      const createdImage = await api.addGalleryImage(payload);

      setMessage(`Image ajoutée avec succès dans la catégorie "${payload.category}".`);

      setContent((prev) => {
        if (!prev) return prev;

        const gallery = Array.isArray(prev.gallery) ? prev.gallery : [];
        const imageToInsert =
          createdImage?.image ||
          createdImage?.data ||
          {
            id: Date.now(),
            image_url: payload.imageUrl,
            alt_text: payload.altText,
            category: payload.category,
          };

        return {
          ...prev,
          gallery: [imageToInsert, ...gallery],
        };
      });

      setStats((prev) =>
        prev
          ? {
              ...prev,
              gallery: (prev.gallery ?? 0) + 1,
            }
          : prev
      );

      setSelectedFile(null);
      setGalleryForm({
        altText: '',
        category: 'Galerie',
      });
      setFileInputKey((prev) => prev + 1);

      await load();
    } catch (error) {
      console.error(error);
      setUploadError(error.message || "L'image n'a pas pu être ajoutée.");
    } finally {
      setUploading(false);
    }
  };

  const saveContent = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await api.updateContent(formValues);
      setMessage("Contenu de l'accueil mis à jour.");
      await load();
    } finally {
      setSaving(false);
    }
  };

  const applyImage = async (type, image) => {
    const url = image.image_url || image.url;
    const category = image.category || 'Galerie';
    const altText = image.alt_text || 'Photo Beauty Glow';

    if (type === 'hero') {
      await api.updateContent({ heroImage: url });
      setMessage('Image hero mise à jour.');
    }

    if (type === 'about') {
      await api.updateContent({ aboutImage: url });
      setMessage('Image à propos mise à jour.');
    }

    if (type === 'gallery') {
      await api.addGalleryImage({
        imageUrl: url,
        altText,
        category,
      });
      setMessage(`Image ajoutée à la galerie dans "${category}".`);
    }

    await load();
  };

  const deleteImage = async (id) => {
    await api.deleteGalleryImage(id);
    setMessage('Image supprimée.');
    await load();
  };

  return (
    <section className="section">
      <div className="container admin-layout">
        <div className="admin-header-row">
          <div>
            <span className="eyebrow">Admin</span>
            <h1>Dashboard admin</h1>
            <p>Tu pilotes les réservations, les photos et le contenu sans aller dans le code.</p>
            {message ? <p className="info-text">{message}</p> : null}
            {uploadError ? <p className="error-text">{uploadError}</p> : null}
          </div>

          <button className="btn btn-light" type="button" onClick={logout}>
            Déconnexion
          </button>
        </div>

        <div className="stats-grid admin-stats-grid">
          <div className="card stat">
            <strong>{stats?.bookings ?? 0}</strong>
            <span>Réservations</span>
          </div>
          <div className="card stat">
            <strong>{stats?.services ?? 0}</strong>
            <span>Prestations</span>
          </div>
          <div className="card stat">
            <strong>{stats?.gallery ?? 0}</strong>
            <span>Photos</span>
          </div>
        </div>

        <div className="admin-actions admin-tab-row">
          <button
            className={`filter-chip ${activeTab === 'reservations' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTab('reservations')}
          >
            Réservations
          </button>

          <button
            className={`filter-chip ${activeTab === 'content' ? 'active' : ''}`}
            type="button"
            onClick={() => setActiveTab('content')}
          >
            Photos & contenu
          </button>
        </div>

        {activeTab === 'reservations' ? (
          <div className="card admin-panel">
            <div className="admin-actions filter-pills">
              {[
                ['toutes', 'Toutes'],
                ['en_attente', 'en attente'],
                ['confirmee', 'confirmée'],
                ['annulee', 'annulée'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  className={`filter-chip ${statusFilter === value ? 'active' : ''}`}
                  type="button"
                  onClick={() => setStatusFilter(value)}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Téléphone</th>
                    <th>Prestation</th>
                    <th>Date</th>
                    <th>Heure</th>
                    <th>Statut</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.customer_name}</td>
                      <td>{booking.customer_phone}</td>
                      <td>{booking.service_name}</td>
                      <td>{booking.booking_date}</td>
                      <td>{booking.booking_time}</td>
                      <td>
                        <span className={`status-pill ${booking.status}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td>
                        <div className="admin-actions compact-actions">
                          <button
                            className="btn btn-small btn-primary"
                            type="button"
                            onClick={() => updateStatus(booking.id, 'confirmee')}
                          >
                            Confirmer
                          </button>

                          <button
                            className="btn btn-small btn-light"
                            type="button"
                            onClick={() => updateStatus(booking.id, 'annulee')}
                          >
                            Annuler
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {!filteredBookings.length ? (
                    <tr>
                      <td colSpan="7" className="empty-cell">
                        Aucune réservation pour ce filtre.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="admin-sections">
            <div className="card admin-panel">
              <h2>Accueil modifiable</h2>

              <form onSubmit={saveContent} className="form-grid two-col booking-grid">
                <label className="field">
                  <span>Badge accueil</span>
                  <input
                    value={formValues.heroBadge}
                    onChange={(e) =>
                      setFormValues((prev) => ({ ...prev, heroBadge: e.target.value }))
                    }
                  />
                </label>

                <label className="field">
                  <span>Titre accueil</span>
                  <input
                    value={formValues.heroTitle}
                    onChange={(e) =>
                      setFormValues((prev) => ({ ...prev, heroTitle: e.target.value }))
                    }
                  />
                </label>

                <label className="field full-width">
                  <span>Sous-titre accueil</span>
                  <textarea
                    rows="4"
                    value={formValues.heroSubtitle}
                    onChange={(e) =>
                      setFormValues((prev) => ({
                        ...prev,
                        heroSubtitle: e.target.value,
                      }))
                    }
                  />
                </label>

                <label className="field">
                  <span>Bouton principal</span>
                  <input
                    value={formValues.heroPrimaryCta}
                    onChange={(e) =>
                      setFormValues((prev) => ({
                        ...prev,
                        heroPrimaryCta: e.target.value,
                      }))
                    }
                  />
                </label>

                <label className="field">
                  <span>Bouton secondaire</span>
                  <input
                    value={formValues.heroSecondaryCta}
                    onChange={(e) =>
                      setFormValues((prev) => ({
                        ...prev,
                        heroSecondaryCta: e.target.value,
                      }))
                    }
                  />
                </label>

                <label className="field">
                  <span>Titre à propos</span>
                  <input
                    value={formValues.aboutTitle}
                    onChange={(e) =>
                      setFormValues((prev) => ({ ...prev, aboutTitle: e.target.value }))
                    }
                  />
                </label>

                <label className="field">
                  <span>Téléphone</span>
                  <input
                    value={formValues.contactPhone}
                    onChange={(e) =>
                      setFormValues((prev) => ({
                        ...prev,
                        contactPhone: e.target.value,
                      }))
                    }
                  />
                </label>

                <label className="field">
                  <span>Email</span>
                  <input
                    value={formValues.contactEmail}
                    onChange={(e) =>
                      setFormValues((prev) => ({
                        ...prev,
                        contactEmail: e.target.value,
                      }))
                    }
                  />
                </label>

                <label className="field">
                  <span>WhatsApp salon</span>
                  <input
                    value={formValues.contactWhatsapp}
                    onChange={(e) =>
                      setFormValues((prev) => ({
                        ...prev,
                        contactWhatsapp: e.target.value,
                      }))
                    }
                  />
                </label>

                <label className="field full-width">
                  <span>Texte à propos</span>
                  <textarea
                    rows="5"
                    value={formValues.aboutText}
                    onChange={(e) =>
                      setFormValues((prev) => ({ ...prev, aboutText: e.target.value }))
                    }
                  />
                </label>

                <div className="full-width admin-save-row">
                  <button className="btn btn-primary" type="submit" disabled={saving}>
                    {saving ? 'Sauvegarde...' : 'Sauvegarder les changements'}
                  </button>
                </div>
              </form>
            </div>

            <div className="card admin-panel">
              <h2>Upload direct à la galerie</h2>

              <div className="form-grid two-col admin-upload-form">
                <label className="field full-width">
                  <span>Choisir une image</span>
                  <input
                    key={fileInputKey}
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  />
                </label>

                <label className="field">
                  <span>Titre / description image</span>
                  <input
                    value={galleryForm.altText}
                    onChange={(e) =>
                      setGalleryForm((prev) => ({ ...prev, altText: e.target.value }))
                    }
                    placeholder="Ex: Tresses knotless longues"
                  />
                </label>

                <label className="field">
                  <span>Catégorie</span>
                  <select
                    value={galleryForm.category}
                    onChange={(e) =>
                      setGalleryForm((prev) => ({ ...prev, category: e.target.value }))
                    }
                  >
                    {CATEGORY_OPTIONS.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="admin-actions admin-upload-row">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleUploadAndAdd}
                  disabled={uploading || !selectedFile}
                >
                  {uploading ? 'Upload...' : 'Uploader et ajouter'}
                </button>
              </div>

              {selectedFile ? (
                <p className="small-note">Fichier sélectionné : {selectedFile.name}</p>
              ) : null}

              {uploadData?.url ? (
                <p className="small-note">Dernière image uploadée avec succès.</p>
              ) : null}
            </div>

            <div className="card admin-panel">
              <h2>Images principales du site</h2>

              <div className="preview-grid admin-preview-grid">
                <article className="card admin-media-card">
                  <div className="admin-media-image">
                    <img
                      className="preview-image"
                      src={content?.settings?.hero_image}
                      alt="Hero"
                    />
                  </div>
                  <div className="admin-media-body">
                    <strong>Image hero</strong>
                    <p>Image principale de la page d’accueil.</p>
                  </div>
                </article>

                <article className="card admin-media-card">
                  <div className="admin-media-image">
                    <img
                      className="preview-image"
                      src={content?.settings?.about_image}
                      alt="À propos"
                    />
                  </div>
                  <div className="admin-media-body">
                    <strong>Image à propos</strong>
                    <p>Image affichée dans la section à propos.</p>
                  </div>
                </article>
              </div>
            </div>

            <div className="card admin-panel">
              <div className="admin-library-head">
                <div>
                  <h2>Bibliothèque d’images uploadées</h2>
                  <p>
                    Réutilise une image déjà uploadée pour le hero, la section à propos ou la galerie.
                  </p>
                </div>

                <button
                  className="btn btn-light btn-small"
                  type="button"
                  onClick={() => load().catch(console.error)}
                >
                  Rafraîchir
                </button>
              </div>

              {reusableImages.length ? (
                <div className="admin-gallery-grid">
                  {reusableImages.map((image) => (
                    <article key={image.id} className="card admin-gallery-card">
                      <div className="admin-media-image">
                        <img src={image.image_url} alt={image.alt_text} />
                      </div>

                      <div className="admin-media-body">
                        <strong>{image.alt_text || 'Photo Beauty Glow'}</strong>
                        <span className="admin-category-badge">
                          {image.category || 'Galerie'}
                        </span>
                      </div>

                      <div className="admin-card-actions">
                        <button
                          className="btn btn-small btn-light"
                          type="button"
                          onClick={() => applyImage('hero', image)}
                        >
                          Mettre en hero
                        </button>

                        <button
                          className="btn btn-small btn-light"
                          type="button"
                          onClick={() => applyImage('about', image)}
                        >
                          Mettre à propos
                        </button>

                        <button
                          className="btn btn-small btn-primary"
                          type="button"
                          onClick={() => applyImage('gallery', image)}
                        >
                          Dupliquer en galerie
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="library-empty">
                  Aucune image uploadée pour le moment.
                </div>
              )}
            </div>

            <div className="card admin-panel">
              <h2>Galerie actuelle</h2>

              <div className="admin-gallery-grid">
                {content?.gallery?.map((image) => (
                  <article key={image.id} className="card admin-gallery-card">
                    <div className="admin-media-image">
                      <img src={image.image_url} alt={image.alt_text} />
                    </div>

                    <div className="admin-media-body">
                      <strong>{image.alt_text || 'Photo Beauty Glow'}</strong>
                      <span className="admin-category-badge">
                        {image.category || 'Galerie'}
                      </span>
                    </div>

                    <div className="admin-card-actions">
                      <button
                        className="btn btn-small btn-light"
                        type="button"
                        onClick={() => applyImage('hero', image)}
                      >
                        Hero
                      </button>

                      <button
                        className="btn btn-small btn-light"
                        type="button"
                        onClick={() => applyImage('about', image)}
                      >
                        À propos
                      </button>

                      <button
                        className="btn btn-small btn-primary"
                        type="button"
                        onClick={() => deleteImage(image.id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}