import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

export default function BookingForm() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    description: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      await addDoc(collection(db, 'bookings'), {
        userId: user.email,
        date: formData.date,
        time: formData.time,
        description: formData.description,
        createdAt: new Date()
      });
      setMessage('Rezerwacja zapisana!');
      setFormData({ date: '', time: '', description: '' });
    } catch (err) {
      setMessage('Błąd zapisu rezerwacji.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Nowa rezerwacja</h2>
      <input type="date" name="date" value={formData.date} onChange={handleChange} required />
      <input type="time" name="time" value={formData.time} onChange={handleChange} required />
      <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Opis" />
      <button type="submit">Zarezerwuj</button>
      {message && <p>{message}</p>}
    </form>
  );
}
