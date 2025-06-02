import React, { useEffect, useState } from "react";
import { getFirestore, collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, Timestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const db = getFirestore();

  const [reservations, setReservations] = useState([]);
  const [filterStatus, setFilterStatus] = useState("active");
  const [filterDate, setFilterDate] = useState("");
  const [sortField, setSortField] = useState("date");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    participants: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
  if (!user) return;

  const baseQuery = collection(db, "reservations");

    let q;
    if (filterStatus === "all") {
    q = query(
        collection(db, "reservations"),
        where("userId", "==", user.uid),
        orderBy(sortField)
    );
    } else {
    q = query(
        collection(db, "reservations"),
        where("userId", "==", user.uid),
        where("status", "==", filterStatus),
        orderBy(sortField)
    );
    }

  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    let res = [];
    querySnapshot.forEach((doc) => {
      res.push({ id: doc.id, ...doc.data() });
    });
    setReservations(res);
  });

  return () => unsubscribe();
}, [user, db, filterStatus, sortField]);


  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.date || !formData.time) {
      alert("Proszę podać datę i godzinę");
      return;
    }

    const datetime = new Date(`${formData.date}T${formData.time}`);

    try {
      if (editingId) {
        // Edycja
        const docRef = doc(db, "reservations", editingId);
        await updateDoc(docRef, {
          title: formData.title,
          description: formData.description,
          date: Timestamp.fromDate(datetime),
          participants: formData.participants ? formData.participants.split(",").map(p => p.trim()) : [],
        });
        setEditingId(null);
      } else {
        // Dodawanie nowej
        await addDoc(collection(db, "reservations"), {
          userId: user.uid,
          title: formData.title,
          description: formData.description,
          date: Timestamp.fromDate(datetime),
          participants: formData.participants ? formData.participants.split(",").map(p => p.trim()) : [],
          status: "active",
          createdAt: Timestamp.now(),
        });
      }
      setFormData({ title: "", description: "", date: "", time: "", participants: "" });
    } catch (error) {
      console.error("Błąd zapisu rezerwacji:", error);
    }
  }

  function startEdit(reservation) {
    setEditingId(reservation.id);
    setFormData({
      title: reservation.title,
      description: reservation.description,
      date: reservation.date.toDate().toISOString().split("T")[0],
      time: reservation.date.toDate().toTimeString().slice(0, 5),
      participants: reservation.participants.join(", "),
    });
  }

  async function cancelReservation(id) {
  if (!window.confirm("Czy na pewno chcesz anulować tę rezerwację?")) return;

  try {
    const docRef = doc(db, "reservations", id);
    await updateDoc(docRef, { status: "cancelled" });
  } catch (error) {
    console.error("Błąd podczas anulowania rezerwacji:", error);
    alert("Nie udało się anulować rezerwacji.");
  }
}

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>Twoje rezerwacje</h2>

      {/* Filtry */}
      <div>
        <label>
          Status:
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="active">Aktywne</option>
            <option value="cancelled">Anulowane</option>
            <option value="all">Wszystkie</option>
          </select>
        </label>
        <label style={{ marginLeft: 20 }}>
          Sortuj po:
          <select value={sortField} onChange={e => setSortField(e.target.value)}>
            <option value="date">Dacie spotkania</option>
            <option value="createdAt">Dacie utworzenia</option>
          </select>
        </label>
      </div>

      {/* Lista */}
      <ul>
        {reservations.map((res) => (
          <li key={res.id} style={{ marginTop: 10, borderBottom: "1px solid #ccc", paddingBottom: 10 }}>
            <strong>{res.title}</strong> — {res.date.toDate().toLocaleString()}
            <br />
            {res.description}
            <br />
            Uczestnicy: {res.participants.join(", ")}
            <br />
            Status: {res.status}
            <br />
            <button onClick={() => startEdit(res)}>Edytuj</button>
            <button onClick={() => cancelReservation(res.id)} style={{ marginLeft: 10 }}>Anuluj</button>
          </li>
        ))}
      </ul>

      {/* Formularz dodawania/edycji */}
      <h3>{editingId ? "Edytuj rezerwację" : "Dodaj rezerwację"}</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tytuł:</label><br />
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div>
          <label>Opis:</label><br />
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </div>
        <div>
          <label>Data:</label><br />
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>
        <div>
          <label>Godzina:</label><br />
          <input type="time" name="time" value={formData.time} onChange={handleChange} required />
        </div>
        <div>
          <label>Uczestnicy (oddziel przecinkami):</label><br />
          <input type="text" name="participants" value={formData.participants} onChange={handleChange} />
        </div>
        <button type="submit" style={{ marginTop: 10 }}>{editingId ? "Zapisz zmiany" : "Dodaj rezerwację"}</button>
      </form>
    </div>
  );
}
