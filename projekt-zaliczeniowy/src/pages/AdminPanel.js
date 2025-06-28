import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Divider,
  Checkbox,             
  FormControlLabel      
} from "@mui/material";

import {
  getFirestore, collection, query, orderBy, onSnapshot,
  updateDoc, doc, getDoc, deleteDoc, getDocs
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../Components/Logoutbutton";

export default function AdminPanelMUI() {
  const [reservations, setReservations] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [userEmailFilter, setUserEmailFilter] = useState("");
  const [allUsers, setAllUsers] = useState([]);

  const db = getFirestore();
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, "reservations"), orderBy("date"));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const dataWithEmails = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const userRef = doc(db, "users", data.createdBy);
          const userSnap = await getDoc(userRef);
          const userData = userSnap.data();
          const creatorName = userSnap.exists()
            ? `${userData.firstName || ""} ${userData.lastName || ""}`.trim()
            : "Nieznany";
         return {
            id: docSnap.id,
            ...data,
            creatorName,
            participantsEmails: data.participants || [],
          };

        })
      );
      setReservations(dataWithEmails);
    });
    return () => unsubscribe();
  }, [db]);

  const [emailToName, setEmailToName] = useState(new Map());
  const resolveName = (email) => emailToName.get(email) || email;

useEffect(() => {
  const fetchUsers = async () => {
    const snapshot = await getDocs(collection(db, "users"));
    const users = snapshot.docs.map((doc) => doc.data());
    setAllUsers(users);

    const map = new Map();
    users.forEach((u) => {
      if (u.email) {
        map.set(u.email, `${u.firstName || ""} ${u.lastName || ""}`.trim());
      }
    });

    setEmailToName(map);
  };
  fetchUsers();
}, [db]);


  const cancelReservation = async (id, title = "") => {
  const confirmed = window.confirm(
    `Czy na pewno chcesz anulować rezerwację${title ? ` „${title}”` : ""}?`
  );
  if (!confirmed) return;

  try {
    await updateDoc(doc(db, "reservations", id), { status: "cancelled" });
  } catch {
    alert("❌ Błąd podczas anulowania rezerwacji.");
  }
};
const restoreReservation = async (id, title = "") => {
  const confirmed = window.confirm(
    `Czy na pewno chcesz przywrócić rezerwację${title ? ` „${title}”` : ""}?`
  );
  if (!confirmed) return;

  try {
    await updateDoc(doc(db, "reservations", id), { status: "active" });
  } catch {
    alert("❌ Błąd podczas przywracania rezerwacji.");
  }
};


  const saveEdit = async (id) => {
    try {
      await updateDoc(doc(db, "reservations", id), {
        ...editedData,
        participants: editedData.participants || [],
      });

      setEditingId(null);
    } catch {
      alert("❌ Nie udało się zapisać zmian.");
    }
  };

  const deleteReservation = async (id) => {
    const confirmed = window.confirm("Czy na pewno chcesz usunąć rezerwację?");
    if (!confirmed) return;
    try {
      await deleteDoc(doc(db, "reservations", id));
      setReservations(prev => prev.filter((r) => r.id !== id));
    } catch {
      alert("❌ Nie udało się usunąć rezerwacji.");
    }
  };

  const filtered = reservations.filter((r) => {
    const matchStatus = filter === "all" || r.status === filter;
    const matchEmail = !userEmailFilter || r.creatorEmail.toLowerCase().includes(userEmailFilter);
    return matchStatus && matchEmail;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "title") return (a.title || "").localeCompare(b.title || "");
    if (sortBy === "status") return (a.status || "").localeCompare(b.status || "");
    return new Date(a.date?.toDate?.()) - new Date(b.date?.toDate?.());
  });

  return (
    <Container maxWidth="md" sx={{ pt: 4 }}>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">👑 Panel administratora</Typography>
        <Box>
          <Button onClick={() => navigate("/dashboard")} sx={{ mr: 1 }} variant="outlined">
            🏠 Powrót do dashboardu
          </Button>
          <LogoutButton />
        </Box>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select value={filter} label="Status" onChange={e => setFilter(e.target.value)}>
              <MenuItem value="all">Wszystkie</MenuItem>
              <MenuItem value="active">Aktywne</MenuItem>
              <MenuItem value="cancelled">Anulowane</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Sortuj po</InputLabel>
            <Select value={sortBy} label="Sortuj" onChange={e => setSortBy(e.target.value)}>
              <MenuItem value="date">Dacie</MenuItem>
              <MenuItem value="title">Tytule</MenuItem>
              <MenuItem value="status">Statusie</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Filtruj po organizatorze"
            value={userEmailFilter}
            onChange={e => setUserEmailFilter(e.target.value.toLowerCase())}
          />
        </Grid>
      </Grid>

      {sorted.map((r) => (
        <Paper key={r.id} sx={{ p: 2, mb: 2 }}>
          {editingId === r.id ? (
            <Box>
              <TextField
                fullWidth
                label="Tytuł"
                value={editedData.title || ""}
                onChange={(e) => setEditedData({ ...editedData, title: e.target.value })}
                sx={{ mb: 1 }}
              />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Start"
                    type="time"
                    value={editedData.startTime || ""}
                    onChange={(e) => setEditedData({ ...editedData, startTime: e.target.value })}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Koniec"
                    type="time"
                    value={editedData.endTime || ""}
                    onChange={(e) => setEditedData({ ...editedData, endTime: e.target.value })}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  👥 Wybierz uczestników:
                </Typography>
                {allUsers.map((user) => (
                  <FormControlLabel
                    key={user.email}
                    control={
                      <Checkbox
                        checked={editedData.participants?.includes(user.email) || false}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...(editedData.participants || []), user.email]
                            : editedData.participants.filter((email) => email !== user.email);

                          setEditedData((prev) => ({
                            ...prev,
                            participants: updated,
                          }));
                        }}
                      />
                    }
                    label={user.email}
                  />
                ))}
              </Box>

              <Box sx={{ mt: 2 }}>
                <Button onClick={() => saveEdit(r.id)} variant="contained" sx={{ mr: 1 }}>
                  💾 Zapisz
                </Button>
                <Button onClick={() => setEditingId(null)} variant="outlined" color="secondary">
                  ❌ Anuluj
                </Button>
              </Box>
            </Box>

          ) : (
            <Box>
              <Typography variant="h6">{r.title || "(Bez tytułu)"}</Typography>
              <Typography variant="body2">📅 {r.date?.toDate?.().toLocaleDateString()}</Typography>
              <Typography variant="body2">🕒 {r.startTime} – {r.endTime}</Typography>
              <Typography variant="body2">👤 {r.creatorName}</Typography>
              <Typography variant="body2">📌 {r.status}</Typography>
              {r.participantsEmails?.length > 0 && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2">👥 Uczestnicy:</Typography>
                  <ul style={{ marginTop: 4, paddingLeft: 20 }}>
                    {r.participantsEmails.map((email, i) => (
                      <li key={i} style={{ fontSize: "0.875rem", lineHeight: 1.5 }}>
                        {resolveName(email)}
                      </li>
                    ))}
                  </ul>
                </Box>
              )}
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
                <Button
                  onClick={() => {
                    setEditingId(r.id);
                    setEditedData({
                      title: r.title,
                      startTime: r.startTime,
                      endTime: r.endTime,
                      participants: [...r.participantsEmails],
                    });
                  }}
                  variant="outlined"
                  size="small"
                >
                  ✏️ Edytuj
                </Button>

                {r.status === "cancelled" ? (
                  <Button
                    onClick={() => restoreReservation(r.id, r.title)}
                    variant="outlined"
                    size="small"
                    color="success"
                  >
                    ♻️ Przywróć
                  </Button>
                ) : (
                  <Button
                    onClick={() => cancelReservation(r.id, r.title)}
                    variant="outlined"
                    size="small"
                    color="error"
                  >
                    ❌ Anuluj
                  </Button>
                )}

                <Button
                  onClick={() => deleteReservation(r.id)}
                  variant="outlined"
                  size="small"
                  color="error"
                >
                  🗑️ Usuń
                </Button>
              </Box>

                </Box> )} 
                </Paper> ))} 
                </Container> ); 
                }