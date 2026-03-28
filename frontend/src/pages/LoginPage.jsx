import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  return (
    <AuthForm
      title="Connexion"
      subtitle="Retrouvez vos réservations et accédez à votre espace client."
      submitLabel="Me connecter"
      footer={<p>Pas encore de compte ? <Link to="/inscription">Créer un utilisateur</Link></p>}
      fields={[
        { name: 'email', label: 'Email', type: 'email', placeholder: 'toi@email.com' },
        { name: 'password', label: 'Mot de passe', type: 'password', placeholder: '••••••••' },
      ]}
      onSubmit={async (values) => {
        await login(values);
        navigate('/');
      }}
    />
  );
}
