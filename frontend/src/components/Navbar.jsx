import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  const closeMenu = () => setOpen(false);

  useEffect(() => {
    document.body.style.overflow = open && window.innerWidth <= 960 ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const isClient = user && user.role !== 'admin';

  return (
    <header className="navbar-wrap">
      <div className="container navbar">
        <Link to="/" className="brand brand-enhanced" onClick={closeMenu}>
          <span className="brand-mark">
            <Sparkles size={16} />
          </span>
          <span>Beauty Glow</span>
        </Link>

        <button
          className={`menu-btn menu-btn-fancy ${open ? 'is-open' : ''}`}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
          type="button"
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          <NavLink to="/" onClick={closeMenu}>
            Accueil
          </NavLink>

          <NavLink to="/prestations" onClick={closeMenu}>
            Prestations
          </NavLink>

          <NavLink to="/tarifs" onClick={closeMenu}>
            Tarifs
          </NavLink>

          <NavLink to="/galerie" onClick={closeMenu}>
            Galerie
          </NavLink>

          <NavLink to="/reservation" onClick={closeMenu}>
            Réservation
          </NavLink>

          <NavLink to="/a-propos" onClick={closeMenu}>
            À propos
          </NavLink>

          <NavLink to="/contact" onClick={closeMenu}>
            Contact
          </NavLink>

          {!user && (
            <NavLink to="/connexion" onClick={closeMenu}>
              Connexion
            </NavLink>
          )}

          {!user && (
            <NavLink to="/inscription" onClick={closeMenu}>
              Créer un compte
            </NavLink>
          )}

          {isClient && (
            <NavLink to="/mes-reservations" onClick={closeMenu}>
              Mes réservations
            </NavLink>
          )}

          {isClient && (
            <NavLink to="/mon-compte" onClick={closeMenu}>
              Mon compte
            </NavLink>
          )}

          {user && (
            <button
              className="ghost-link"
              type="button"
              onClick={() => {
                logout();
                closeMenu();
              }}
            >
              Déconnexion
            </button>
          )}

          <NavLink
            to="/reservation"
            className="mobile-book-btn btn btn-primary"
            onClick={closeMenu}
          >
            Réserver
          </NavLink>
        </nav>

        <Link to="/reservation" className="btn btn-primary navbar-cta">
          Réserver
        </Link>
      </div>

      {open ? (
        <button
          className="nav-backdrop"
          onClick={closeMenu}
          aria-label="Fermer le menu"
          type="button"
        />
      ) : null}
    </header>
  );
}