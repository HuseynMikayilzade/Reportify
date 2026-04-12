import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

interface ProgressBarProps {
  progress: number; // 0 to 1
  color?: string;
  height?: number;
}

export function ProgressBar({ progress, color = Colors.primary, height = 4 }: ProgressBarProps) {
  const percentage = `${Math.min(100, Math.max(0, progress * 100))}%`;
  
  return (
    <View style={[styles.container, { height }]}>
      <View style={[styles.fill, { width: percentage as any, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: Colors.borderSubtle,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 999,
  },
});
