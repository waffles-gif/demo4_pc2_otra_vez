import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { userName, logout } = useAuth();
  const navigate = useNavigate();

  function cerrarSesion() {
    logout();
    navigate("/login");
  }

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="flex gap-4">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/my-bookings">Mis reservas</Link>
      </div>
      <div className="flex gap-4 items-center">
        <span>Hola {userName}</span>
        <button onClick={cerrarSesion} className="bg-white text-blue-600 px-3 py-1 rounded">
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
