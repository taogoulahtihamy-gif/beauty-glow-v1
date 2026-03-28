import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  return (
    <AuthForm
      title="Connexion admin"
      subtitle="Gérez les réservations, le contenu de l'accueil et les images du site."
      submitLabel="Entrer dans l’admin"
      fields={[
        { name: 'email', label: 'Email admin', type: 'email', placeholder: 'admin@beautyglow.sn' },
        { name: 'password', label: 'Mot de passe', type: 'password', placeholder: '••••••••' },
      ]}
      onSubmit={async (values) => {
        const user = await login(values);
        if (user.role !== 'admin') throw new Error('Ce compte n’est pas administrateur.');
        navigate('/admin');
      }}
    />
  );
}
