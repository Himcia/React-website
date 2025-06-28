import { useAuth } from "../context/AuthContext";
import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

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
    <Button
      onClick={handleLogout}
      variant="outlined"
      color="primary"
      startIcon={<LogoutIcon />}
    >
      Wyloguj się
    </Button>
  );
}
