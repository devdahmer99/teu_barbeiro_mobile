import React, {useCallback, useEffect, useState} from 'react';
import {Pressable, RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Ionicons} from '@expo/vector-icons';

import {getOwnerAppointments, getOwnerDashboard} from '@/api/modules/owner';
import {Screen} from '@/components/Screen';
import {useAlertModal} from '@/components/AlertModal';
import {useAuth} from '@/providers/AuthProvider';
import {tokens} from '@/theme';
import {Appointment, DashboardMetrics} from '@/types/appointment';

export function OwnerDashboardScreen() {
  const {signOut, user} = useAuth();
  const navigation = useNavigation();
  const showAlert = useAlertModal();
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<DashboardMetrics>({});
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [dashboardData, appointmentsData] = await Promise.all([
        getOwnerDashboard(),
        getOwnerAppointments(),
      ]);
      setDashboard(dashboardData ?? {});
      setAppointments(Array.isArray(appointmentsData) ? appointmentsData : []);
    } catch (error) {
      console.error('Error loading owner data:', error);
      showAlert({
        title: 'Erro',
        message: 'Não foi possível carregar os dados. Verifique sua conexão.',
        type: 'error',
      });
      setDashboard({});
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return tokens.color.state.success;
      case 'completed':
        return tokens.color.brand.primary;
      case 'pending':
        return tokens.color.state.warning;
      case 'scheduled':
        return tokens.color.brand.primary;
      case 'cancelled':
        return tokens.color.state.error;
      default:
        return tokens.text.secondary;
    }
  };

  return (
    <Screen>
      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl 
            refreshing={loading} 
            onRefresh={loadData} 
            colors={[tokens.color.brand.primary]} 
            tintColor={tokens.color.brand.primary}
          />
        }
        showsVerticalScrollIndicator={false}>
        
        {/* Compact Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={18} color={tokens.color.brand.primary} />
            </View>
            <View>
              <Text style={styles.greetingSmall}>Olá, {user?.name?.split(' ')[0]}</Text>
              <Text style={styles.dateText}>
                {new Date().toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}
              </Text>
            </View>
          </View>
          <Pressable style={styles.notificationIcon}>
            <Ionicons name="notifications-outline" size={22} color={tokens.text.primary} />
          </Pressable>
        </View>

        {/* Stats Horizontal */}
        <View style={styles.statsContainer}>
          <View style={styles.statCardCompact}>
            <Text style={styles.statNumber}>{dashboard.todayAppointments ?? 0}</Text>
            <Text style={styles.statLabelSmall}>Hoje</Text>
            <View style={[styles.statIndicator, {backgroundColor: tokens.color.brand.primary}]} />
          </View>
          
          <View style={styles.statCardCompact}>
            <Text style={styles.statNumber}>{dashboard.pendingAppointments ?? 0}</Text>
            <Text style={styles.statLabelSmall}>Pendentes</Text>
            <View style={[styles.statIndicator, {backgroundColor: tokens.color.state.warning}]} />
          </View>
          
          <View style={styles.statCardCompact}>
            <Text style={styles.statNumber}>R$ {dashboard.revenueToday ?? 0}</Text>
            <Text style={styles.statLabelSmall}>Receita</Text>
            <View style={[styles.statIndicator, {backgroundColor: tokens.color.state.success}]} />
          </View>
        </View>

        {/* Appointments Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Próximos agendamentos</Text>
            {appointments.length > 0 && (
              <Pressable>
                <Text style={styles.sectionLink}>Ver todos</Text>
              </Pressable>
            )}
          </View>

          {appointments.length > 0 ? (
            <View style={styles.appointmentsList}>
              {appointments.slice(0, 5).map((item) => (
                <Pressable key={item.id} style={styles.appointmentItem}>
                  <View style={styles.appointmentTime}>
                    <Text style={styles.timeText}>{item.time}</Text>
                    <View style={[styles.statusDot, {backgroundColor: getStatusColor(item.status)}]} />
                  </View>
                  <View style={styles.appointmentDetails}>
                    <Text style={styles.clientName}>{item.client_name ?? 'Cliente'}</Text>
                    <Text style={styles.serviceName}>{item.service_name} • {item.barber_name}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={tokens.text.secondary} />
                </Pressable>
              ))}
            </View>
          ) : (
            <View style={styles.emptyStateCompact}>
              <Ionicons name="calendar-outline" size={48} color={tokens.text.muted} />
              <Text style={styles.emptyText}>Nenhum agendamento hoje</Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsCompact}>
          <Pressable style={styles.actionButton} onPress={loadData}>
            <Ionicons name="refresh" size={20} color={tokens.color.brand.primary} />
            <Text style={styles.actionButtonText}>Atualizar</Text>
          </Pressable>
          
          <Pressable
            style={[styles.actionButton, styles.actionButtonPrimary]}
            onPress={() =>
              navigation.navigate('Appointments' as never, {
                screen: 'NewAppointment',
              } as never)
            }>
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.actionButtonTextPrimary}>Novo agendamento</Text>
          </Pressable>
        </View>

      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },
  // Header compacto
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 107, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingSmall: {
    fontSize: 16,
    fontWeight: '600',
    color: tokens.text.primary,
  },
  dateText: {
    fontSize: 13,
    color: tokens.text.secondary,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: tokens.surface.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Stats compactos horizontais
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCardCompact: {
    flex: 1,
    backgroundColor: tokens.surface.elevated,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: tokens.border.default,
    position: 'relative',
    overflow: 'hidden',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: tokens.text.primary,
    marginBottom: 4,
  },
  statLabelSmall: {
    fontSize: 12,
    color: tokens.text.secondary,
    fontWeight: '500',
  },
  statIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  
  // Section
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: tokens.text.primary,
  },
  sectionLink: {
    fontSize: 14,
    color: tokens.color.brand.primary,
    fontWeight: '600',
  },
  
  // Appointments lista limpa
  appointmentsList: {
    gap: 8,
  },
  appointmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.surface.elevated,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: tokens.border.default,
    gap: 12,
  },
  appointmentTime: {
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '700',
    color: tokens.text.primary,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  appointmentDetails: {
    flex: 1,
  },
  clientName: {
    fontSize: 15,
    fontWeight: '600',
    color: tokens.text.primary,
    marginBottom: 2,
  },
  serviceName: {
    fontSize: 13,
    color: tokens.text.secondary,
  },
  
  // Empty state compacto
  emptyStateCompact: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: tokens.text.secondary,
  },
  
  // Quick actions horizontal
  quickActionsCompact: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: tokens.surface.elevated,
    borderWidth: 1,
    borderColor: tokens.border.default,
  },
  actionButtonPrimary: {
    backgroundColor: tokens.color.brand.primary,
    borderColor: tokens.color.brand.primary,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: tokens.text.primary,
  },
  actionButtonTextPrimary: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
