import React, {useState} from 'react';
import {Pressable, ScrollView, StyleSheet, Switch, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

import {Screen} from '@/components/Screen';
import {tokens} from '@/theme';

export function OwnerNotificationsScreen() {
  const [settings, setSettings] = useState({
    newAppointments: true,
    appointmentConfirmed: true,
    appointmentCancelled: true,
    appointmentReminder: true,
    dailySummary: false,
    weeklySummary: true,
    newTeamMember: true,
    teamMemberUpdate: false,
    newReview: true,
    lowRating: true,
    systemUpdates: false,
    promotions: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings({...settings, [key]: !settings[key]});
  };

  const notificationGroups = [
    {
      title: 'Agendamentos',
      icon: 'calendar' as const,
      settings: [
        {
          key: 'newAppointments' as const,
          label: 'Novos agendamentos',
          description: 'Receba notificações de novos agendamentos',
        },
        {
          key: 'appointmentConfirmed' as const,
          label: 'Confirmações',
          description: 'Quando um agendamento for confirmado',
        },
        {
          key: 'appointmentCancelled' as const,
          label: 'Cancelamentos',
          description: 'Quando um agendamento for cancelado',
        },
        {
          key: 'appointmentReminder' as const,
          label: 'Lembretes',
          description: 'Lembretes de agendamentos próximos',
        },
      ],
    },
    {
      title: 'Resumos',
      icon: 'stats-chart' as const,
      settings: [
        {
          key: 'dailySummary' as const,
          label: 'Resumo diário',
          description: 'Resumo dos agendamentos do dia',
        },
        {
          key: 'weeklySummary' as const,
          label: 'Resumo semanal',
          description: 'Resumo semanal de desempenho',
        },
      ],
    },
    {
      title: 'Equipe',
      icon: 'people' as const,
      settings: [
        {
          key: 'newTeamMember' as const,
          label: 'Novo membro',
          description: 'Quando um novo membro entrar na equipe',
        },
        {
          key: 'teamMemberUpdate' as const,
          label: 'Atualizações',
          description: 'Mudanças no status dos membros',
        },
      ],
    },
    {
      title: 'Avaliações',
      icon: 'star' as const,
      settings: [
        {
          key: 'newReview' as const,
          label: 'Novas avaliações',
          description: 'Quando receber uma nova avaliação',
        },
        {
          key: 'lowRating' as const,
          label: 'Avaliações baixas',
          description: 'Alerta para avaliações abaixo de 3 estrelas',
        },
      ],
    },
    {
      title: 'Geral',
      icon: 'notifications' as const,
      settings: [
        {
          key: 'systemUpdates' as const,
          label: 'Atualizações do sistema',
          description: 'Novidades e atualizações do app',
        },
        {
          key: 'promotions' as const,
          label: 'Promoções',
          description: 'Ofertas e dicas para seu negócio',
        },
      ],
    },
  ];

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Ionicons name="notifications" size={40} color={tokens.color.brand.primary} />
          <Text style={styles.headerTitle}>Configurações de Notificações</Text>
          <Text style={styles.headerSubtitle}>
            Personalize como e quando você quer ser notificado
          </Text>
        </View>

        {notificationGroups.map((group, index) => (
          <View key={index} style={styles.group}>
            <View style={styles.groupHeader}>
              <Ionicons name={group.icon} size={24} color={tokens.color.brand.primary} />
              <Text style={styles.groupTitle}>{group.title}</Text>
            </View>

            {group.settings.map((setting, settingIndex) => (
              <View key={settingIndex} style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>{setting.label}</Text>
                  <Text style={styles.settingDescription}>{setting.description}</Text>
                </View>
                <Switch
                  value={settings[setting.key]}
                  onValueChange={() => toggleSetting(setting.key)}
                  trackColor={{
                    false: tokens.text.secondary,
                    true: tokens.color.brand.primary,
                  }}
                />
              </View>
            ))}
          </View>
        ))}

        <View style={styles.actions}>
          <Pressable style={styles.actionButton}>
            <Ionicons name="volume-mute" size={20} color={tokens.text.primary} />
            <Text style={styles.actionButtonText}>Silenciar por 1 hora</Text>
          </Pressable>

          <Pressable style={styles.actionButton}>
            <Ionicons name="moon" size={20} color={tokens.text.primary} />
            <Text style={styles.actionButtonText}>Modo silencioso (22h - 8h)</Text>
          </Pressable>

          <Pressable style={[styles.actionButton, styles.actionButtonDanger]}>
            <Ionicons name="close-circle" size={20} color={tokens.color.state.error} />
            <Text style={styles.actionButtonDangerText}>Desativar todas</Text>
          </Pressable>
        </View>

        <View style={styles.info}>
          <Ionicons name="information-circle" size={20} color={tokens.text.secondary} />
          <Text style={styles.infoText}>
            As notificações críticas (como cancelamentos) sempre serão enviadas,
            independente das configurações.
          </Text>
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
  header: {
    alignItems: 'center',
    gap: tokens.spacing.xs,
    paddingVertical: tokens.spacing.md,
  },
  headerTitle: {
    fontSize: tokens.typography.size.lg,
    fontWeight: '700',
    color: tokens.text.primary,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: tokens.typography.size.sm,
    color: tokens.text.secondary,
    textAlign: 'center',
  },
  group: {
    gap: tokens.spacing.xs,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.sm,
  },
  groupTitle: {
    fontSize: tokens.typography.size.md,
    fontWeight: '700',
    color: tokens.text.primary,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: tokens.surface.elevated,
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.border.default,
    gap: tokens.spacing.md,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: tokens.typography.size.md,
    fontWeight: '600',
    color: tokens.text.primary,
  },
  settingDescription: {
    fontSize: tokens.typography.size.sm,
    color: tokens.text.secondary,
    marginTop: 2,
  },
  actions: {
    gap: tokens.spacing.sm,
    marginTop: tokens.spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing.sm,
    padding: tokens.spacing.md,
    backgroundColor: tokens.surface.elevated,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.border.default,
  },
  actionButtonText: {
    color: tokens.text.primary,
    fontWeight: '600',
    fontSize: tokens.typography.size.md,
  },
  actionButtonDanger: {
    borderColor: tokens.color.state.error,
  },
  actionButtonDangerText: {
    color: tokens.color.state.error,
    fontWeight: '600',
    fontSize: tokens.typography.size.md,
  },
  info: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
    padding: tokens.spacing.md,
    backgroundColor: tokens.surface.elevated,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.border.default,
  },
  infoText: {
    flex: 1,
    fontSize: tokens.typography.size.sm,
    color: tokens.text.secondary,
    lineHeight: 20,
  },
});
