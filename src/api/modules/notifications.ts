import {api} from '@/api/client';

export interface NotificationPreferences {
  agendamentos: {
    novos_agendamentos: { enabled: boolean };
    confirmacoes: { enabled: boolean };
    cancelamentos: { enabled: boolean };
    lembretes: { enabled: boolean };
  };
  resumos: {
    resumo_diario: { enabled: boolean };
    resumo_semanal: { enabled: boolean };
  };
  avaliacoes: {
    novas_avaliacoes: { enabled: boolean };
    avaliacoes_baixas: { enabled: boolean };
  };
  geral: {
    atualizacoes_sistema: { enabled: boolean };
    promocoes: { enabled: boolean };
  };
}

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  const {data} = await api.get<NotificationPreferences>('/notifications/preferences');
  console.log('getNotificationPreferences response:', data);
  return data ?? {
    agendamentos: {
      novos_agendamentos: {enabled: true},
      confirmacoes: {enabled: true},
      cancelamentos: {enabled: false},
      lembretes: {enabled: true},
    },
    resumos: {
      resumo_diario: {enabled: false},
      resumo_semanal: {enabled: true},
    },
    avaliacoes: {
      novas_avaliacoes: {enabled: true},
      avaliacoes_baixas: {enabled: true},
    },
    geral: {
      atualizacoes_sistema: {enabled: false},
      promocoes: {enabled: true},
    },
  };
}

export async function updateNotificationPreferences(
  preferences: NotificationPreferences,
): Promise<NotificationPreferences> {
  const {data} = await api.post<NotificationPreferences>(
    '/notifications/preferences',
    preferences,
  );
  console.log('updateNotificationPreferences response:', data);
  return data ?? preferences;
}

export async function resetNotificationPreferences(): Promise<NotificationPreferences> {
  const {data} = await api.post<NotificationPreferences>(
    '/notifications/preferences/reset',
  );
  console.log('resetNotificationPreferences response:', data);
  return data ?? {};
}
