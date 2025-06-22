import { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  getDoc
} from "firebase/firestore";

export default function AdminPanel() {
  const [reservations, setReservations] = useState([]);

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

          return {
            id: docSnap.id,
            ...reservation,
            creatorEmail
          };
        })
      );

      setReservations(dataWithEmails);
    });

    return () => unsubscribe();
  }, []);


  async function cancelReservation(id) {
    const db = getFirestore();
    try {
      await updateDoc(doc(db, "reservations", id), {
        status: "cancelled"
      });
    } catch (error) {
      console.error("Błąd podczas anulowania:", error);
      alert("Nie udało się anulować rezerwacji.");
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>📋 Panel administratora — wszystkie rezerwacje</h2>
      {reservations.length === 0 ? (
        <p>Brak rezerwacji do wyświetlenia.</p>
      ) : (
        reservations.map(r => (
          <div key={r.id} style={{
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 12,
            marginBottom: 12,
            backgroundColor: "#f9f9f9"
          }}>
            <h4 style={{ margin: 0 }}>{r.title || "Bez tytułu"}</h4>
            <div><strong>📅 Data:</strong> {r.date?.toDate().toLocaleDateString() || "—"}</div>
            <div><strong>🕒 Godzina:</strong> {r.startTime} – {r.endTime}</div>
            <div><strong>👤 Utworzone przez:</strong> {r.creatorEmail}</div>
            <div><strong>📌 Status:</strong> {r.status}</div>
            <button
              onClick={() => cancelReservation(r.id)}
              style={{ marginTop: 8 }}
              disabled={r.status === "cancelled"}
            >
              ❌ Anuluj
            </button>
          </div>
        ))
      )}
    </div>
  );
}
