import { Link } from "react-router-dom";
import type { Room } from "../types";

function ItemCard({ room }: { room: Room }) {
  return (
    <Link to={`/rooms/${room.id}`} className="block border rounded p-4 bg-white hover:bg-gray-100">
      <h3 className="font-bold">{room.name}</h3>
      <p className="text-gray-600">
        {room.building} - Piso {room.floor}
      </p>
      <p className="text-sm">Turnos disponibles: {room.availableSlots}</p>
    </Link>
  );
}

export default ItemCard;
