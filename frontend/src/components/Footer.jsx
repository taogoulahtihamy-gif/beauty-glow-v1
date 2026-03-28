import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">

        {/* Colonne 1 */}
        <div className="footer-col">
          <h3>Beauty Glow</h3>
          <p>
            Un salon beauté premium pensé pour une expérience simple,
            élégante et rassurante sur mobile comme sur ordinateur.
          </p>
        </div>

        {/* Colonne 2 */}
        <div className="footer-col">
          <h4>Navigation</h4>
          <Link to="/prestations">Prestations</Link>
          <Link to="/galerie">Galerie</Link>
          <Link to="/reservation">Réservation</Link>
        </div>

        {/* Colonne 3 */}
        <div className="footer-col">
          <h4>Contact</h4>
          <p>📞 +221 77 000 00 00</p>
          <p>📧 contact@beautyglow.sn</p>
          <p>📍 Dakar</p>
        </div>

        {/* Colonne 4 */}
        <div className="footer-col">
          <h4>Suivez-nous</h4>
          <div className="footer-socials">
            <a href="#">WhatsApp</a>
            <a href="#">Facebook</a>
            <a href="#">TikTok</a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Beauty Glow — Tous droits réservés
      </div>
    </footer>
  );
}