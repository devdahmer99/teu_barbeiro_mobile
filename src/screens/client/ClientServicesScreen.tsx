import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

import {getBarbers, getServices} from '@/api/modules/client';
import {Screen} from '@/components/Screen';
import {tokens} from '@/theme';
import {Barber, Service} from '@/types/appointment';

export function ClientServicesScreen() {
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [servicesData, barbersData] = await Promise.all([
        getServices(),
        getBarbers(),
      ]);
      setServices(Array.isArray(servicesData) ? servicesData : []);
      setBarbers(Array.isArray(barbersData) ? barbersData : []);
    } catch (error) {
      console.error('Error loading services:', error);
      Alert.alert('Erro', 'Não foi possível carregar os serviços.');
      setServices([]);
      setBarbers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleBookService = (service: Service) => {
    Alert.alert(
      'Agendar Serviço',
      `Agendar: ${service.name}`,
      [{text: 'OK'}],
    );
  };

  return (
    <Screen loading={loading}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="cut" size={24} color={tokens.color.brand.primary} />
            <Text style={styles.sectionTitle}>Serviços Disponíveis</Text>
          </View>

          {services.length > 0 ? (
            services.map(service => (
              <View key={service.id} style={styles.serviceCard}>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  {service.description && (
                    <Text style={styles.serviceDescription}>
                      {service.description}
                    </Text>
                  )}
                  <View style={styles.serviceDetails}>
                    {service.duration && (
                      <View style={styles.detailRow}>
                        <Ionicons
                          name="time-outline"
                          size={14}
                          color={tokens.text.secondary}
                        />
                        <Text style={styles.detailText}>{service.duration} min</Text>
                      </View>
                    )}
                    {service.price && (
                      <View style={styles.detailRow}>
                        <Ionicons
                          name="cash-outline"
                          size={14}
                          color={tokens.text.secondary}
                        />
                        <Text style={styles.detailText}>
                          R$ {typeof service.price === 'number' 
                            ? service.price.toFixed(2) 
                            : parseFloat(service.price).toFixed(2)}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                <Pressable
                  style={styles.bookButton}
                  onPress={() => handleBookService(service)}>
                  <Text style={styles.bookButtonText}>Agendar</Text>
                </Pressable>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Nenhum serviço disponível</Text>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="people" size={24} color={tokens.color.brand.primary} />
            <Text style={styles.sectionTitle}>Nossos Barbeiros</Text>
          </View>

          {barbers.length > 0 ? (
            barbers.map(barber => (
              <View key={barber.id} style={styles.barberCard}>
                <View style={styles.barberAvatar}>
                  <Ionicons name="person" size={32} color={tokens.text.primary} />
                </View>
                <View style={styles.barberInfo}>
                  <Text style={styles.barberName}>{barber.name}</Text>
                  {barber.specialty && (
                    <Text style={styles.barberSpecialty}>{barber.specialty}</Text>
                  )}
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={tokens.text.secondary}
                />
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Nenhum barbeiro disponível</Text>
          )}
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
  section: {
    gap: tokens.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    marginBottom: tokens.spacing.xs,
  },
  sectionTitle: {
    fontSize: tokens.typography.size.lg,
    fontWeight: '700',
    color: tokens.text.primary,
  },
  serviceCard: {
    backgroundColor: tokens.surface.elevated,
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.md,
    borderWidth: 1,
    borderColor: tokens.border.default,
    gap: tokens.spacing.md,
  },
  serviceInfo: {
    gap: tokens.spacing.xs,
  },
  serviceName: {
    fontSize: tokens.typography.size.md,
    fontWeight: '700',
    color: tokens.text.primary,
  },
  serviceDescription: {
    fontSize: tokens.typography.size.sm,
    color: tokens.text.secondary,
    lineHeight: 20,
  },
  serviceDetails: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
    marginTop: tokens.spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: tokens.typography.size.sm,
    color: tokens.text.secondary,
  },
  bookButton: {
    backgroundColor: tokens.color.brand.primary,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.radius.sm,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: tokens.typography.size.sm,
  },
  barberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.surface.elevated,
    borderRadius: tokens.radius.md,
    padding: tokens.spacing.md,
    borderWidth: 1,
    borderColor: tokens.border.default,
    gap: tokens.spacing.md,
  },
  barberAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: tokens.surface.base,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barberInfo: {
    flex: 1,
    gap: 4,
  },
  barberName: {
    fontSize: tokens.typography.size.md,
    fontWeight: '700',
    color: tokens.text.primary,
  },
  barberSpecialty: {
    fontSize: tokens.typography.size.sm,
    color: tokens.text.secondary,
  },
  emptyText: {
    fontSize: tokens.typography.size.sm,
    color: tokens.text.secondary,
    textAlign: 'center',
    paddingVertical: tokens.spacing.lg,
    fontStyle: 'italic',
  },
});
