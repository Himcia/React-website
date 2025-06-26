import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  getDoc,
  deleteDoc
} from "firebase/firestore";

export default function AdminPanel() {
  const [reservations, setReservations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [userEmailFilter, setUserEmailFilter] = useState("");


  useEffect(() => {
    const db = getFirestore();
    const q = query(collection(db, "reservations"), orderBy("date"));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const docs = snapshot.docs;
      const dataWithEmails = await Promise.all(
        docs.map(async (docSnap) => {
          const reservation = docSnap.data();
          const userRef = doc(db, "users", reservation.createdBy);
          const userSnap = await getDoc(userRef);
          const creatorEmail = userSnap.exists() ? userSnap.data().email : "Nieznany";
          const participantsEmails = reservation.participants || [];
          return {
            id: docSnap.id,
            ...reservation,
            creatorEmail,
            participantsEmails
          };
        })
      );
      setReservations(dataWithEmails);
    });

    return () => unsubscribe();
  }, []);

  const cancelReservation = async (id) => {
    const db = getFirestore();
    try {
      await updateDoc(doc(db, "reservations", id), { status: "cancelled" });
    } catch (error) {
      alert("❌ Błąd podczas anulowania rezerwacji.");
    }
  };

  const saveEdit = async (id) => {
    const db = getFirestore();
    try {
      await updateDoc(doc(db, "reservations", id), editedData);
      setEditingId(null);
    } catch (error) {
      alert("❌ Nie udało się zapisać zmian.");
    }
  };

  const deleteReservation = async (id) => {
  const confirmed = window.confirm("Czy na pewno chcesz trwale usunąć tę rezerwację?");
  if (!confirmed) return;

  const db = getFirestore();
  try {
    await deleteDoc(doc(db, "reservations", id));
    setReservations(prev => prev.filter((r) => r.id !== id));
  } catch (error) {
    alert("❌ Nie udało się usunąć rezerwacji.");
  }
};


  const filtered = reservations.filter((r) => {
    const matchesStatus = filter === "all" || r.status === filter;
    const matchesEmail =
      !userEmailFilter || r.creatorEmail?.toLowerCase().includes(userEmailFilter);
    return matchesStatus && matchesEmail;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "title") return (a.title || "").localeCompare(b.title || "");
    if (sortBy === "status") return (a.status || "").localeCompare(b.status || "");
    return new Date(a.date?.toDate?.()) - new Date(b.date?.toDate?.());
  });

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
      <h2>📋 Panel administratora</h2>

      <div style={{ marginBottom: 16 }}>
        <label>🔎 Filtruj: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ marginRight: 12 }}>
          <option value="all">Wszystkie</option>
          <option value="active">Aktywne</option>
          <option value="cancelled">Anulowane</option>
        </select>

        <label>↕️ Sortuj po: </label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="date">Dacie</option>
          <option value="title">Tytule</option>
          <option value="status">Statusie</option>
        </select>
        <input
          type="text"
          placeholder="Filtruj po e-mailu organizatora"
          value={userEmailFilter}
          onChange={(e) => setUserEmailFilter(e.target.value.toLowerCase())}
          style={{ marginLeft: 12, padding: "4px 8px", width: "200px" }}
        />

      </div>

      {sorted.map((r) => (
        <div key={r.id} style={{
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: 12,
          marginBottom: 12,
          backgroundColor: "#f8f8f8"
        }}>
          {editingId === r.id ? (
            <>
              <input
                value={editedData.title || ""}
                onChange={(e) => setEditedData({ ...editedData, title: e.target.value })}
                placeholder="Tytuł"
              />
              <input
                type="time"
                value={editedData.startTime || ""}
                onChange={(e) => setEditedData({ ...editedData, startTime: e.target.value })}
              />
              <input
                type="time"
                value={editedData.endTime || ""}
                onChange={(e) => setEditedData({ ...editedData, endTime: e.target.value })}
              />
              <button onClick={() => saveEdit(r.id)}>💾 Zapisz</button>
              <button onClick={() => setEditingId(null)}>❌ Anuluj</button>
            </>
          ) : (
            <>
              <h4>{r.title || "Bez tytułu"}</h4>
              <div><strong>📅 Data:</strong> {r.date?.toDate?.().toLocaleDateString()}</div>
              <div><strong>⏰ Godzina:</strong> {r.startTime} – {r.endTime}</div>
              <div><strong>👤 Organizator:</strong> {r.creatorEmail}</div>
              <div><strong>📌 Status:</strong> {r.status}</div>
              {r.participantsEmails?.length > 0 && (
                <div>
                  <strong>👥 Uczestnicy:</strong>
                  <ul style={{ paddingLeft: 20 }}>
                    {r.participantsEmails.map((email, i) => (
                      <li key={i}>{email}</li>
                    ))}
                  </ul>
                </div>
              )}
              <button
                onClick={() => {
                  setEditingId(r.id);
                  setEditedData({ title: r.title, startTime: r.startTime, endTime: r.endTime });
                }}
                style={{ marginRight: 10 }}
              >
                ✏️ Edytuj
              </button>
              <button
                onClick={() => cancelReservation(r.id)}
                disabled={r.status === "cancelled"}
              >
                ❌ Anuluj
              </button>
              <button
                onClick={() => deleteReservation(r.id)}
                style={{ marginLeft: 10,}}
              >
                🗑️ Usuń
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
