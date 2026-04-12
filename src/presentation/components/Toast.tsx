// Toast Notification Component
import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, StyleSheet } from 'react-native';
import { Colors, BorderRadius, Spacing } from '../../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  visible: boolean;
  type: ToastType;
  title: string;
  subtitle?: string;
  onDismiss?: () => void;
}

const config: Record<ToastType, { border: string; icon: string }> = {
  success: { border: Colors.success, icon: '✓' },
  error: { border: Colors.error, icon: '✕' },
  info: { border: Colors.primary, icon: 'i' },
};

export function Toast({ visible, type, title, subtitle, onDismiss }: ToastProps) {
  const translateY = useRef(new Animated.Value(120)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const insets = useSafeAreaInsets();
  const c = config[type];

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, { toValue: 0, duration: 280, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 280, useNativeDriver: true }),
      ]).start();
      const timer = setTimeout(() => {
        dismiss();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, { toValue: 120, duration: 240, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0, duration: 240, useNativeDriver: true }),
    ]).start(() => onDismiss?.());
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY }], opacity, bottom: insets.bottom + Spacing.bottomNavH + 16 },
      ]}
    >
      <View style={[styles.leftBorder, { backgroundColor: c.border }]} />
      <View style={[styles.iconBg, { backgroundColor: c.border + '26' }]}>
        <Text style={[styles.icon, { color: c.border }]}>{c.icon}</Text>
      </View>
      <View style={styles.textGroup}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: Spacing.s5,
    right: Spacing.s5,
    backgroundColor: Colors.toastBg,
    borderRadius: BorderRadius.lg,
    borderWidth: 0.5,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    gap: 10,
    zIndex: 999,
    overflow: 'hidden',
  },
  leftBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 2.5,
    borderRadius: 2,
  },
  iconBg: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  icon: { fontSize: 13, fontWeight: '600' },
  textGroup: { flex: 1 },
  title: { fontSize: 13, color: 'rgba(255,255,255,0.80)', fontWeight: '500' },
  subtitle: { fontSize: 11, color: Colors.textMuted, marginTop: 1 },
});
