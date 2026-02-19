import {api} from '@/api/client';
import {Appointment, DashboardMetrics} from '@/types/appointment';

export interface BarberSchedule {
  barber_id: number;
  name: string;
  start_time: string;
  end_time: string;
  working_days: number[];
  working_days_labels: {
    [key: string]: string;
  };
}

interface UpdateSchedulePayload {
  start_time: string;
  end_time: string;
  working_days: number[];
}

interface BarberAppointmentsQuery {
  date?: string;
  status?: string;
}

interface UpdateAppointmentStatusPayload {
  status: string;
  cancellation_reason?: string;
}

export async function getBarberDashboard(): Promise<DashboardMetrics> {
  const {data} = await api.get<DashboardMetrics>('/barber/dashboard');
  console.log('getBarberDashboard response:', data);
  return data ?? {};
}

export async function getBarberAppointments(
  query?: BarberAppointmentsQuery,
): Promise<Appointment[]> {
  const {data} = await api.get<unknown>('/barber/appointments', {
    params: query,
  });
  console.log('getBarberAppointments response:', data, 'isArray:', Array.isArray(data));
  return normalizeBarberAppointments(data);
}

export async function updateBarberAppointmentStatus(
  appointmentId: number,
  payload: UpdateAppointmentStatusPayload,
): Promise<void> {
  await api.post(`/barber/appointments/${appointmentId}/status`, payload);
}

export async function getBarberSchedule(): Promise<BarberSchedule> {
  const {data} = await api.get<BarberSchedule>('/barber/schedule');
  console.log('getBarberSchedule response:', data);
  return data ?? {};
}

export async function updateBarberSchedule(
  payload: UpdateSchedulePayload,
): Promise<BarberSchedule> {
  const {data} = await api.post<BarberSchedule>('/barber/schedule', payload);
  console.log('updateBarberSchedule response:', data);
  return data ?? {};
}

type BarberAppointmentsResponse = {
  data?: unknown;
} | unknown[] | unknown;

function normalizeBarberAppointments(response: BarberAppointmentsResponse): Appointment[] {
  const rawList = Array.isArray(response)
    ? response
    : Array.isArray((response as {data?: unknown[]})?.data)
      ? (response as {data: unknown[]}).data
      : isAppointmentObject(response)
        ? [response]
        : [];

  return rawList
    .map(item => toAppointment(item as Record<string, unknown>))
    .filter(Boolean) as Appointment[];
}

function isAppointmentObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && 'id' in value);
}

function toAppointment(item: Record<string, unknown>): Appointment | null {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const startTime = String(item.start_time ?? item.date ?? item.time ?? '');
  const dateObj = startTime ? new Date(startTime) : null;
  const isValidDate = dateObj ? !Number.isNaN(dateObj.getTime()) : false;

  const date = isValidDate
    ? dateObj!.toLocaleDateString('pt-BR')
    : (item.date as string | undefined) ?? '';

  const time = isValidDate
    ? dateObj!.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})
    : (item.time as string | undefined) ?? '';

  const client = item.client as {name?: string} | undefined;
  const service = item.service as {name?: string} | undefined;

  return {
    id: Number(item.id ?? 0),
    date,
    time,
    status: String(item.status ?? 'scheduled'),
    service_name: service?.name ?? (item.service_name as string | undefined),
    barber_name: (item.barber_name as string | undefined) ?? undefined,
    client_name: client?.name ?? (item.client_name as string | undefined),
  };
}
