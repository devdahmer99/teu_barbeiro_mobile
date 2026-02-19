import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';

import {BarberDashboardScreen} from '@/screens/barber/BarberDashboardScreen';
import {BarberAppointmentsScreen} from '@/screens/barber/BarberAppointmentsScreen';
import {BarberProfileScreen} from '@/screens/barber/BarberProfileScreen';
import {tokens} from '@/theme';

const Tab = createBottomTabNavigator();

export function BarberNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Dashboard') {
            iconName = focused ? 'cut' : 'cut-outline';
          } else if (route.name === 'Appointments') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
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
        component={BarberDashboardScreen}
        options={{
          title: 'Minha Agenda',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Appointments"
        component={BarberAppointmentsScreen}
        options={{
          title: 'Agendamentos',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={BarberProfileScreen}
        options={{
          title: 'Perfil',
        }}
      />
    </Tab.Navigator>
  );
}
