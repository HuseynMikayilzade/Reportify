import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { Colors } from '../../theme/colors';
import { BorderRadius } from '../../theme/spacing';
import { Spacing } from '../../theme/spacing';

export interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export function Card({ children, style, ...passThrough }: CardProps) {
  return (
    <View style={[styles.card, style]} {...passThrough}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    borderWidth: 0.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.cardPadH,
    paddingVertical: Spacing.cardPadV,
    marginBottom: Spacing.s4,
  },
});
