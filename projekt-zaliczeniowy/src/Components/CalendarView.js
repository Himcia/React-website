import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { getFirestore, collection, query, onSnapshot } from "firebase/firestore";

export default function CalendarView() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const db = getFirestore();
    const q = query(collection(db, "reservations"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const res = doc.data();
        return {
          id: doc.id,
          title: res.title || "📌 Rezerwacja",
          start: `${res.date.toDate().toISOString().split("T")[0]}T${res.startTime}`,
          end: `${res.date.toDate().toISOString().split("T")[0]}T${res.endTime}`
        };
      });
      setEvents(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ maxWidth: 1000, margin: "auto", padding: 20, fontFamily: "sans-serif" }}>
      <h2 style={{ marginBottom: 20 }}>📅 Kalendarz rezerwacji</h2>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          start: "prev,next today",
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay"
        }}
        events={events}
        height="auto"
        locale="pl"
      />
    </div>
  );
}
