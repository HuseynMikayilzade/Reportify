// Input Component — design system compliant
import React, { useState, useRef } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  Animated,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Colors, BorderRadius, Spacing } from '../../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function Input({ label, error, containerStyle, style, ...props }: InputProps) {
  const [focused, setFocused] = useState(false);
  const borderColor = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setFocused(true);
    Animated.timing(borderColor, { toValue: 1, duration: 180, useNativeDriver: false }).start();
    props.onFocus?.({} as any);
  };

  const handleBlur = () => {
    setFocused(false);
    Animated.timing(borderColor, { toValue: 0, duration: 180, useNativeDriver: false }).start();
    props.onBlur?.({} as any);
  };

  const animatedBorderColor = borderColor.interpolate({
    inputRange: [0, 1],
    outputRange: [
      error ? Colors.error : 'rgba(255,255,255,0.10)',
      error ? Colors.error : Colors.primary,
    ],
  });

  const animatedBg = borderColor.interpolate({
    inputRange: [0, 1],
    outputRange: [
      error ? 'rgba(255,90,110,0.08)' : 'rgba(255,255,255,0.05)',
      error ? 'rgba(255,90,110,0.08)' : 'rgba(124,111,255,0.08)',
    ],
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Animated.View
        style={[
          styles.inputWrapper,
          { borderColor: animatedBorderColor, backgroundColor: animatedBg },
        ]}
      >
        <TextInput
          placeholderTextColor={Colors.textTertiary}
          style={[styles.input, style]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
      </Animated.View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  label: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: Spacing.s1,
  },
  inputWrapper: {
    borderRadius: BorderRadius.input,
    borderWidth: 0.5,
    minHeight: 44,
    justifyContent: 'center',
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '400',
  },
  error: {
    fontSize: 11,
    color: Colors.error,
    marginTop: 4,
  },
});
