// Button Component — design system compliant
import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors, BorderRadius, Spacing } from '../../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'destructive' | 'ghost';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  fullWidth = true,
}: ButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: variant === 'primary' ? 0.97 : 0.98,
      useNativeDriver: true,
      speed: 50,
      bounciness: 2,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 6,
    }).start();
  };

  const isDisabled = disabled || isLoading;

  return (
    <Animated.View style={{ transform: [{ scale }], width: fullWidth ? '100%' : undefined }}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={isDisabled}
        style={[
          styles.base,
          styles[variant],
          isDisabled && styles.disabled,
          style,
        ]}
      >
        {isLoading ? (
          <ActivityIndicator
            color={variant === 'primary' ? Colors.white : Colors.primary}
            size="small"
          />
        ) : (
          <Text style={[styles.label, styles[`${variant}Text`], isDisabled && styles.disabledText, textStyle]}>
            {label}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    borderRadius: BorderRadius.button,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.s5,
    paddingVertical: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  // Variants
  primary: {
    backgroundColor: Colors.primary,
  },
  primaryText: { color: Colors.white },

  secondary: {
    backgroundColor: 'rgba(124,111,255,0.12)',
    borderWidth: 0.5,
    borderColor: Colors.primaryBorder,
  },
  secondaryText: { color: '#9D94FF' },

  destructive: {
    backgroundColor: 'rgba(255,90,110,0.10)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,90,110,0.20)',
  },
  destructiveText: { color: '#FF7A8A' },

  ghost: {
    backgroundColor: Colors.transparent,
  },
  ghostText: { color: Colors.primary },

  disabled: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 0,
  },
  disabledText: { color: 'rgba(255,255,255,0.20)' },
});
