import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Ionicons} from '@expo/vector-icons';

import {ClientHomeScreen} from '@/screens/client/ClientHomeScreen';
import {ClientAppointmentsScreen} from '@/screens/client/ClientAppointmentsScreen';
import {ClientServicesScreen} from '@/screens/client/ClientServicesScreen';
import {tokens} from '@/theme';

const Tab = createBottomTabNavigator();

export function ClientNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Appointments') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Services') {
            iconName = focused ? 'cut' : 'cut-outline';
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
        name="Home"
        component={ClientHomeScreen}
        options={{
          title: 'Início',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Appointments"
        component={ClientAppointmentsScreen}
        options={{
          title: 'Agendamentos',
        }}
      />
      <Tab.Screen
        name="Services"
        component={ClientServicesScreen}
        options={{
          title: 'Serviços',
        }}
      />
    </Tab.Navigator>
  );
}
