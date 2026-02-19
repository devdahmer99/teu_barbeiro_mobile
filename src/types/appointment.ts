export interface Service {
  id: number;
  name: string;
  duration_minutes?: number;
  duration?: number;
  price?: number | string;
  description?: string;
  category?: string | null;
  is_active?: boolean;
  is_recommended?: boolean;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface Barber {
  id: number;
  name: string;
  specialty?: string;
}

export interface Appointment {
  id: number;
  date: string;
  time: string;
  status: string;
  service_name?: string;
  barber_name?: string;
  client_name?: string;
}

export interface DashboardMetrics {
  todayAppointments?: number;
  pendingAppointments?: number;
  completedAppointments?: number;
  revenueToday?: number;
  [key: string]: number | string | undefined;
}
