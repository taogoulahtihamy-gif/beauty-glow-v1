import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  return (
    <AuthForm
      title="Créer un compte"
      subtitle="Enregistrez-vous pour gérer vos demandes plus facilement."
      submitLabel="Créer mon compte"
      footer={<p>Déjà inscrite ? <Link to="/connexion">Se connecter</Link></p>}
      fields={[
        { name: 'fullName', label: 'Nom complet', type: 'text', placeholder: 'Prénom Nom' },
        { name: 'phone', label: 'Téléphone', type: 'text', placeholder: '+221...' },
        { name: 'email', label: 'Email', type: 'email', placeholder: 'toi@email.com' },
        { name: 'password', label: 'Mot de passe', type: 'password', placeholder: '••••••••' },
      ]}
      onSubmit={async (values) => {
        await register(values);
        navigate('/');
      }}
    />
  );
}
