import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

import {Screen} from '@/components/Screen';
import {useAuth} from '@/providers/AuthProvider';
import {tokens} from '@/theme';

export function BarberProfileScreen() {
  const {user, signOut} = useAuth();

  const profileOptions = [
    {
      id: 'edit',
      title: 'Editar Perfil',
      icon: 'create-outline' as const,
      onPress: () => console.log('Editar'),
    },
    {
      id: 'schedule',
      title: 'Minha Agenda',
      icon: 'calendar-outline' as const,
      onPress: () => console.log('Agenda'),
    },
    {
      id: 'stats',
      title: 'Estatísticas',
      icon: 'stats-chart-outline' as const,
      onPress: () => console.log('Estatísticas'),
    },
    {
      id: 'notifications',
      title: 'Notificações',
      icon: 'notifications-outline' as const,
      onPress: () => console.log('Notificações'),
    },
  ];

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Ionicons name="cut" size={50} color={tokens.text.primary} />
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          {user?.barbershop && (
            <View style={styles.barbershopBadge}>
              <Ionicons name="storefront" size={16} color={tokens.color.brand.primary} />
              <Text style={styles.barbershopName}>{user.barbershop.name}</Text>
            </View>
          )}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Hoje</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Semana</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Mês</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          {profileOptions.map(option => (
            <Pressable
              key={option.id}
              style={styles.option}
              onPress={option.onPress}>
              <View style={styles.optionLeft}>
                <Ionicons name={option.icon} size={24} color={tokens.text.primary} />
                <Text style={styles.optionText}>{option.title}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={tokens.text.secondary}
              />
            </Pressable>
          ))}
        </View>

        <View style={styles.section}>
          <Pressable style={styles.logoutButton} onPress={signOut}>
            <Ionicons name="log-out-outline" size={24} color={tokens.color.state.error} />
            <Text style={styles.logoutText}>Sair da conta</Text>
          </Pressable>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: tokens.spacing.md,
    gap: tokens.spacing.lg,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.lg,
    gap: tokens.spacing.xs,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: tokens.surface.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacing.sm,
  },
  userName: {
    fontSize: tokens.typography.size.xl,
    fontWeight: '700',
    color: tokens.text.primary,
  },
  userEmail: {
    fontSize: tokens.typography.size.sm,
    color: tokens.text.secondary,
  },
  barbershopBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.xs,
    backgroundColor: tokens.surface.elevated,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.radius.md,
    marginTop: tokens.spacing.sm,
  },
  barbershopName: {
    fontSize: tokens.typography.size.sm,
    color: tokens.color.brand.primary,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: tokens.surface.elevated,
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: tokens.border.default,
  },
  statValue: {
    fontSize: tokens.typography.size.xl,
    fontWeight: '700',
    color: tokens.color.brand.primary,
  },
  statLabel: {
    fontSize: tokens.typography.size.sm,
    color: tokens.text.secondary,
    marginTop: 4,
  },
  section: {
    gap: tokens.spacing.xs,
  },
  sectionTitle: {
    fontSize: tokens.typography.size.sm,
    fontWeight: '700',
    color: tokens.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: tokens.spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: tokens.surface.elevated,
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.border.default,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  optionText: {
    fontSize: tokens.typography.size.md,
    color: tokens.text.primary,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing.sm,
    backgroundColor: tokens.surface.elevated,
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.color.state.error,
  },
  logoutText: {
    fontSize: tokens.typography.size.md,
    color: tokens.color.state.error,
    fontWeight: '700',
  },
});
