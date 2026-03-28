import { useEffect, useState } from 'react';
import ServiceCard from '../components/ServiceCard';
import { api } from '../services/api';

export default function ServicesPage() {
  const [site, setSite] = useState(null);
  useEffect(() => { api.getSite().then(setSite).catch(console.error); }, []);

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Prestations</span>
          <h1>Nos prestations</h1>
          <p>Coiffure, maquillage, ongles et soins avec une expérience chic, rassurante et facile à réserver.</p>
        </div>
        <div className="service-grid">
          {site?.services?.map((service) => <ServiceCard key={service.id} service={service} />)}
        </div>
      </div>
    </section>
  );
}
