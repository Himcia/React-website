import { useAuth } from "../context/AuthContext";

export default function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Błąd wylogowania:", error);
    }
  };

  return (
    <button onClick={handleLogout}>
      🚪 Wyloguj się
    </button>
  );
}
