import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

import {createOwnerAppointment, getOwnerClients, getOwnerServices} from '@/api/modules/owner';
import {getBarbers} from '@/api/modules/client';
import {useAlertModal} from '@/components/AlertModal';
import {Screen} from '@/components/Screen';
import {tokens} from '@/theme';
import {Barber, Service} from '@/types/appointment';
import {OwnerClient} from '@/api/modules/owner';

interface FormState {
  clientId: number | null;
  clientSearchText: string;
  serviceId: number | null;
  barberId: number | null;
  date: string;
  time: string;
  notes: string;
}

export function OwnerCreateAppointmentScreen() {
  const showAlert = useAlertModal();
  const [loading, setLoading] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [clients, setClients] = useState<OwnerClient[]>([]);
  const [filteredClients, setFilteredClients] = useState<OwnerClient[]>([]);
  const [showClientModal, setShowClientModal] = useState(false);
  const [form, setForm] = useState<FormState>({
    clientId: null,
    clientSearchText: '',
    serviceId: null,
    barberId: null,
    date: '',
    time: '',
    notes: '',
  });

  const loadOptions = useCallback(async () => {
    try {
      const [servicesData, barbersData, clientsData] = await Promise.all([
        getOwnerServices(),
        getBarbers(),
        getOwnerClients(),
      ]);
      setServices(Array.isArray(servicesData) ? servicesData : []);
      setBarbers(Array.isArray(barbersData) ? barbersData : []);
      setClients(Array.isArray(clientsData) ? clientsData : []);
    } catch (error) {
      console.error('Error loading appointment options:', error);
      showAlert({
        title: 'Erro',
        message: 'Não foi possível carregar opções de serviços, barbeiros e clientes.',
        type: 'error',
      });
    } finally {
      setOptionsLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  const handleClientSearch = (text: string) => {
    setForm(current => ({
      ...current,
      clientSearchText: text,
    }));
    
    if (text.trim().length === 0) {
      setFilteredClients([]);
    } else {
      const lowerText = text.toLowerCase();
      const filtered = clients.filter(c => 
        c.name.toLowerCase().includes(lowerText)
      );
      setFilteredClients(filtered);
    }
  };

  const selectClient = (client: OwnerClient) => {
    setForm(current => ({
      ...current,
      clientId: client.id,
      clientSearchText: client.name,
    }));
    setShowClientModal(false);
    setFilteredClients([]);
  };

  const handleChange = (key: keyof FormState, value: string | number | null) => {
    setForm(current => ({...current, [key]: value}));
  };

  const handleSubmit = async () => {
    if (!form.clientId || !form.serviceId || !form.barberId || !form.date || !form.time) {
      showAlert({
        title: 'Campos obrigatórios',
        message: 'Preencha cliente, serviço, barbeiro, data e horário.',
        type: 'warning',
      });
      return;
    }

    setLoading(true);
    try {
      await createOwnerAppointment({
        client_id: form.clientId,
        service_id: form.serviceId,
        barber_id: form.barberId,
        date: form.date.trim(),
        start_time: form.time.trim(),
        notes: form.notes.trim() || undefined,
      });

      showAlert({
        title: 'Agendamento criado',
        message: 'O agendamento foi salvo com sucesso.',
        type: 'success',
      });

      setForm({
        clientId: null,
        clientSearchText: '',
        serviceId: null,
        barberId: null,
        date: '',
        time: '',
        notes: '',
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
      showAlert({
        title: 'Erro ao salvar',
        message: 'Não foi possível criar o agendamento.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedService = services.find(s => s.id === form.serviceId);
  const selectedBarber = barbers.find(b => b.id === form.barberId);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Cliente */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cliente</Text>
          <Pressable
            style={styles.clientInputButton}
            onPress={() => setShowClientModal(true)}>
            <Ionicons 
              name="search" 
              size={20} 
              color={form.clientId ? tokens.text.primary : tokens.text.secondary}
            />
            <Text
              style={[
                styles.clientInputText,
                !form.clientId && styles.clientInputPlaceholder,
              ]}>
              {form.clientSearchText || 'Buscar cliente por nome...'}
            </Text>
            {form.clientId && (
              <Pressable onPress={() => handleChange('clientId', null)}>
                <Ionicons name="close" size={20} color={tokens.text.secondary} />
              </Pressable>
            )}
          </Pressable>

          <Modal visible={showClientModal} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modal}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Selecionar Cliente</Text>
                  <Pressable onPress={() => setShowClientModal(false)}>
                    <Ionicons name="close" size={24} color={tokens.text.primary} />
                  </Pressable>
                </View>

                <TextInput
                  style={styles.modalSearchInput}
                  placeholder="Digite o nome do cliente..."
                  placeholderTextColor={tokens.text.secondary}
                  value={form.clientSearchText}
                  onChangeText={handleClientSearch}
                  autoFocus
                />

                <ScrollView style={styles.modalList}>
                  {filteredClients.length > 0 ? (
                    filteredClients.map(client => (
                      <Pressable
                        key={client.id}
                        style={styles.clientOption}
                        onPress={() => selectClient(client)}>
                        <View style={styles.clientOptionContent}>
                          <Text style={styles.clientOptionName}>{client.name}</Text>
                          {client.phone_number && (
                            <Text style={styles.clientOptionMeta}>
                              {client.phone_number}
                            </Text>
                          )}
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={tokens.text.secondary} />
                      </Pressable>
                    ))
                  ) : (
                    <View style={styles.emptySearch}>
                      <Ionicons name="person" size={40} color={tokens.text.secondary} />
                      <Text style={styles.emptySearchText}>
                        {form.clientSearchText ? 'Nenhum cliente encontrado' : 'Digite para buscar clientes'}
                      </Text>
                    </View>
                  )}
                </ScrollView>
              </View>
            </View>
          </Modal>
        </View>

        {/* Serviço */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Serviço</Text>
          {optionsLoading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color={tokens.color.brand.primary} />
              <Text style={styles.loadingText}>Carregando serviços...</Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.servicesList}>
              {services.map(service => (
                <Pressable
                  key={service.id}
                  style={[
                    styles.serviceCard,
                    form.serviceId === service.id && styles.serviceCardActive,
                  ]}
                  onPress={() => handleChange('serviceId', service.id)}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceInfo}>
                    {service.duration_minutes ?? service.duration ?? 0} min
                  </Text>
                  <Text style={styles.servicePrice}>
                    R$ {service.price ?? '--'}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          )}
          {selectedService && (
            <View style={styles.selectedInfo}>
              <Ionicons name="checkmark-circle" size={16} color={tokens.color.state.success} />
              <Text style={styles.selectedInfoText}>
                {selectedService.name}
              </Text>
            </View>
          )}
        </View>

        {/* Barbeiro */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Barbeiro</Text>
          {optionsLoading ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color={tokens.color.brand.primary} />
              <Text style={styles.loadingText}>Carregando barbeiros...</Text>
            </View>
          ) : (
            <View style={styles.optionsList}>
              {barbers.map(barber => (
                <Pressable
                  key={barber.id}
                  style={[
                    styles.optionCard,
                    form.barberId === barber.id && styles.optionCardActive,
                  ]}
                  onPress={() => handleChange('barberId', barber.id)}>
                  <Text style={styles.optionTitle}>{barber.name}</Text>
                  {form.barberId === barber.id ? (
                    <Ionicons name="checkmark-circle" size={20} color={tokens.color.brand.primary} />
                  ) : null}
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Data e Horário */}
        <View style={styles.row}>
          <View style={styles.flexOne}>
            <Text style={styles.sectionTitle}>Data</Text>
            <TextInput
              style={styles.input}
              value={form.date}
              onChangeText={value => handleChange('date', value)}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={tokens.text.secondary}
            />
          </View>
          <View style={styles.flexOne}>
            <Text style={styles.sectionTitle}>Horário</Text>
            <TextInput
              style={styles.input}
              value={form.time}
              onChangeText={value => handleChange('time', value)}
              placeholder="HH:mm"
              placeholderTextColor={tokens.text.secondary}
            />
          </View>
        </View>

        {/* Observações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Observações</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            value={form.notes}
            onChangeText={value => handleChange('notes', value)}
            placeholder="Observações opcionais"
            placeholderTextColor={tokens.text.secondary}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Botão Submit */}
        <Pressable
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Salvar agendamento</Text>
          )}
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: tokens.spacing.md,
    paddingBottom: tokens.spacing.xl,
    gap: tokens.spacing.lg,
  },
  section: {
    gap: tokens.spacing.sm,
  },
  sectionTitle: {
    fontSize: tokens.typography.size.sm,
    fontWeight: '700',
    color: tokens.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  clientInputButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    backgroundColor: tokens.surface.elevated,
    borderWidth: 1,
    borderColor: tokens.border.default,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.md,
  },
  clientInputText: {
    flex: 1,
    fontSize: tokens.typography.size.md,
    color: tokens.text.primary,
  },
  clientInputPlaceholder: {
    color: tokens.text.secondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: tokens.surface.base,
    borderTopLeftRadius: tokens.radius.lg,
    borderTopRightRadius: tokens.radius.lg,
    maxHeight: '90%',
    paddingBottom: tokens.spacing.md,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.border.default,
  },
  modalTitle: {
    fontSize: tokens.typography.size.lg,
    fontWeight: '700',
    color: tokens.text.primary,
  },
  modalSearchInput: {
    margin: tokens.spacing.md,
    backgroundColor: tokens.surface.elevated,
    borderWidth: 1,
    borderColor: tokens.border.default,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    fontSize: tokens.typography.size.md,
    color: tokens.text.primary,
  },
  modalList: {
    maxHeight: 300,
  },
  clientOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.border.default,
  },
  clientOptionContent: {
    flex: 1,
  },
  clientOptionName: {
    fontSize: tokens.typography.size.md,
    fontWeight: '600',
    color: tokens.text.primary,
  },
  clientOptionMeta: {
    fontSize: tokens.typography.size.sm,
    color: tokens.text.secondary,
    marginTop: 2,
  },
  emptySearch: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: tokens.spacing.xl,
    gap: tokens.spacing.sm,
  },
  emptySearchText: {
    color: tokens.text.secondary,
    fontSize: tokens.typography.size.md,
  },
  servicesList: {
    gap: tokens.spacing.sm,
  },
  serviceCard: {
    backgroundColor: tokens.surface.elevated,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.border.default,
    padding: tokens.spacing.md,
    marginRight: tokens.spacing.sm,
    minWidth: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceCardActive: {
    borderColor: tokens.color.brand.primary,
    borderWidth: 2,
  },
  serviceName: {
    fontSize: tokens.typography.size.sm,
    fontWeight: '600',
    color: tokens.text.primary,
    textAlign: 'center',
    marginBottom: tokens.spacing.xs,
  },
  serviceInfo: {
    fontSize: tokens.typography.size.xs,
    color: tokens.text.secondary,
    marginBottom: tokens.spacing.xs,
  },
  servicePrice: {
    fontSize: tokens.typography.size.sm,
    fontWeight: '700',
    color: tokens.color.brand.primary,
  },
  selectedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.xs,
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.md,
    backgroundColor: `${tokens.color.state.success}20`,
    borderRadius: tokens.radius.md,
  },
  selectedInfoText: {
    fontSize: tokens.typography.size.sm,
    color: tokens.color.state.success,
    fontWeight: '600',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    paddingVertical: tokens.spacing.sm,
  },
  loadingText: {
    color: tokens.text.secondary,
  },
  optionsList: {
    gap: tokens.spacing.sm,
  },
  optionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: tokens.spacing.md,
    backgroundColor: tokens.surface.elevated,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.border.default,
  },
  optionCardActive: {
    borderColor: tokens.color.brand.primary,
  },
  optionTitle: {
    fontSize: tokens.typography.size.md,
    fontWeight: '600',
    color: tokens.text.primary,
  },
  input: {
    backgroundColor: tokens.surface.elevated,
    borderWidth: 1,
    borderColor: tokens.border.default,
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.md,
    fontSize: tokens.typography.size.md,
    color: tokens.text.primary,
  },
  inputMultiline: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
  },
  flexOne: {
    flex: 1,
    gap: tokens.spacing.sm,
  },
  submitButton: {
    backgroundColor: tokens.color.brand.primary,
    borderRadius: tokens.radius.md,
    paddingVertical: tokens.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: tokens.typography.size.md,
  },
});
