import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';

import {getBarbers, getClientAppointments, getServices} from '@/api/modules/client';
import {Card} from '@/components/Card';
import {Screen} from '@/components/Screen';
import {SectionTitle} from '@/components/SectionTitle';
import {useAuth} from '@/providers/AuthProvider';
import {tokens} from '@/theme';
import {Appointment, Barber, Service} from '@/types/appointment';

export function ClientHomeScreen() {
  const {signOut, user} = useAuth();
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [servicesData, barbersData, appointmentsData] = await Promise.all([
        getServices(),
        getBarbers(),
        getClientAppointments(),
      ]);
      console.log('Client loadData results:', {servicesData, barbersData, appointmentsData});
      setServices(Array.isArray(servicesData) ? servicesData : []);
      setBarbers(Array.isArray(barbersData) ? barbersData : []);
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
    } catch (error) {
      console.error('Error loading client data:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados. Verifique sua conexão.');
      setServices([]);
      setBarbers([]);
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
        <Text style={styles.subtitle}>Área do cliente</Text>

        <View style={styles.grid}>
          <Card title="Serviços ativos" value={String(services.length)} />
          <Card title="Barbeiros ativos" value={String(barbers.length)} />
          <Card title="Meus agendamentos" value={String(appointments.length)} />
        </View>

        <SectionTitle>Próximos agendamentos</SectionTitle>
        {appointments.length > 0 ? (
          appointments.slice(0, 5).map(item => (
            <View key={item.id} style={styles.listItem}>
              <Text style={styles.listTitle}>{item.service_name ?? 'Serviço'}</Text>
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
  grid: {
    gap: tokens.spacing.sm,
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
