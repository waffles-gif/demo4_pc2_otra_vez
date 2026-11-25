import { useEffect, useState } from "react";
import axios from "axios";
import ItemCard from "../components/ItemCard";
import Pagination from "../components/Pagination";
import { cancelarReserva, getMisReservas, getRooms } from "../api/services";
import type { Booking, Room } from "../types";

// la uso para el dashboard (salas) y para /my-bookings (mis reservas)
function ListPage({ mine }: { mine?: boolean }) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [reservas, setReservas] = useState<Booking[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  async function cargar() {
    setLoading(true);
    setError("");
    try {
      if (mine) {
        const data = await getMisReservas();
        setReservas(data);
      } else {
        // cada vez que cambia la pagina se vuelve a pedir al servidor
        const data = await getRooms(page);
        setRooms(data.items);
        setTotalPages(data.totalPages);
      }
    } catch {
      setError("No se pudo cargar la lista");
    }
    setLoading(false);
  }

  useEffect(() => {
    cargar();
  }, [page, mine]);

  async function cancelar(id: number) {
    if (!confirm("¿Seguro que quieres cancelar esta reserva?")) return;
    setMensaje("");

    try {
      await cancelarReserva(id);
      setMensaje("Reserva cancelada");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.code === "INVALID_STATE") {
        setMensaje("La reserva ya cambio de estado, se actualizo la lista");
      } else if (axios.isAxiosError(error) && error.response?.data?.message) {
        setMensaje(error.response.data.message);
      } else {
        setMensaje("No se pudo cancelar");
      }
    }
    // en cualquier caso vuelvo a pedir la lista para ver el estado real
    cargar();
  }

  if (loading) return <p>Cargando...</p>;

  if (error) {
    return (
      <div>
        <p className="text-red-500 mb-2">{error}</p>
        <button onClick={cargar} className="border px-3 py-1 rounded">
          Reintentar
        </button>
      </div>
    );
  }

  if (mine) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Mis reservas</h1>
        {mensaje && <p className="mb-4 text-blue-700">{mensaje}</p>}
        {reservas.length === 0 && <p>Todavia no tienes reservas</p>}

        {reservas.map((r) => (
          <div key={r.id} className="bg-white border rounded p-4 mb-2 flex justify-between items-center">
            <div>
              <p className="font-bold">
                #{r.id} - {r.resourceName}
              </p>
              <p>Asistentes: {r.attendees}</p>
              <p className={r.status === "ACTIVE" ? "text-green-600" : "text-gray-500"}>
                {r.status === "ACTIVE" ? "Activa" : "Cancelada"}
              </p>
            </div>
            {/* solo se puede cancelar si esta activa */}
            {r.status === "ACTIVE" && (
              <button onClick={() => cancelar(r.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                Cancelar
              </button>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Salas de estudio</h1>

      {rooms.length === 0 && <p>No hay salas</p>}

      <div className="grid grid-cols-2 gap-4">
        {rooms.map((room) => (
          <ItemCard key={room.id} room={room} />
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
}

export default ListPage;
