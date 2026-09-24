import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const { login } = useApp();
  const navigate = useNavigate();

  const handleLoginDemo = (role) => {
    if (role === 'admin') {
      login({ id: '1', name: 'Marcela Vargas', email: 'admin@sanjuan.cr', role: 'admin' });
      navigate('/admin');
    } else {
      login({ id: '2', name: 'Vecino San Juan', email: 'vecino@sanjuan.cr', role: 'user' });
      navigate('/');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '3rem auto', padding: '2rem', backgroundColor: 'var(--surface)', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center' }}>
      <h2 style={{ color: 'var(--primary)', marginBottom: '1rem' }}>Iniciar Sesión</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Selecciona un perfil de prueba para explorar la plataforma:
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <button 
          onClick={() => handleLoginDemo('admin')}
          style={{ padding: '0.6rem', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
        >
          Entrar como Administrador ADI
        </button>
        <button 
          onClick={() => handleLoginDemo('user')}
          style={{ padding: '0.6rem', backgroundColor: 'var(--surface)', color: 'var(--text-main)', border: '1px solid var(--border)', borderRadius: '4px' }}
        >
          Entrar como Vecino / Ciudadano
        </button>
      </div>
    </div>
  );
};