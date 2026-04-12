// StatCard component — dashboard metric tile
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius, Spacing } from '../../../../theme';

interface StatCardProps {
  value: string | number;
  label: string;
  delta?: string;
  positive?: boolean;
}

export function StatCard({ value, label, delta, positive = true }: StatCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {delta && (
        <Text style={[styles.delta, { color: positive ? Colors.success : Colors.warning }]}>
          {delta}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.overlay,
    borderWidth: 0.5,
    borderColor: Colors.borderSubtle,
    borderRadius: BorderRadius.lg,
    padding: Spacing.s3,
  },
  value: {
    fontSize: 22,
    fontWeight: '500',
    color: Colors.white,
  },
  label: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  delta: {
    fontSize: 11,
    marginTop: 4,
  },
});
