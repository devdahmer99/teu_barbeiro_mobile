import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

import {cancelAppointment, getClientAppointments} from '@/api/modules/client';
import {Screen} from '@/components/Screen';
import {tokens} from '@/theme';
import {Appointment} from '@/types/appointment';

export function ClientAppointmentsScreen() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAppointments = useCallback(async () => {
    try {
      const data = await getClientAppointments();
      setAppointments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading appointments:', error);
      Alert.alert('Erro', 'Não foi possível carregar os agendamentos.');
      setAppointments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadAppointments();
  }, [loadAppointments]);

  const handleCancelAppointment = useCallback(
    (appointmentId: number) => {
      Alert.alert(
        'Cancelar Agendamento',
        'Deseja realmente cancelar este agendamento?',
        [
          {text: 'Não', style: 'cancel'},
          {
            text: 'Sim, cancelar',
            style: 'destructive',
            onPress: async () => {
              try {
                await cancelAppointment(appointmentId);
                Alert.alert('Sucesso', 'Agendamento cancelado com sucesso!');
                loadAppointments();
              } catch (error) {
                Alert.alert('Erro', 'Não foi possível cancelar o agendamento.');
              }
            },
          },
        ],
      );
    },
    [loadAppointments],
  );

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return tokens.color.state.success;
      case 'pending':
        return tokens.color.state.warning;
      case 'cancelled':
        return tokens.color.state.error;
      default:
        return tokens.text.secondary;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'completed':
        return 'Concluído';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <Screen loading={loading}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
        {appointments.length > 0 ? (
          appointments.map(appointment => (
            <View key={appointment.id} style={styles.card}>
              <View style={styles.header}>
                <View style={styles.headerLeft}>
                  <Ionicons name="cut-outline" size={40} color={tokens.color.brand.primary} />
                  <View style={styles.headerInfo}>
                    <Text style={styles.serviceName}>
                      {appointment.service_name ?? 'Serviço'}
                    </Text>
                    {appointment.barber_name && (
                      <Text style={styles.barberName}>
                        Barbeiro: {appointment.barber_name}
                      </Text>
                    )}
                  </View>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    {backgroundColor: getStatusColor(appointment.status)},
                  ]}>
                  <Text style={styles.statusText}>
                    {getStatusLabel(appointment.status)}
                  </Text>
                </View>
              </View>

              <View style={styles.details}>
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={16} color={tokens.text.secondary} />
                  <Text style={styles.detailText}>{appointment.date}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={16} color={tokens.text.secondary} />
                  <Text style={styles.detailText}>{appointment.time}</Text>
                </View>
              </View>

              {appointment.status === 'pending' && (
                <Pressable
                  style={styles.cancelButton}
                  onPress={() => handleCancelAppointment(appointment.id)}>
                  <Text style={styles.cancelButtonText}>Cancelar agendamento</Text>
                </Pressable>
              )}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={80} color={tokens.text.secondary} />
            <Text style={styles.emptyText}>Você ainda não tem agendamentos</Text>
            <Text style={styles.emptySubtext}>
              Agende um serviço na aba "Serviços"
            </Text>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: tokens.spacing.md,
    gap: tokens.spacing.md,
  },
  card: {
    backgroundColor: tokens.surface.elevated,
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.md,
    borderWidth: 1,
    borderColor: tokens.border.default,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: tokens.spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    flex: 1,
  },
  headerInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: tokens.typography.size.md,
    fontWeight: '700',
    color: tokens.text.primary,
  },
  barberName: {
    fontSize: tokens.typography.size.sm,
    color: tokens.text.secondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: 4,
    borderRadius: tokens.radius.sm,
  },
  statusText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  details: {
    gap: tokens.spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.xs,
  },
  detailText: {
    fontSize: tokens.typography.size.sm,
    color: tokens.text.secondary,
  },
  cancelButton: {
    marginTop: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    alignItems: 'center',
    backgroundColor: tokens.surface.base,
    borderRadius: tokens.radius.sm,
    borderWidth: 1,
    borderColor: tokens.color.state.error,
  },
  cancelButtonText: {
    color: tokens.color.state.error,
    fontWeight: '600',
    fontSize: tokens.typography.size.sm,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: tokens.spacing.xl * 2,
    gap: tokens.spacing.sm,
  },
  emptyText: {
    fontSize: tokens.typography.size.md,
    color: tokens.text.primary,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: tokens.typography.size.sm,
    color: tokens.text.secondary,
  },
});
