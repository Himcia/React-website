import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Home />} />
      <Route
        path="/register"
        element={user ? <Navigate to="/dashboard" /> : <Register />}
      />
      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/" />}
      />
      <Route
        path="/admin"
        element={user?.role === "admin" ? <AdminPanel /> : <Navigate to="/" />}
      />
    </Routes>
  );
}

export default App;
