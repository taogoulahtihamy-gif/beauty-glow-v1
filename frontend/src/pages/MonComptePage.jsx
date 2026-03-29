import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MonComptePage() {
  const { user, refreshUser, updateProfile } = useAuth();

  const [formValues, setFormValues] = useState({
    fullName: '',
    email: '',
    phone: '',
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormValues({
        fullName: user.full_name || user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      refreshUser().catch(console.error);
    }
  }, []);

  if (!user) {
    return <Navigate to="/connexion" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      await updateProfile(formValues);
      setMessage('Vos informations ont bien été mises à jour.');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Impossible de mettre à jour votre profil.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <div className="page-heading">
          <span className="eyebrow">Mon espace</span>
          <h1>Mon compte</h1>
          <p>Modifie ici tes informations personnelles.</p>
        </div>

        <div className="card client-account-card">
          <form onSubmit={handleSubmit} className="form-grid one-col">
            <label className="field">
              <span>Nom complet</span>
              <input
                value={formValues.fullName}
                onChange={(e) =>
                  setFormValues((prev) => ({ ...prev, fullName: e.target.value }))
                }
              />
            </label>

            <label className="field">
              <span>Email</span>
              <input
                type="email"
                value={formValues.email}
                onChange={(e) =>
                  setFormValues((prev) => ({ ...prev, email: e.target.value }))
                }
              />
            </label>

            <label className="field">
              <span>Téléphone</span>
              <input
                value={formValues.phone}
                onChange={(e) =>
                  setFormValues((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            </label>

            {message ? <p className="info-text">{message}</p> : null}
            {error ? <p className="error-text">{error}</p> : null}

            <div className="form-submit-space">
              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? 'Enregistrement...' : 'Enregistrer mes informations'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}