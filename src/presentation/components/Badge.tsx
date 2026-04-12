// Badge Component — status and role badges
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius } from '../../theme';

export type BadgeVariant = 'synced' | 'pending' | 'failed' | 'employee' | 'admin' | 'superAdmin';

const config: Record<BadgeVariant, { bg: string; text: string; dot: string; label: string }> = {
  synced: { bg: Colors.syncedBg, text: Colors.success, dot: Colors.success, label: 'Synced' },
  pending: { bg: Colors.pendingBg, text: Colors.warning, dot: Colors.warning, label: 'Pending' },
  failed: { bg: Colors.failedBg, text: Colors.error, dot: Colors.error, label: 'Failed' },
  employee: { bg: Colors.roleBg.employee, text: Colors.roleText.employee, dot: Colors.roleText.employee, label: 'Employee' },
  admin: { bg: Colors.roleBg.admin, text: Colors.roleText.admin, dot: Colors.roleText.admin, label: 'Admin' },
  superAdmin: { bg: Colors.roleBg.superAdmin, text: Colors.roleText.superAdmin, dot: Colors.roleText.superAdmin, label: 'Super Admin' },
};

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
}

export function Badge({ variant, label }: BadgeProps) {
  const c = config[variant];
  return (
    <View style={[styles.container, { backgroundColor: c.bg }]}>
      <View style={[styles.dot, { backgroundColor: c.dot }]} />
      <Text style={[styles.text, { color: c.text }]}>{label ?? c.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    gap: 5,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  text: {
    fontSize: 11,
    fontWeight: '500',
  },
});
