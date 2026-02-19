import React from 'react';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';

import {Screen} from '@/components/Screen';
import {useAuth} from '@/providers/AuthProvider';
import {tokens} from '@/theme';

export function OwnerSettingsScreen() {
  const {user, signOut} = useAuth();
  const navigation = useNavigation<any>();

  const settingsOptions = [
    {
      id: 'profile',
      title: 'Meu Perfil',
      icon: 'person-outline' as const,
      onPress: () => navigation.navigate('Profile'),
    },
    {
      id: 'barbershop',
      title: 'Barbearia',
      icon: 'storefront-outline' as const,
      onPress: () => navigation.navigate('Barbershop'),
    },
    {
      id: 'team',
      title: 'Equipe',
      icon: 'people-outline' as const,
      onPress: () => navigation.navigate('Team'),
    },
    {
      id: 'services',
      title: 'Serviços',
      icon: 'cut-outline' as const,
      onPress: () => navigation.navigate('Services'),
    },
    {
      id: 'notifications',
      title: 'Notificações',
      icon: 'notifications-outline' as const,
      onPress: () => navigation.navigate('Notifications'),
    },
  ];

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={50} color={tokens.text.primary} />
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          {user?.barbershop && (
            <Text style={styles.barbershopName}>{user.barbershop.name}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          {settingsOptions.map(option => (
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

        <Text style={styles.version}>Versão 1.0.0</Text>
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
  barbershopName: {
    fontSize: tokens.typography.size.md,
    color: tokens.color.brand.primary,
    fontWeight: '600',
    marginTop: tokens.spacing.xs,
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
  version: {
    textAlign: 'center',
    fontSize: tokens.typography.size.sm,
    color: tokens.text.secondary,
    marginTop: tokens.spacing.md,
  },
});
