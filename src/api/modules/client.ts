import {api} from '@/api/client';
import {Appointment, Barber, Service} from '@/types/appointment';

interface AvailableSlotsQuery {
  barberId: number;
  date: string;
}

interface CreateAppointmentPayload {
  service_id: number;
  barber_id: number;
  date: string;
  start_time: string;
  notes?: string;
}

interface ProfilePhotoResponse {
  success: boolean;
  message: string;
  data: {
    avatar: string;
    avatar_url: string;
  };
}

interface UpdateProfilePayload {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export async function getServices(): Promise<Service[]> {
  const {data} = await api.get<Service[]>('/services');
  console.log('getServices response:', data, 'isArray:', Array.isArray(data));
  return Array.isArray(data) ? data : [];
}

export async function getBarbers(): Promise<Barber[]> {
  const {data} = await api.get<Barber[]>('/barbers');
  console.log('getBarbers response:', data, 'isArray:', Array.isArray(data));
  return Array.isArray(data) ? data : [];
}

export async function getAvailableSlots(
  query: AvailableSlotsQuery,
): Promise<string[]> {
  const {data} = await api.get<string[]>('/barbers/available-slots', {
    params: {
      barber_id: query.barberId,
      date: query.date,
    },
  });
  return data;
}

export async function getClientAppointments(): Promise<Appointment[]> {
  const {data} = await api.get<unknown>('/appointments');
  console.log('getClientAppointments response:', data, 'isArray:', Array.isArray(data));
  return normalizeClientAppointments(data);
}

export async function createAppointment(
  payload: CreateAppointmentPayload,
): Promise<Appointment> {
  const {data} = await api.post<unknown>('/appointments', payload);
  const [appointment] = normalizeClientAppointments(data);
  return appointment ?? ({} as Appointment);
}

export async function cancelAppointment(appointmentId: number): Promise<void> {
  await api.post(`/appointments/${appointmentId}/cancel`);
}

export async function uploadProfilePhoto(
  photoUri: string,
): Promise<ProfilePhotoResponse> {
  const formData = new FormData();
  
  // Criar blob a partir do URI
  const response = await fetch(photoUri);
  const blob = await response.blob();
  
  formData.append('photo', blob);

  const {data} = await api.post<ProfilePhotoResponse>(
    '/profile/photo',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  console.log('uploadProfilePhoto response:', data);
  return data;
}

export async function deleteProfilePhoto(): Promise<{success: boolean; message: string}> {
  const {data} = await api.delete<{success: boolean; message: string}>('/profile/photo');
  console.log('deleteProfilePhoto response:', data);
  return data;
}

export async function updateProfile(
  payload: UpdateProfilePayload,
): Promise<{success: boolean; message: string; data: unknown}> {
  const {data} = await api.put<{success: boolean; message: string; data: unknown}>(
    '/profile',
    payload,
  );
  console.log('updateProfile response:', data);
  return data;
}

type ClientAppointmentsResponse = {
  data?: unknown;
} | unknown[] | unknown;

function normalizeClientAppointments(response: ClientAppointmentsResponse): Appointment[] {
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

  const service = item.service as {name?: string} | undefined;
  const barber = item.barber as {name?: string} | undefined;

  return {
    id: Number(item.id ?? 0),
    date,
    time,
    status: String(item.status ?? 'scheduled'),
    service_name: service?.name ?? (item.service_name as string | undefined),
    barber_name: barber?.name ?? (item.barber_name as string | undefined),
    client_name: (item.client_name as string | undefined) ?? undefined,
  };
}
