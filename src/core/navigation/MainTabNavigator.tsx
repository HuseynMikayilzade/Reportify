// Main Tab Navigator
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MainTabParamList } from './types';
import { Colors, Spacing, BorderRadius } from '../../theme';
import DashboardScreen from '../../presentation/screens/dashboard/DashboardScreen';
import ReportsListScreen from '../../presentation/screens/reports/ReportsListScreen';
import ManagementScreen from '../../presentation/screens/admin/ManagementScreen';
import ProfileScreen from '../../presentation/screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

// SVG-style icons using Unicode/text for zero-dependency approach
const icons: Record<string, string> = {
  Reports: '≡',
  Dashboard: '⊞',
  Management: '👥',
  Settings: '⚙',
};

interface TabIconProps {
  name: string;
  focused: boolean;
}
function TabIcon({ name, focused }: TabIconProps) {
  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
      <Text style={[styles.icon, focused && styles.iconActive]}>{icons[name]}</Text>
    </View>
  );
}

export function MainTabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          {
            height: Spacing.bottomNavH + insets.bottom,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          }
        ],
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.muted,
        tabBarLabelStyle: styles.label,
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
      })}
    >
      <Tab.Screen name="Reports" component={ReportsListScreen} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Management" component={ManagementScreen} />
      <Tab.Screen name="Settings" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({

  tabBar: {
    backgroundColor: Colors.surface,
    borderTopColor: Colors.borderSubtle,
    borderTopWidth: 0.5,
    height: Spacing.bottomNavH,
    paddingBottom: 8,
    paddingTop: 8,
  },
  iconContainer: {
    width: 32,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.sm,
  },
  iconContainerActive: {
    backgroundColor: Colors.primaryGhost,
  },
  icon: {
    fontSize: 18,
    color: Colors.muted,
  },
  iconActive: {
    color: Colors.primary,
  },
  label: {
    fontSize: 10,
    marginTop: 2,
  },
});
