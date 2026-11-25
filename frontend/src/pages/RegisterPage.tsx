import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import FormField from "../components/FormField";
import { register } from "../api/services";

// registro con nombre, correo y contraseña
// nombre no vacio hasta 100 caracteres, correo valido, contraseña de 8 a 72
// si sale bien te manda al login
function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  function validar() {
    const nuevosErrores = { name: "", email: "", password: "" };

    if (name.trim() === "") {
      nuevosErrores.name = "El nombre es obligatorio";
    } else if (name.length > 100) {
      nuevosErrores.name = "Maximo 100 caracteres";
    }

    if (!email.includes("@") || !email.includes(".")) {
      nuevosErrores.email = "Correo invalido";
    }

    if (password.length < 8 || password.length > 72) {
      nuevosErrores.password = "La contraseña tiene que tener entre 8 y 72 caracteres";
    }

    setErrors(nuevosErrores);
    return nuevosErrores.name === "" && nuevosErrores.email === "" && nuevosErrores.password === "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError("");

    if (!validar()) return;

    try {
      await register(name, email, password);
      alert("Te registraste correctamente, ahora inicia sesion");
      navigate("/login");
    } catch (error) {
      // muestro el mensaje que manda el back
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else {
        setApiError("Error al registrarse");
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80">
        <h1 className="text-2xl font-bold mb-4">Registro</h1>

        {apiError && <p className="text-red-500 mb-4">{apiError}</p>}

        <FormField label="Nombre" value={name} onChange={setName} error={errors.name} />
        <FormField label="Correo" type="email" value={email} onChange={setEmail} error={errors.email} />
        <FormField label="Contraseña" type="password" value={password} onChange={setPassword} error={errors.password} />

        <button type="submit" className="bg-blue-600 text-white w-full py-2 rounded">
          Registrarse
        </button>

        <p className="mt-4 text-sm">
          ¿Ya tienes cuenta? <Link to="/login" className="text-blue-600">Inicia sesion</Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
