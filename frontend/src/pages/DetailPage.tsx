import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { getRoom, reservar } from "../api/services";
import type { Room } from "../types";

function DetailPage() {
  const { id } = useParams();
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState("");
  const [asistentes, setAsistentes] = useState("1");
  const [errorCampo, setErrorCampo] = useState("");
  const [errorReserva, setErrorReserva] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function cargar() {
    try {
      const data = await getRoom(id!);
      setRoom(data);
    } catch {
      setError("No se encontro la sala");
    }
  }

  useEffect(() => {
    cargar();
  }, [id]);

  async function handleReservar(e: React.FormEvent) {
    e.preventDefault();
    setErrorCampo("");
    setErrorReserva("");
    setConfirmacion("");

    // tiene que ser entero entre 1 y 6
    const numero = Number(asistentes);
    if (!Number.isInteger(numero) || numero < 1 || numero > 6) {
      setErrorCampo("Debe ser un numero entero entre 1 y 6");
      return;
    }

    setEnviando(true);
    try {
      const reserva = await reservar(room!.id, numero);
      setConfirmacion(`Reserva #${reserva.id} creada para ${reserva.attendees} asistentes`);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.code === "NO_SLOTS") {
        setErrorReserva("La sala ya no tiene turnos disponibles.");
      } else if (axios.isAxiosError(error) && error.response?.data?.message) {
        setErrorReserva(error.response.data.message);
      } else {
        setErrorReserva("No se pudo reservar");
      }
    }
    setEnviando(false);
    // vuelvo a pedir el detalle para ver los turnos actualizados
    cargar();
  }

  if (error) return <p className="text-red-500">{error}</p>;
  if (!room) return <p>Cargando...</p>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <Link to="/dashboard" className="text-blue-600">← Volver al dashboard</Link>
      <h1 className="text-2xl font-bold mt-2">{room.name}</h1>
      <p className="text-gray-600">
        {room.building} - Piso {room.floor}
      </p>
      <p className="mt-2">{room.description}</p>
      <p className="mt-2">Turnos disponibles: {room.availableSlots}</p>

      <form onSubmit={handleReservar} className="mt-6">
        <label className="block mb-1">Número de asistentes</label>
        <input
          type="number"
          value={asistentes}
          onChange={(e) => setAsistentes(e.target.value)}
          className="border rounded p-2 w-32"
        />
        {errorCampo && <p className="text-red-500 text-sm">{errorCampo}</p>}

        <button
          type="submit"
          disabled={enviando}
          className="block mt-3 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {enviando ? "Reservando..." : "Reservar"}
        </button>
      </form>

      {confirmacion && <p className="text-green-600 mt-3">{confirmacion}</p>}
      {errorReserva && <p className="text-red-500 mt-3">{errorReserva}</p>}
    </div>
  );
}

export default DetailPage;
