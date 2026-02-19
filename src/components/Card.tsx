import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {tokens} from '@/theme';

interface CardProps {
  title: string;
  value: string;
}

export function Card({title, value}: CardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.surface.elevated,
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    borderColor: tokens.border.default,
    padding: tokens.spacing.lg,
    gap: tokens.spacing.sm,
  },
  title: {
    color: tokens.text.secondary,
    fontSize: tokens.typography.size.sm,
  },
  value: {
    color: tokens.text.primary,
    fontSize: tokens.typography.size.lg,
    fontWeight: '700',
  },
});
