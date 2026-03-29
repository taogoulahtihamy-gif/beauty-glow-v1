import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MonComptePage() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/connexion" replace />;
  }

  return (
    <section className="section">
      <div className="container">
        <div className="page-heading">
          <span className="eyebrow">Mon espace</span>
          <h1>Mon compte</h1>
          <p>
            Retrouve ici tes informations personnelles enregistrées.
          </p>
        </div>

        <div className="card client-account-card">
          <div className="client-account-row">
            <strong>Nom</strong>
            <span>{user.name || user.nom || '-'}</span>
          </div>

          <div className="client-account-row">
            <strong>Email</strong>
            <span>{user.email || '-'}</span>
          </div>

          <div className="client-account-row">
            <strong>Téléphone</strong>
            <span>{user.phone || user.telephone || user.customer_phone || '-'}</span>
          </div>

          <div className="client-account-note">
            Tu pourras bientôt modifier tes informations directement depuis cet espace.
          </div>
        </div>
      </div>
    </section>
  );
}