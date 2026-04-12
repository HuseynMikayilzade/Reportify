// SegmentedControl Component
import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Colors, BorderRadius } from '../../theme';

interface SegmentedControlProps<T extends string> {
  options: T[];
  selected: T;
  onSelect: (value: T) => void;
}

export function SegmentedControl<T extends string>({
  options,
  selected,
  onSelect,
}: SegmentedControlProps<T>) {
  return (
    <View style={styles.container}>
      {options.map((opt) => {
        const isActive = opt === selected;
        return (
          <TouchableOpacity
            key={opt}
            onPress={() => onSelect(opt)}
            style={[styles.segment, isActive && styles.segmentActive]}
            activeOpacity={0.7}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>{opt}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 0.5,
    borderColor: Colors.borderSubtle,
    borderRadius: 9,
    padding: 3,
  },
  segment: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 7,
  },
  segmentActive: {
    backgroundColor: 'rgba(124,111,255,0.20)',
  },
  label: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  labelActive: {
    color: '#9D94FF',
    fontWeight: '500',
  },
});
