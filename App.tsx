import React from 'react';
import {NavigationContainer, DefaultTheme, Theme} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {AuthProvider} from '@/providers/AuthProvider';
import {AlertModalProvider} from '@/providers/AlertModalProvider';
import {RootNavigator} from '@/navigation/RootNavigator';
import {tokens} from '@/theme';

const navigationTheme: Theme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: tokens.surface.base,
    card: tokens.surface.elevated,
    text: tokens.text.primary,
    border: tokens.border.default,
    primary: tokens.color.brand.primary,
    notification: tokens.color.brand.primary,
  },
};

function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <AlertModalProvider>
          <AuthProvider>
            <NavigationContainer theme={navigationTheme}>
              <RootNavigator />
            </NavigationContainer>
          </AuthProvider>
        </AlertModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
