import React, { useEffect, useState } from "react";
import {
  Container, Typography, Grid, TextField, Select, MenuItem,
  FormControl, InputLabel, Button, Paper, Box, FormGroup,
  FormControlLabel, Checkbox
} from "@mui/material";
import { getFirestore, collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, doc, Timestamp, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import LogoutButton from "../Components/Logoutbutton";
import { useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';

export default function DashboardMUI() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const db = getFirestore();
   const theme = useTheme();
  
    const autofillStyles = {
      '& input:-webkit-autofill': {
        WebkitBoxShadow: `0 0 0 1000px ${theme.palette.background.default} inset`,
        WebkitTextFillColor: theme.palette.text.primary,
        transition: 'background-color 5000s ease-in-out 0s',
      },
    };

  const [allUsers, setAllUsers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [formData, setFormData] = useState({
    title: "", description: "", date: "", startTime: "", endTime: "", participants: []
  });
  const [filterStatus, setFilterStatus] = useState("active");
  const [participantFilter, setParticipantFilter] = useState("");
  const [sortField, setSortField] = useState("date");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    getDocs(collection(db, "users")).then((snapshot) =>
      setAllUsers(snapshot.docs.map((doc) => doc.data()))
    );
  }, [db]);

  useEffect(() => {
    if (!user) return;
    let q = query(collection(db, "reservations"), where("createdBy", "==", user.uid));
    if (filterStatus !== "all") q = query(q, where("status", "==", filterStatus));
    if (sortField) q = query(q, orderBy(sortField));
    const unsubscribe = onSnapshot(q, (snap) =>
      setReservations(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    );
    return unsubscribe;
  }, [user, db, filterStatus, sortField]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, date, startTime, endTime, participants } = formData;

    const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);
    const invalid = participants.filter((e) => !isValidEmail(e));
    if (invalid.length > 0) return alert("Nieprawidłowe e-maile:\n" + invalid.join(", "));

    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);
    if (start >= end) return alert("⏰ Start musi być przed końcem!");

    const payload = {
      title, description,
      date: Timestamp.fromDate(new Date(`${date}T00:00`)),
      startTime, endTime, participants,
      status: "active", createdBy: user.uid, createdAt: Timestamp.now(),
    };

    try {
      editingId
        ? await updateDoc(doc(db, "reservations", editingId), payload)
        : await addDoc(collection(db, "reservations"), payload);
      setFormData({ title: "", description: "", date: "", startTime: "", endTime: "", participants: [] });
      setEditingId(null);
    } catch (err) {
      alert("Błąd zapisu: " + err.message);
    }
  };

  const filtered = reservations.filter(
    (r) =>
      !participantFilter ||
      r.participants?.some((email) => email.toLowerCase().includes(participantFilter.toLowerCase()))
  );

  const formatDateRange = (date, startTime, endTime) => {
    const day = date.toDate().toISOString().split("T")[0].replace(/-/g, "");
    const start = `${day}T${startTime.replace(":", "")}00Z`;
    const end = `${day}T${endTime.replace(":", "")}00Z`;
    return `${start}/${end}`;
  };

  return (
    <Container maxWidth="md" sx={{ pt: 4 }}>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h4">📋 Moje rezerwacje</Typography>
        <Box>
          {user?.role === "admin" && (
            <Button onClick={() => navigate("/admin")} variant="contained" color="primary" sx={{ mr: 1 }}>
              🔑 Admin
            </Button>
          )}
          <Button onClick={() => navigate("/calendar")} variant="outlined" sx={{ mr: 1 }}>
            📅 Kalendarz
          </Button>
          <LogoutButton />
        </Box>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={filterStatus} label="Status" onChange={(e) => setFilterStatus(e.target.value)}>
              <MenuItem value="active">Aktywne</MenuItem>
              <MenuItem value="cancelled">Anulowane</MenuItem>
              <MenuItem value="all">Wszystkie</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Sortuj po</InputLabel>
            <Select value={sortField} label="Sortuj" onChange={(e) => setSortField(e.target.value)}>
              <MenuItem value="date">Data spotkania</MenuItem>
              <MenuItem value="createdAt">Data utworzenia</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Filtruj po uczestniku"
            value={participantFilter}
            onChange={(e) => setParticipantFilter(e.target.value)}
            sx={{
              mb: 2,
                '& input:-webkit-autofill': {
                WebkitBoxShadow: `0 0 0 0px ${theme.palette.background.paper} inset`,
                WebkitTextFillColor: theme.palette.text.primary,
                transition: 'background-color 5000s ease-in-out 0s',
                autofillStyles
              },
            }}
          />
        </Grid>
      </Grid>

      {filtered.map((res) => (
        <Paper key={res.id} sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6">{res.title || "(Bez tytułu)"}</Typography>
          <Typography variant="body2">📅 {res.date.toDate().toLocaleDateString()}</Typography>
          <Typography variant="body2">🕒 {res.startTime} – {res.endTime}</Typography>
          <Typography variant="body2">📝 {res.description || "—"}</Typography>
          <Typography variant="body2">👥 {res.participants?.join(", ") || "—"}</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>📌 {res.status}</Typography>
          <Button 
          variant="outlined"
            size="small"
            sx={{ ml: 1, mt: 1 }}
            onClick={() => {
            setEditingId(res.id);
            setFormData({
              title: res.title,
              description: res.description,
              date: res.date.toDate().toISOString().split("T")[0],
              startTime: res.startTime,
              endTime: res.endTime,
              participants: res.participants || []
            });
          }}>✏️ Edytuj</Button>
          <Button
            variant="outlined"
            size="small"
            sx={{ ml: 1, mt: 1 }}
            href={`https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(res.title || "Rezerwacja")}&dates=${formatDateRange(res.date, res.startTime, res.endTime)}&details=${encodeURIComponent(res.description || "")}&location=Online`}
            target="_blank"
          >
            📅 Dodaj do Kalendarza Google
          </Button>

        </Paper>
      ))}

      <Typography variant="h5" sx={{ mt: 4 }}>
        {editingId ? "✏️ Edytuj rezerwację" : "➕ Nowa rezerwacja"}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Tytuł"
          name="title"
          value={formData.title}
          onChange={(e) =>
            setFormData((f) => ({ ...f, title: e.target.value }))
          }
          required
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          multiline
          label="Opis"
          name="description"
          value={formData.description}
          onChange={(e) =>
            setFormData((f) => ({ ...f, description: e.target.value }))
          }
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          type="date"
          label="Data"
          value={formData.date}
          onChange={(e) =>
            setFormData((f) => ({ ...f, date: e.target.value }))
          }
          InputLabelProps={{ shrink: true }}
          required
          sx={{ mb: 2 }}
        />

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="time"
              label="Start"
              value={formData.startTime}
              onChange={(e) =>
                setFormData((f) => ({ ...f, startTime: e.target.value }))
              }
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="time"
              label="Koniec"
              value={formData.endTime}
              onChange={(e) =>
                setFormData((f) => ({ ...f, endTime: e.target.value }))
              }
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            👥 Wybierz uczestników:
          </Typography>
          <FormGroup>
            {allUsers.map((u) => (
              <FormControlLabel
                key={u.email}
                control={
                  <Checkbox
                    checked={formData.participants.includes(u.email)}
                    onChange={(e) => {
                      const updated = e.target.checked
                        ? [...formData.participants, u.email]
                        : formData.participants.filter((mail) => mail !== u.email);
                      setFormData((f) => ({ ...f, participants: updated }));
                    }}
                  />
                }
                label={u.email}
              />
            ))}
          </FormGroup>
        </Box>

        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 3 }}
        >
          {editingId ? "💾 Zapisz zmiany" : "➕ Dodaj rezerwację"}
        </Button>
      </Box>
      </Container> ); 
      }
