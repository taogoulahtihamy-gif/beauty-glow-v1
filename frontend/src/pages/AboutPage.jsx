import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function AboutPage() {
  const [site, setSite] = useState(null);
  useEffect(() => { api.getSite().then(setSite).catch(console.error); }, []);

  return (
    <section className="section muted-bg">
      <div className="container about-grid">
        <div>
          <span className="eyebrow">À propos</span>
          <h1>{site?.settings?.about_title}</h1>
          <p>{site?.settings?.about_text}</p>
          <p>Notre promesse : un accueil chaleureux, une mise en beauté soignée, et un parcours digital simple pour réserver sans stress.</p>
        </div>
        <div className="card image-card">
          <img src={site?.settings?.about_image} alt="À propos Beauty Glow" />
        </div>
      </div>
    </section>
  );
}
