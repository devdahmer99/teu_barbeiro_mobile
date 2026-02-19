import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Ionicons} from '@expo/vector-icons';

import {OwnerDashboardScreen} from '@/screens/owner/OwnerDashboardScreen';
import {OwnerAppointmentsScreen} from '@/screens/owner/OwnerAppointmentsScreen';
import {OwnerCreateAppointmentScreen} from '@/screens/owner/OwnerCreateAppointmentScreen';
import {OwnerSettingsScreen} from '@/screens/owner/OwnerSettingsScreen';
import {OwnerProfileScreen} from '@/screens/owner/OwnerProfileScreen';
import {OwnerBarbershopScreen} from '@/screens/owner/OwnerBarbershopScreen';
import {OwnerTeamScreen} from '@/screens/owner/OwnerTeamScreen';
import {OwnerServicesScreen} from '@/screens/owner/OwnerServicesScreen';
import {OwnerNotificationsScreen} from '@/screens/owner/OwnerNotificationsScreen';
import {tokens} from '@/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AppointmentsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: tokens.surface.elevated,
        },
        headerTintColor: tokens.text.primary,
        headerTitleStyle: {
          fontWeight: '700',
        },
      }}>
      <Stack.Screen
        name="AppointmentsList"
        component={OwnerAppointmentsScreen}
        options={{title: 'Agendamentos'}}
      />
      <Stack.Screen
        name="NewAppointment"
        component={OwnerCreateAppointmentScreen}
        options={{title: 'Novo agendamento'}}
      />
    </Stack.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: tokens.surface.elevated,
        },
        headerTintColor: tokens.text.primary,
        headerTitleStyle: {
          fontWeight: '700',
        },
      }}>
      <Stack.Screen
        name="SettingsMain"
        component={OwnerSettingsScreen}
        options={{title: 'Configurações'}}
      />
      <Stack.Screen
        name="Profile"
        component={OwnerProfileScreen}
        options={{title: 'Meu Perfil'}}
      />
      <Stack.Screen
        name="Barbershop"
        component={OwnerBarbershopScreen}
        options={{title: 'Barbearia'}}
      />
      <Stack.Screen
        name="Team"
        component={OwnerTeamScreen}
        options={{title: 'Equipe'}}
      />
      <Stack.Screen
        name="Services"
        component={OwnerServicesScreen}
        options={{title: 'Serviços'}}
      />
      <Stack.Screen
        name="Notifications"
        component={OwnerNotificationsScreen}
        options={{title: 'Notificações'}}
      />
    </Stack.Navigator>
  );
}

export function OwnerNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Dashboard') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Appointments') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: tokens.color.brand.primary,
        tabBarInactiveTintColor: tokens.text.secondary,
        tabBarStyle: {
          backgroundColor: tokens.surface.elevated,
          borderTopColor: tokens.border.default,
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: tokens.surface.elevated,
        },
        headerTintColor: tokens.text.primary,
        headerTitleStyle: {
          fontWeight: '700',
        },
      })}>
      <Tab.Screen
        name="Dashboard"
        component={OwnerDashboardScreen}
        options={{
          title: 'Dashboard',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Appointments"
        component={AppointmentsStack}
        options={{
          title: 'Agendamentos',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{
          title: 'Configurações',
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}
