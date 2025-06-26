const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");
const express = require("express");
admin.initializeApp();
const db = admin.firestore();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "TWÓJ_EMAIL@gmail.com",
    pass: "HASŁO_LUB_APP_PASSWORD"
  }
});

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

exports.sendReminders = functions.pubsub.schedule("every day 08:00")
  .timeZone("Europe/Warsaw")
  .onRun(async () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split("T")[0];

    const snapshot = await db.collection("reservations")
      .where("dateStr", "==", dateStr)
      .where("status", "==", "active")
      .get();

    for (const doc of snapshot.docs) {
      const r = doc.data();
      const participants = r.participants || [];

      for (const email of participants) {
        await transporter.sendMail({
          from: '"System Rezerwacji" <twoj@email.com>',
          to: email,
          subject: `📅 Przypomnienie: ${r.title || "Twoje spotkanie"} - ${dateStr}`,
          html: `
            <p>Cześć!</p>
            <p>Przypominamy o nadchodzącym spotkaniu:</p>
            <ul>
              <li><strong>Tytuł:</strong> ${r.title}</li>
              <li><strong>Data:</strong> ${dateStr}</li>
              <li><strong>Godzina:</strong> ${r.startTime} – ${r.endTime}</li>
            </ul>
            <p>Do zobaczenia!</p>
          `
        });
      }
    }

    return null;
  });
