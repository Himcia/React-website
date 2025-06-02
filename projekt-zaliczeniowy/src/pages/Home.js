import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/dashboard");  // po zalogowaniu przejdź do dashboardu
    } catch {
      setError("Nie udało się zalogować. Sprawdź dane.");
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Logowanie</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label><br />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <label>Hasło</label><br />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: 15 }}>
          Zaloguj się
        </button>
      </form>
      <p style={{ marginTop: 15 }}>
        Nie masz konta? <Link to="/register">Zarejestruj się</Link>
      </p>
    </div>
  );
}
