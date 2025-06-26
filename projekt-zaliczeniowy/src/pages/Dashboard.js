import React, { useEffect, useState } from "react";
import {
  getFirestore, collection, query, where, orderBy, onSnapshot,
  addDoc, updateDoc, doc, Timestamp, getDocs
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import LogoutButton from "../Components/Logoutbutton";
import { useNavigate } from "react-router-dom";

const handleAddToCalendar = (reservation) => {
  const title = encodeURIComponent(reservation.title || "Rezerwacja");
  const details = encodeURIComponent(reservation.description || "Dodane przez system");
  const location = encodeURIComponent("Lokalizacja");

  const dateStr = reservation.date.toDate().toISOString().split("T")[0];
  const start = new Date(`${dateStr}T${reservation.startTime}`);
  const end = new Date(`${dateStr}T${reservation.endTime}`);
  const format = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");

  const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${format(start)}/${format(end)}&details=${details}&location=${location}`;
  window.open(url, "_blank");
};

export default function Dashboard() {
  const { user } = useAuth();
  const db = getFirestore();
  const navigate = useNavigate();

  const [allUsers, setAllUsers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [filterStatus, setFilterStatus] = useState("active");
  const [participantFilter, setParticipantFilter] = useState("");
  const [sortField, setSortField] = useState("date");
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    participants: []
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const users = snapshot.docs.map(doc => doc.data());
      setAllUsers(users);
    };
    fetchUsers();
  }, [db]);

  useEffect(() => {
    if (!user) return;

    const ref = collection(db, "reservations");
    let q = query(ref, where("createdBy", "==", user.uid));

    if (filterStatus !== "all") {
      q = query(q, where("status", "==", filterStatus));
    }
    if (sortField) {
      q = query(q, orderBy(sortField));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReservations(data);
    });

    return unsubscribe;
  }, [user, db, filterStatus, sortField]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dateOnly = new Date(`${formData.date}T00:00`);

    if (!formData.date || !formData.startTime || !formData.endTime) {
    alert("Uzupełnij datę oraz godziny rozpoczęcia i zakończenia.");
    return;
    }

    const start = new Date(`${formData.date}T${formData.startTime}`);
    const end = new Date(`${formData.date}T${formData.endTime}`);

    if (start >= end) {
      alert("⏰ Godzina zakończenia musi być późniejsza niż rozpoczęcia.");
      return;
    }

    const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
    const invalidEmails = formData.participants.filter(email => !isValidEmail(email));
    if (invalidEmails.length > 0) {
      alert("Nieprawidłowe adresy e-mail:\n" + invalidEmails.join(", "));
      return;
    }
    const isEmpty = (val) => !val || (Array.isArray(val) && val.length === 0);

      if (
        isEmpty(formData.title) ||
        isEmpty(formData.date) ||
        isEmpty(formData.startTime) ||
        isEmpty(formData.endTime)
      ) {
        alert("Uzupełnij wszystkie wymagane pola.");
        return;
      }

    const newReservation = {
      title: formData.title,
      description: formData.description,
      date: Timestamp.fromDate(dateOnly),
      startTime: formData.startTime,
      endTime: formData.endTime,
      participants: formData.participants,
      status: "active",
      createdBy: user.uid,
      createdAt: Timestamp.now()
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, "reservations", editingId), newReservation);
        setEditingId(null);
      } else {
        await addDoc(collection(db, "reservations"), newReservation);
      }

      setFormData({
        title: "",
        description: "",
        date: "",
        startTime: "",
        endTime: "",
        participants: []
      });
    } catch (error) {
      console.error("Błąd zapisu:", error);
    }
  };

  const startEdit = (reservation) => {
    setEditingId(reservation.id);
    setFormData({
      title: reservation.title,
      description: reservation.description,
      date: reservation.date.toDate().toISOString().split("T")[0],
      startTime: reservation.startTime,
      endTime: reservation.endTime,
      participants: reservation.participants || []
    });
  };

  const cancelReservation = async (id) => {
    if (!window.confirm("Anulować tę rezerwację?")) return;
    await updateDoc(doc(db, "reservations", id), { status: "cancelled" });
  };

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 20, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2>📋 Moje rezerwacje</h2>
        <div>
          {user?.role === "admin" && (
            <button onClick={() => navigate("/admin")} style={{ marginRight: 10 }}>
              🔑 Panel administratora
            </button>
          )}
          <button onClick={() => navigate("/calendar")} style={{ marginRight: 10 }}>
            📅 Kalendarz
          </button>
          <LogoutButton />
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <label>
          Status:
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ marginLeft: 8 }}>
            <option value="active">Aktywne</option>
            <option value="cancelled">Anulowane</option>
            <option value="all">Wszystkie</option>
          </select>
        </label>
        <label>
          Sortuj po:
          <select value={sortField} onChange={e => setSortField(e.target.value)} style={{ marginLeft: 8 }}>
            <option value="date">Data spotkania</option>
            <option value="createdAt">Data utworzenia</option>
          </select>
        </label>
        <label>
          Filtruj po uczestniku:
          <input
            type="text"
            placeholder="np. anna@firma.pl"
            value={participantFilter}
            onChange={(e) => setParticipantFilter(e.target.value)}
            style={{ marginLeft: 8 }}
          />
        </label>
      </div>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {reservations.map(res => (
          <li key={res.id} style={{
            background: "#f9f9f9", border: "1px solid #ddd",
            borderRadius: 8, padding: 12, marginBottom: 12,
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
          }}>
            <h4>{res.title || "(Bez tytułu)"}</h4>
            <div><strong>📅 Data:</strong> {res.date.toDate().toLocaleDateString()}</div>
            <div><strong>🕒 Godzina:</strong> {res.startTime} – {res.endTime}</div>
            <div><strong>📝 Opis:</strong> {res.description || "—"}</div>
            <div><strong>👥 Uczestnicy:</strong> {res.participants.join(", ") || "—"}</div>
            <div><strong>📌 Status:</strong> {res.status}</div>
            <div style={{ marginTop: 8 }}>
              <button onClick={() => startEdit(res)}>✏️ Edytuj</button>
              <button onClick={() => cancelReservation(res.id)} style={{ marginLeft: 10 }}>❌ Anuluj</button>
              <button onClick={() => handleAddToCalendar(res)} style={{ marginLeft: 10 }}>
                📅 Dodaj do Kalendarza Google
              </button>
            </div>
          </li>
        ))}
      </ul>

      <h3 style={{ marginTop: 30 }}>{editingId ? "✏️ Edytuj rezerwację" : "➕ Dodaj rezerwację"}</h3>
      <form onSubmit={handleSubmit} style={{ marginTop: 10 }}>
        <div style={{ marginBottom: 10 }}>
          <label>Tytuł:</label><br />
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Opis:</label><br />
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Data:</label><br />
          <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Godzina rozpoczęcia:</label><br />
          <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} required />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Godzina zakończenia:</label><br />
          <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} required />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Uczestnicy:</label><br />
          {allUsers.map(user => (
            <label key={user.email} style={{ display: "block", marginBottom: 4 }}>
              <input
                type="checkbox"
                checked={formData.participants.includes(user.email)}
                onChange={(e) => {
                  const updated = e.target.checked
                    ? [...formData.participants, user.email]
                    : formData.participants.filter(email => email !== user.email);
                  setFormData(prev => ({ ...prev, participants: updated }));
                }}
              />
              {" "}{user.email}
            </label>
          ))}
        </div>
        <button type="submit">{editingId ? "Zapisz zmiany" : "Dodaj rezerwację"}</button>
      </form>
    </div>
  );
}
