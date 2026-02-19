import {api} from '@/api/client';
import {Appointment, DashboardMetrics, Service} from '@/types/appointment';

interface CreateOwnerAppointmentPayload {
  client_id: number;
  service_id: number;
  barber_id: number;
  date: string;
  start_time: string;
  notes?: string;
}

interface OwnerAppointmentsQuery {
  date?: string;
  status?: string;
  barber_id?: number;
}

interface UpdateAppointmentStatusPayload {
  status: string;
  cancellation_reason?: string;
}

export interface BarberTeamMember {
  id: number;
  name: string;
  email?: string;
  avatar?: string;
  is_active: boolean;
  start_time: string;
  end_time: string;
  working_days: number[];
  created_at?: string;
}

export interface OwnerClient {
  id: number;
  name: string;
  email?: string;
  phone_number?: string;
}

interface AddBarberPayload {
  name: string;
  email: string;
  password: string;
  start_time?: string;
  end_time?: string;
  working_days?: number[];
}

interface UpdateBarbershopPayload {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  opening_time?: string;
  closing_time?: string;
  accepts_online_booking?: boolean;
  accepts_walk_in?: boolean;
}

interface UpdateBarberPayload {
  name?: string;
  is_active?: boolean;
  start_time?: string;
  end_time?: string;
  working_days?: number[];
}

interface LogoResponse {
  success: boolean;
  message: string;
  data: {
    barbershop_id: number;
    logo: string;
    logo_url: string;
  };
}

interface CreateServicePayload {
  name: string;
  price: number;
  duration_minutes: number;
  description?: string;
  category?: string;
  is_active?: boolean;
  is_recommended?: boolean;
}

interface UpdateServicePayload {
  name?: string;
  description?: string;
  category?: string;
  price?: number;
  duration_minutes?: number;
  is_active?: boolean;
  is_recommended?: boolean;
}

export async function getOwnerDashboard(): Promise<DashboardMetrics> {
  const {data} = await api.get<DashboardMetrics>('/owner/dashboard');
  console.log('getOwnerDashboard response:', data);
  return data ?? {};
}

export async function getOwnerAppointments(
  query?: OwnerAppointmentsQuery,
): Promise<Appointment[]> {
  const {data} = await api.get<unknown>('/owner/appointments', {
    params: query,
  });
  console.log('getOwnerAppointments response:', data, 'isArray:', Array.isArray(data));
  return normalizeOwnerAppointments(data);
}

export async function updateOwnerAppointmentStatus(
  appointmentId: number,
  payload: UpdateAppointmentStatusPayload,
): Promise<void> {
  await api.post(`/owner/appointments/${appointmentId}/status`, payload);
}

export async function createOwnerAppointment(
  payload: CreateOwnerAppointmentPayload,
): Promise<Appointment> {
  const {data} = await api.post<unknown>('/owner/appointments', payload);
  console.log('createOwnerAppointment response:', data);
  const [appointment] = normalizeOwnerAppointments(data);
  return appointment ?? ({} as Appointment);
}

type OwnerAppointmentsResponse = {
  data?: unknown;
} | unknown[] | unknown;

function normalizeOwnerAppointments(response: OwnerAppointmentsResponse): Appointment[] {
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
  const barber = item.barber as {name?: string} | undefined;

  return {
    id: Number(item.id ?? 0),
    date,
    time,
    status: String(item.status ?? 'scheduled'),
    service_name: service?.name ?? (item.service_name as string | undefined),
    barber_name: barber?.name ?? (item.barber_name as string | undefined),
    client_name: client?.name ?? (item.client_name as string | undefined),
  };
}

export async function uploadBarbershopLogo(
  logoUri: string,
): Promise<LogoResponse> {
  const formData = new FormData();

  const response = await fetch(logoUri);
  const blob = await response.blob();

  formData.append('logo', blob);

  const {data} = await api.post<LogoResponse>(
    '/owner/barbershop/logo',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  console.log('uploadBarbershopLogo response:', data);
  return data;
}

export async function getOwnerServices(): Promise<Service[]> {
  const {data} = await api.get<Service[]>('/owner/services');
  console.log('getOwnerServices response:', data, 'isArray:', Array.isArray(data));
  return Array.isArray(data) ? data : [];
}

export async function createOwnerService(
  payload: CreateServicePayload,
): Promise<Service> {
  const {data} = await api.post<Service>('/owner/services', payload);
  console.log('createOwnerService response:', data);
  return data ?? ({} as Service);
}

export async function updateOwnerService(
  serviceId: number,
  payload: UpdateServicePayload,
): Promise<Service> {
  const {data} = await api.put<Service>(`/owner/services/${serviceId}`, payload);
  console.log('updateOwnerService response:', data);
  return data ?? ({} as Service);
}

export async function deleteOwnerService(
  serviceId: number,
): Promise<{success: boolean; message: string}> {
  const {data} = await api.delete<{success: boolean; message: string}>(
    `/owner/services/${serviceId}`,
  );
  console.log('deleteOwnerService response:', data);
  return data;
}


export async function getOwnerClients(): Promise<OwnerClient[]> {
  const {data} = await api.get<OwnerClient[]>('/owner/clients');
  console.log('getOwnerClients response:', data, 'isArray:', Array.isArray(data));
  return Array.isArray(data) ? data : [];
}
export async function toggleOwnerService(
  serviceId: number,
): Promise<Service> {
  const {data} = await api.patch<Service>(`/owner/services/${serviceId}/toggle`);
  console.log('toggleOwnerService response:', data);
  return data ?? ({} as Service);
}

export async function getTeamBarbers(): Promise<BarberTeamMember[]> {
  const {data} = await api.get<BarberTeamMember[]>('/owner/team/barbers');
  console.log('getTeamBarbers response:', data, 'isArray:', Array.isArray(data));
  return Array.isArray(data) ? data : [];
}

export async function addTeamBarber(
  payload: AddBarberPayload,
): Promise<BarberTeamMember> {
  const {data} = await api.post<BarberTeamMember>('/owner/team/barbers', payload);
  console.log('addTeamBarber response:', data);
  return data ?? {};
}

export async function updateTeamBarber(
  barberId: number,
  payload: UpdateBarberPayload,
): Promise<BarberTeamMember> {
  const {data} = await api.put<BarberTeamMember>(
    `/owner/team/barbers/${barberId}`,
    payload,
  );
  console.log('updateTeamBarber response:', data);
  return data ?? {};
}

export async function removeTeamBarber(barberId: number): Promise<{success: boolean; message: string}> {
  const {data} = await api.delete<{success: boolean; message: string}>(
    `/owner/team/barbers/${barberId}`,
  );
  console.log('removeTeamBarber response:', data);
  return data;
}

export async function updateBarbershop(
  payload: UpdateBarbershopPayload,
): Promise<{success: boolean; message: string; data: unknown}> {
  const {data} = await api.put<{success: boolean; message: string; data: unknown}>(
    '/owner/barbershop',
    payload,
  );
  console.log('updateBarbershop response:', data);
  return data;
}
