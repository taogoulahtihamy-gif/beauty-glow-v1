import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import { FaWhatsapp, FaFacebookF, FaTiktok } from 'react-icons/fa6';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid footer-grid-compact">
        <div className="footer-col footer-brand-col">
          <h3>Beauty Glow</h3>
          <p>
            Un salon beauté premium pensé pour une expérience simple, élégante
            et rassurante sur mobile comme sur ordinateur.
          </p>
        </div>

        <div className="footer-col">
          <h4>Navigation</h4>
          <div className="footer-links-list">
            <Link to="/prestations" className="footer-link">Prestations</Link>
            <Link to="/galerie" className="footer-link">Galerie</Link>
            <Link to="/reservation" className="footer-link">Réservation</Link>
          </div>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <div className="footer-contact-list">
            <a href="tel:+221770000000" className="footer-contact-item">
              <Phone size={16} />
              <span>+221 77 000 00 00</span>
            </a>

            <a href="mailto:contact@beautyglow.sn" className="footer-contact-item">
              <Mail size={16} />
              <span>contact@beautyglow.sn</span>
            </a>

            <div className="footer-contact-item">
              <MapPin size={16} />
              <span>Dakar</span>
            </div>
          </div>
        </div>

        <div className="footer-col">
          <h4>Suivez-nous</h4>
          <div className="footer-socials-inline">
            <a
              href="https://wa.me/221770000000"
              target="_blank"
              rel="noreferrer"
              className="footer-social-link"
            >
              <FaWhatsapp size={16} />
              <span>WhatsApp</span>
            </a>

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="footer-social-link"
            >
              <FaFacebookF size={16} />
              <span>Facebook</span>
            </a>

            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noreferrer"
              className="footer-social-link"
            >
              <FaTiktok size={16} />
              <span>TikTok</span>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Beauty Glow — Tous droits réservés
      </div>
    </footer>
  );
}