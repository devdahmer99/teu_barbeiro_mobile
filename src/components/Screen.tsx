import React from 'react';
import {ActivityIndicator, SafeAreaView, StyleSheet, View} from 'react-native';

import {tokens} from '@/theme';

interface ScreenProps {
  children: React.ReactNode;
  loading?: boolean;
}

export function Screen({children, loading}: ScreenProps) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>{children}</View>
      {loading ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={tokens.color.brand.primary} />
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.surface.base,
  },
  content: {
    flex: 1,
    padding: tokens.spacing.lg,
    gap: tokens.spacing.md,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 6, 23, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
