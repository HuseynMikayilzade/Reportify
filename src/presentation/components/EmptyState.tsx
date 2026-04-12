// EmptyState Component
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing } from '../../theme';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon = '📋', title, subtitle, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      {actionLabel && onAction && (
        <Button
          label={actionLabel}
          onPress={onAction}
          variant="secondary"
          fullWidth={false}
          style={{ marginTop: Spacing.s4, paddingHorizontal: Spacing.s6 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.s10,
    paddingHorizontal: Spacing.s5,
  },
  icon: { fontSize: 44, marginBottom: Spacing.s4 },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.s2,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
