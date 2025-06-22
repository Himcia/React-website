const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(express.json());

// GET all reservations
app.get("/reservations", async (req, res) => {
  const snapshot = await db.collection("reservations").get();
  const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  res.json(data);
});

// POST new reservation
app.post("/reservations", async (req, res) => {
  try {
    const { title, date } = req.body;
    if (!title || !date) {
      return res.status(400).json({ error: "Brakuje wymaganych pól" });
    }

    const doc = await db.collection("reservations").add(req.body);
    res.status(201).json({ id: doc.id });
  } catch (error) {
    console.error("Błąd serwera:", error);
    res.status(500).json({ error: "Wewnętrzny błąd serwera" });
  }
});


// PUT update
app.put("/reservations/:id", async (req, res) => {
  await db.collection("reservations").doc(req.params.id).update(req.body);
  res.sendStatus(204);
});

// DELETE
app.delete("/reservations/:id", async (req, res) => {
  await db.collection("reservations").doc(req.params.id).delete();
  res.sendStatus(204);
});

exports.api = functions.https.onRequest(app);
