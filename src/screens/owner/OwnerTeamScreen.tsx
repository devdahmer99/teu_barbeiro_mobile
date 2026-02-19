import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

import {Screen} from '@/components/Screen';
import {tokens} from '@/theme';

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: 'barber' | 'manager';
  status: 'active' | 'inactive';
  phone?: string;
}

export function OwnerTeamScreen() {
  const [team, setTeam] = useState<TeamMember[]>([
    {
      id: 1,
      name: 'João Silva',
      email: 'joao@exemplo.com',
      role: 'barber',
      status: 'active',
      phone: '(11) 98765-4321',
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria@exemplo.com',
      role: 'barber',
      status: 'active',
      phone: '(11) 98765-1234',
    },
    {
      id: 3,
      name: 'Pedro Costa',
      email: 'pedro@exemplo.com',
      role: 'manager',
      status: 'inactive',
      phone: '(11) 98765-5678',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const loadTeam = useCallback(async () => {
    setRefreshing(false);
    setLoading(false);
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadTeam();
  }, [loadTeam]);

  const handleAddMember = () => {
    if (!newMember.name || !newMember.email) {
      Alert.alert('Atenção', 'Preencha nome e e-mail');
      return;
    }

    const member: TeamMember = {
      id: Date.now(),
      name: newMember.name,
      email: newMember.email,
      role: 'barber',
      status: 'active',
      phone: newMember.phone,
    };

    setTeam([...team, member]);
    setNewMember({name: '', email: '', phone: ''});
    setShowAddForm(false);
    Alert.alert('Sucesso', 'Membro adicionado à equipe!');
  };

  const handleRemoveMember = (id: number) => {
    Alert.alert(
      'Remover membro',
      'Tem certeza que deseja remover este membro da equipe?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            setTeam(team.filter(m => m.id !== id));
            Alert.alert('Sucesso', 'Membro removido da equipe');
          },
        },
      ],
    );
  };

  const toggleMemberStatus = (id: number) => {
    setTeam(
      team.map(m =>
        m.id === id
          ? {...m, status: m.status === 'active' ? 'inactive' : 'active'}
          : m,
      ),
    );
  };

  useEffect(() => {
    setLoading(true);
    loadTeam();
  }, [loadTeam]);

  const getRoleLabel = (role: string) => {
    return role === 'barber' ? 'Barbeiro' : 'Gerente';
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? tokens.color.state.success : tokens.text.secondary;
  };

  return (
    <Screen loading={loading}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
        <View style={styles.stats}>
          <View style={styles.statCard}>
            <Ionicons name="people" size={32} color={tokens.color.brand.primary} />
            <Text style={styles.statValue}>{team.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={32} color={tokens.color.state.success} />
            <Text style={styles.statValue}>
              {team.filter(m => m.status === 'active').length}
            </Text>
            <Text style={styles.statLabel}>Ativos</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="cut" size={32} color={tokens.color.brand.primary} />
            <Text style={styles.statValue}>
              {team.filter(m => m.role === 'barber').length}
            </Text>
            <Text style={styles.statLabel}>Barbeiros</Text>
          </View>
        </View>

        <Pressable
          style={styles.addButton}
          onPress={() => setShowAddForm(!showAddForm)}>
          <Ionicons
            name={showAddForm ? 'close' : 'add-circle'}
            size={24}
            color={tokens.color.brand.primary}
          />
          <Text style={styles.addButtonText}>
            {showAddForm ? 'Cancelar' : 'Adicionar membro'}
          </Text>
        </Pressable>

        {showAddForm && (
          <View style={styles.addForm}>
            <Text style={styles.formTitle}>Novo membro da equipe</Text>
            <TextInput
              style={styles.input}
              value={newMember.name}
              onChangeText={text => setNewMember({...newMember, name: text})}
              placeholder="Nome completo"
              placeholderTextColor={tokens.text.secondary}
            />
            <TextInput
              style={styles.input}
              value={newMember.email}
              onChangeText={text => setNewMember({...newMember, email: text})}
              placeholder="E-mail"
              placeholderTextColor={tokens.text.secondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              value={newMember.phone}
              onChangeText={text => setNewMember({...newMember, phone: text})}
              placeholder="Telefone (opcional)"
              placeholderTextColor={tokens.text.secondary}
              keyboardType="phone-pad"
            />
            <Pressable style={styles.submitButton} onPress={handleAddMember}>
              <Text style={styles.submitButtonText}>Adicionar à equipe</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Membros da equipe</Text>
          {team.map(member => (
            <View key={member.id} style={styles.memberCard}>
              <View style={styles.memberHeader}>
                <View style={styles.memberAvatar}>
                  <Ionicons
                    name={member.role === 'barber' ? 'cut' : 'briefcase'}
                    size={24}
                    color={tokens.text.primary}
                  />
                </View>
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberEmail}>{member.email}</Text>
                  {member.phone && (
                    <Text style={styles.memberPhone}>{member.phone}</Text>
                  )}
                </View>
                <View
                  style={[
                    styles.statusDot,
                    {backgroundColor: getStatusColor(member.status)},
                  ]}
                />
              </View>

              <View style={styles.memberFooter}>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleText}>{getRoleLabel(member.role)}</Text>
                </View>
                <View style={styles.memberActions}>
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => toggleMemberStatus(member.id)}>
                    <Ionicons
                      name={member.status === 'active' ? 'pause' : 'play'}
                      size={18}
                      color={tokens.text.secondary}
                    />
                  </Pressable>
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => handleRemoveMember(member.id)}>
                    <Ionicons name="trash-outline" size={18} color={tokens.color.state.error} />
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: tokens.spacing.md,
    gap: tokens.spacing.md,
  },
  stats: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: tokens.surface.elevated,
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    alignItems: 'center',
    gap: tokens.spacing.xs,
    borderWidth: 1,
    borderColor: tokens.border.default,
  },
  statValue: {
    fontSize: tokens.typography.size.xl,
    fontWeight: '700',
    color: tokens.text.primary,
  },
  statLabel: {
    fontSize: tokens.typography.size.sm,
    color: tokens.text.secondary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing.sm,
    padding: tokens.spacing.md,
    backgroundColor: tokens.surface.elevated,
    borderRadius: tokens.radius.md,
    borderWidth: 2,
    borderColor: tokens.color.brand.primary,
    borderStyle: 'dashed',
  },
  addButtonText: {
    color: tokens.color.brand.primary,
    fontWeight: '700',
    fontSize: tokens.typography.size.md,
  },
  addForm: {
    backgroundColor: tokens.surface.elevated,
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    gap: tokens.spacing.sm,
    borderWidth: 1,
    borderColor: tokens.border.default,
  },
  formTitle: {
    fontSize: tokens.typography.size.md,
    fontWeight: '700',
    color: tokens.text.primary,
    marginBottom: tokens.spacing.xs,
  },
  input: {
    backgroundColor: tokens.surface.base,
    borderWidth: 1,
    borderColor: tokens.border.default,
    borderRadius: tokens.radius.sm,
    padding: tokens.spacing.sm,
    fontSize: tokens.typography.size.md,
    color: tokens.text.primary,
  },
  submitButton: {
    backgroundColor: tokens.color.brand.primary,
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.sm,
    alignItems: 'center',
    marginTop: tokens.spacing.xs,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: tokens.typography.size.md,
  },
  section: {
    gap: tokens.spacing.sm,
  },
  sectionTitle: {
    fontSize: tokens.typography.size.sm,
    fontWeight: '700',
    color: tokens.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: tokens.spacing.sm,
  },
  memberCard: {
    backgroundColor: tokens.surface.elevated,
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.md,
    gap: tokens.spacing.md,
    borderWidth: 1,
    borderColor: tokens.border.default,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: tokens.surface.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: tokens.typography.size.md,
    fontWeight: '700',
    color: tokens.text.primary,
  },
  memberEmail: {
    fontSize: tokens.typography.size.sm,
    color: tokens.text.secondary,
    marginTop: 2,
  },
  memberPhone: {
    fontSize: tokens.typography.size.sm,
    color: tokens.text.secondary,
    marginTop: 2,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  memberFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roleBadge: {
    backgroundColor: tokens.surface.base,
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: 4,
    borderRadius: tokens.radius.sm,
  },
  roleText: {
    fontSize: tokens.typography.size.sm,
    color: tokens.text.secondary,
    fontWeight: '600',
  },
  memberActions: {
    flexDirection: 'row',
    gap: tokens.spacing.xs,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: tokens.surface.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
