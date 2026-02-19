import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

import {Screen} from '@/components/Screen';
import {tokens} from '@/theme';

interface Service {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
  active: boolean;
}

export function OwnerServicesScreen() {
  const [services, setServices] = useState<Service[]>([
    {
      id: 1,
      name: 'Corte Tradicional',
      description: 'Corte clássico com máquina e tesoura',
      duration: 30,
      price: 35.0,
      active: true,
    },
    {
      id: 2,
      name: 'Barba Completa',
      description: 'Barba feita com navalha e toalha quente',
      duration: 45,
      price: 40.0,
      active: true,
    },
    {
      id: 3,
      name: 'Corte + Barba',
      description: 'Combo completo de corte e barba',
      duration: 60,
      price: 65.0,
      active: true,
    },
    {
      id: 4,
      name: 'Platinado',
      description: 'Descoloração completa',
      duration: 120,
      price: 150.0,
      active: false,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    duration: '',
    price: '',
  });

  const loadServices = useCallback(async () => {
    setRefreshing(false);
    setLoading(false);
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadServices();
  }, [loadServices]);

  const handleAddService = () => {
    if (!newService.name || !newService.duration || !newService.price) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios');
      return;
    }

    const service: Service = {
      id: Date.now(),
      name: newService.name,
      description: newService.description,
      duration: parseInt(newService.duration),
      price: parseFloat(newService.price),
      active: true,
    };

    setServices([...services, service]);
    setNewService({name: '', description: '', duration: '', price: ''});
    setShowAddForm(false);
    Alert.alert('Sucesso', 'Serviço adicionado com sucesso!');
  };

  const handleRemoveService = (id: number) => {
    Alert.alert(
      'Remover serviço',
      'Tem certeza que deseja remover este serviço?',
      [
        {text: 'Cancelar', style: 'cancel'},
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            setServices(services.filter(s => s.id !== id));
            Alert.alert('Sucesso', 'Serviço removido');
          },
        },
      ],
    );
  };

  const toggleServiceStatus = (id: number) => {
    setServices(
      services.map(s => (s.id === id ? {...s, active: !s.active} : s)),
    );
  };

  useEffect(() => {
    setLoading(true);
    loadServices();
  }, [loadServices]);

  return (
    <Screen loading={loading}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
        <View style={styles.stats}>
          <View style={styles.statCard}>
            <Ionicons name="cut" size={32} color={tokens.color.brand.primary} />
            <Text style={styles.statValue}>{services.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={32} color={tokens.color.state.success} />
            <Text style={styles.statValue}>
              {services.filter(s => s.active).length}
            </Text>
            <Text style={styles.statLabel}>Ativos</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="cash" size={32} color={tokens.color.brand.primary} />
            <Text style={styles.statValue}>
              R$ {Math.round(services.filter(s => s.active).reduce((acc, s) => acc + s.price, 0))}
            </Text>
            <Text style={styles.statLabel}>Receita</Text>
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
            {showAddForm ? 'Cancelar' : 'Adicionar serviço'}
          </Text>
        </Pressable>

        {showAddForm && (
          <View style={styles.addForm}>
            <Text style={styles.formTitle}>Novo serviço</Text>
            <TextInput
              style={styles.input}
              value={newService.name}
              onChangeText={text => setNewService({...newService, name: text})}
              placeholder="Nome do serviço *"
              placeholderTextColor={tokens.text.secondary}
            />
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              value={newService.description}
              onChangeText={text => setNewService({...newService, description: text})}
              placeholder="Descrição"
              placeholderTextColor={tokens.text.secondary}
              multiline
              numberOfLines={2}
            />
            <View style={styles.row}>
              <TextInput
                style={[styles.input, {flex: 1}]}
                value={newService.duration}
                onChangeText={text => setNewService({...newService, duration: text})}
                placeholder="Duração (min) *"
                placeholderTextColor={tokens.text.secondary}
                keyboardType="number-pad"
              />
              <TextInput
                style={[styles.input, {flex: 1}]}
                value={newService.price}
                onChangeText={text => setNewService({...newService, price: text})}
                placeholder="Preço (R$) *"
                placeholderTextColor={tokens.text.secondary}
                keyboardType="decimal-pad"
              />
            </View>
            <Pressable style={styles.submitButton} onPress={handleAddService}>
              <Text style={styles.submitButtonText}>Adicionar serviço</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Serviços cadastrados</Text>
          {services.map(service => (
            <View key={service.id} style={styles.serviceCard}>
              <View style={styles.serviceHeader}>
                <View style={styles.serviceIcon}>
                  <Ionicons name="cut-outline" size={28} color={tokens.color.brand.primary} />
                </View>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  {service.description && (
                    <Text style={styles.serviceDescription}>{service.description}</Text>
                  )}
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: service.active
                        ? tokens.color.state.success
                        : tokens.text.secondary,
                    },
                  ]}>
                  <Text style={styles.statusText}>
                    {service.active ? 'Ativo' : 'Inativo'}
                  </Text>
                </View>
              </View>

              <View style={styles.serviceDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="time-outline" size={16} color={tokens.text.secondary} />
                  <Text style={styles.detailText}>{service.duration} min</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="cash-outline" size={16} color={tokens.text.secondary} />
                  <Text style={styles.detailText}>R$ {service.price.toFixed(2)}</Text>
                </View>
              </View>

              <View style={styles.serviceActions}>
                <Pressable
                  style={[styles.actionButton, styles.actionButtonSecondary]}
                  onPress={() => toggleServiceStatus(service.id)}>
                  <Ionicons
                    name={service.active ? 'pause' : 'play'}
                    size={18}
                    color={tokens.text.primary}
                  />
                  <Text style={styles.actionButtonText}>
                    {service.active ? 'Desativar' : 'Ativar'}
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.actionButton, styles.actionButtonDanger]}
                  onPress={() => handleRemoveService(service.id)}>
                  <Ionicons name="trash-outline" size={18} color={tokens.color.state.error} />
                  <Text style={styles.actionButtonDangerText}>Remover</Text>
                </Pressable>
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
  inputMultiline: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
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
  serviceCard: {
    backgroundColor: tokens.surface.elevated,
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.md,
    gap: tokens.spacing.md,
    borderWidth: 1,
    borderColor: tokens.border.default,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: tokens.spacing.sm,
  },
  serviceIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: tokens.surface.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: tokens.typography.size.md,
    fontWeight: '700',
    color: tokens.text.primary,
  },
  serviceDescription: {
    fontSize: tokens.typography.size.sm,
    color: tokens.text.secondary,
    marginTop: 4,
    lineHeight: 18,
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
  serviceDetails: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: tokens.typography.size.sm,
    color: tokens.text.secondary,
  },
  serviceActions: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing.xs,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.radius.sm,
  },
  actionButtonSecondary: {
    backgroundColor: tokens.surface.base,
    borderWidth: 1,
    borderColor: tokens.border.default,
  },
  actionButtonText: {
    color: tokens.text.primary,
    fontWeight: '600',
    fontSize: tokens.typography.size.sm,
  },
  actionButtonDanger: {
    backgroundColor: tokens.surface.base,
    borderWidth: 1,
    borderColor: tokens.color.state.error,
  },
  actionButtonDangerText: {
    color: tokens.color.state.error,
    fontWeight: '600',
    fontSize: tokens.typography.size.sm,
  },
});
