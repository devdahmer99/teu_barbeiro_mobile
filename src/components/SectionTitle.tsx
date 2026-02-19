import React from 'react';
import {StyleSheet, Text} from 'react-native';

import {tokens} from '@/theme';

export function SectionTitle({children}: {children: React.ReactNode}) {
  return <Text style={styles.title}>{children}</Text>;
}

const styles = StyleSheet.create({
  title: {
    color: tokens.text.primary,
    fontSize: tokens.typography.size.lg,
    fontWeight: '700',
    marginTop: tokens.spacing.sm,
  },
});
