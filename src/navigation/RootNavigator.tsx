import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {LoginScreen} from '@/screens/auth/LoginScreen';
import {ClientNavigator} from './ClientNavigator';
import {BarberNavigator} from './BarberNavigator';
import {OwnerNavigator} from './OwnerNavigator';
import {useAuth} from '@/providers/AuthProvider';
import {tokens} from '@/theme';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  const {user, isLoading} = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={tokens.color.brand.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: tokens.surface.base,
        },
      }}>
      {!user ? (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{title: 'Acesso'}}
        />
      ) : null}

      {user?.role === 'client' ? (
        <Stack.Screen
          name="ClientApp"
          component={ClientNavigator}
        />
      ) : null}

      {user?.role === 'barber' ? (
        <Stack.Screen
          name="BarberApp"
          component={BarberNavigator}
        />
      ) : null}

      {user?.role === 'owner' ? (
        <Stack.Screen
          name="OwnerApp"
          component={OwnerNavigator}
        />
      ) : null}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: tokens.surface.base,
  },
});
