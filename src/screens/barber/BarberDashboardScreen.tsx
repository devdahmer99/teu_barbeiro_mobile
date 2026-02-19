import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';

import {getBarberAppointments, getBarberDashboard} from '@/api/modules/barber';
import {Card} from '@/components/Card';
import {Screen} from '@/components/Screen';
import {SectionTitle} from '@/components/SectionTitle';
import {useAuth} from '@/providers/AuthProvider';
import {tokens} from '@/theme';
import {Appointment, DashboardMetrics} from '@/types/appointment';

export function BarberDashboardScreen() {
  const {signOut, user} = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<DashboardMetrics>({});
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [dashboardData, appointmentsData] = await Promise.all([
        getBarberDashboard(),
        getBarberAppointments(),
      ]);
      console.log('Barber loadData results:', {dashboardData, appointmentsData});
      setDashboard(dashboardData ?? {});
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
    } catch (error) {
      console.error('Error loading barber data:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados. Verifique sua conexão.');
      setDashboard({});
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <Screen loading={loading}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Olá, {user?.name}</Text>
        <Text style={styles.subtitle}>Painel do barbeiro</Text>

        <Card title="Agendamentos hoje" value={String(dashboard.todayAppointments ?? 0)} />
        <Card title="Pendentes" value={String(dashboard.pendingAppointments ?? 0)} />
        <Card title="Concluídos" value={String(dashboard.completedAppointments ?? 0)} />

        <SectionTitle>Minha agenda</SectionTitle>
        {appointments.length > 0 ? (
          appointments.slice(0, 8).map(item => (
            <View key={item.id} style={styles.listItem}>
              <Text style={styles.listTitle}>{item.client_name ?? 'Cliente'}</Text>
              <Text style={styles.listMeta}>
                {item.date} • {item.time} • {item.status}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Nenhum agendamento encontrado</Text>
        )}

        <Pressable style={styles.secondaryButton} onPress={loadData}>
          <Text style={styles.secondaryButtonText}>Atualizar</Text>
        </Pressable>
        <Pressable style={styles.logoutButton} onPress={signOut}>
          <Text style={styles.logoutText}>Sair</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: tokens.spacing.md,
    paddingBottom: tokens.spacing.xl,
  },
  title: {
    color: tokens.text.primary,
    fontSize: tokens.typography.size.xl,
    fontWeight: '700',
  },
  subtitle: {
    color: tokens.text.secondary,
    fontSize: tokens.typography.size.md,
  },
  listItem: {
    borderWidth: 1,
    borderColor: tokens.border.default,
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.md,
    backgroundColor: tokens.surface.elevated,
  },
  listTitle: {
    color: tokens.text.primary,
    fontWeight: '600',
    fontSize: tokens.typography.size.md,
  },
  listMeta: {
    color: tokens.text.secondary,
    marginTop: tokens.spacing.xs,
  },
  emptyText: {
    color: tokens.text.secondary,
    textAlign: 'center',
    paddingVertical: tokens.spacing.lg,
    fontStyle: 'italic',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: tokens.color.brand.primary,
    borderRadius: tokens.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: tokens.spacing.md,
    marginTop: tokens.spacing.sm,
  },
  secondaryButtonText: {
    color: tokens.color.brand.primary,
    fontWeight: '600',
  },
  logoutButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: tokens.spacing.md,
  },
  logoutText: {
    color: tokens.color.state.error,
    fontWeight: '600',
  },
});
