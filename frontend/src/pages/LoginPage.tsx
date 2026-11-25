import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormField from "../components/FormField";
import { login } from "../api/services";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const auth = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const data = await login(email, password);
      // guardo el token en localStorage (lo hace el context)
      // el login solo devuelve el token asi que guardo el correo para mostrarlo
      auth.login(data.token, email);
      navigate("/dashboard");
    } catch {
      setError("Correo o contraseña incorrectos");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80">
        <h1 className="text-2xl font-bold mb-4">Iniciar sesion</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <FormField label="Correo" type="email" value={email} onChange={setEmail} />
        <FormField label="Contraseña" type="password" value={password} onChange={setPassword} />

        <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded">
          Entrar
        </button>

        <p className="mt-4 text-sm">
          ¿No tienes cuenta? <Link to="/register" className="text-blue-600">Registrate</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
