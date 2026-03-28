import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h3>Beauty Glow</h3>
          <p>Un salon beauté premium pensé pour une expérience simple, élégante et rassurante sur mobile comme sur ordinateur.</p>
        </div>
        <div>
          <h4>Navigation</h4>
          <p><Link to="/prestations">Prestations</Link></p>
          <p><Link to="/galerie">Galerie</Link></p>
          <p><Link to="/reservation">Réservation</Link></p>
        </div>
        <div>
          <h4>Accès rapide</h4>
          <p><Link to="/contact">Contact</Link></p>
          <p><Link to="/admin/login">Admin</Link></p>
          <p><Link to="/connexion">Connexion client</Link></p>
        </div>
      </div>
    </footer>
  );
}
