import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { getFirestore, collection, query, onSnapshot } from "firebase/firestore";
import { Button, Container, Typography, Paper, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";



export default function CalendarViewMUI() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
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
    <Container maxWidth="md" sx={{ pt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="outlined" onClick={() => navigate("/dashboard")}>
          🏠 Powrót do dashboardu
        </Button>
      </Box>
      <Typography variant="h4" sx={{ mb: 3 }}>
        📅 Kalendarz rezerwacji
      </Typography>

      <Paper elevation={3} sx={{ p: 2, backgroundColor: "#fff" }}>
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
      </Paper>
    </Container>
  );
}
