import api from "./axios";
import type { Booking, LoginResponse, Page, Room, User } from "../types";

// AUTH
export async function register(name: string, email: string, password: string) {
  const res = await api.post<User>("/auth/register", { name, email, password });
  return res.data;
}

export async function login(email: string, password: string) {
  const res = await api.post<LoginResponse>("/auth/login", { email, password });
  return res.data;
}

// SALAS (la paginacion empieza en 1)
export async function getRooms(page: number) {
  const res = await api.get<Page<Room>>(`/rooms?page=${page}&size=5`);
  return res.data;
}

export async function getRoom(id: string) {
  const res = await api.get<Room>(`/rooms/${id}`);
  return res.data;
}

// RESERVAS
export async function reservar(roomId: number, attendees: number) {
  const res = await api.post<Booking>(`/rooms/${roomId}/bookings`, { attendees });
  return res.data;
}

export async function getMisReservas() {
  const res = await api.get<Booking[]>("/me/bookings");
  return res.data;
}

export async function cancelarReserva(id: number) {
  const res = await api.patch<Booking>(`/bookings/${id}/cancel`);
  return res.data;
}
