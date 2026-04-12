// FAB — Floating Action Button
import React, { useRef } from 'react';
import { TouchableOpacity, Animated, StyleSheet, Text } from 'react-native';
import { Colors, Spacing, BorderRadius } from '../../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FABProps {
  onPress: () => void;
}

export function FAB({ onPress }: FABProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const insets = useSafeAreaInsets();

  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.93, useNativeDriver: true, speed: 50, bounciness: 2 }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 40, bounciness: 8 }).start();

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          transform: [{ scale }],
          bottom: Spacing.bottomNavH + insets.bottom + Spacing.fabBottom,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.fab}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
      >
        <Text style={styles.icon}>+</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    right: Spacing.s5,
    zIndex: 100,
  },
  fab: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.fab,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 10,
  },
  icon: {
    fontSize: 26,
    color: Colors.white,
    fontWeight: '300',
    lineHeight: 30,
  },
});
