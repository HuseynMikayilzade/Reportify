// SearchBar Component
import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius } from '../../theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = 'Search reports…' }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⌕</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.30)"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.09)',
    borderRadius: BorderRadius.md,
    paddingHorizontal: 10,
    paddingVertical: 7,
    gap: 7,
  },
  icon: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.30)',
    marginTop: -2,
  },
  input: {
    flex: 1,
    fontSize: 11,
    color: Colors.textPrimary,
  },
});
