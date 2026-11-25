// tipos segun la api de salas de estudio

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface LoginResponse {
  token: string;
}

export interface Room {
  id: number;
  name: string;
  building: string;
  floor: number;
  availableSlots: number;
  description: string;
}

// lo que devuelve GET /rooms
export interface Page<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

// una reserva
export interface Booking {
  id: number;
  resourceId: number;
  resourceName: string;
  attendees: number;
  status: "ACTIVE" | "CANCELLED";
}

export interface ApiError {
  code: string;
  message: string;
}
