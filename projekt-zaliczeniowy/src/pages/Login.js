import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      login({
        email: user.email,
        displayName: user.displayName,
        role: user.email === 'admin@example.com' ? 'admin' : 'user'
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Nieprawidłowe dane logowania.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Logowanie</h2>
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Hasło" onChange={(e) => setPassword(e.target.value)} />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Zaloguj się</button>
    </form>
  );
}
