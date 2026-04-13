// Main Tab Navigator
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MainTabParamList } from './types';
import { Colors, Spacing, BorderRadius } from '../../theme';
import { useAuthStore } from '../../store/authStore';
import { UserRole } from '../../domain/entities/UserRole';
import { useNavIconStore, DEFAULT_ICONS } from '../../store/navIconStore';
import DashboardScreen from '../../presentation/screens/dashboard/DashboardScreen';
import ReportsListScreen from '../../presentation/screens/reports/ReportsListScreen';
import ManagementScreen from '../../presentation/screens/admin/ManagementScreen';
import SettingsScreen from '../../presentation/screens/profile/SettingsScreen';
import * as LucideIcons from 'lucide-react-native';

const Tab = createBottomTabNavigator<MainTabParamList>();

interface TabIconProps {
  name: string;
  focused: boolean;
}

function TabIcon({ name, focused }: TabIconProps) {
  // Read user-selected icon from store; fall back to system default
  const { icons } = useNavIconStore();
  const iconName = icons[name] ?? DEFAULT_ICONS[name] ?? 'HelpCircle';
  
  const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.HelpCircle;

  return (
    <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
      <IconComponent 
        color={focused ? Colors.primary : Colors.textMuted} 
        size={20} 
        strokeWidth={2}
      />
    </View>
  );
}

export function MainTabNavigator() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();

  // Management tab is only accessible to Admin and SuperAdmin.
  // For Employee role, the tab must not exist at all — not disabled, not hidden.
  // React Navigation automatically rebalances remaining tabs to fill the space evenly.
  const canAccessManagement =
    user?.role === UserRole.Admin || user?.role === UserRole.SuperAdmin;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          {
            height: Spacing.bottomNavH + insets.bottom,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          },
        ],
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.muted,
        tabBarLabelStyle: styles.label,
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
      })}
    >
      <Tab.Screen name="Reports" component={ReportsListScreen} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      {canAccessManagement && (
        <Tab.Screen name="Management" component={ManagementScreen} />
      )}
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.surface,        // #12111A — design system: bottom nav bg
    borderTopColor: Colors.borderSubtle,    // rgba(255,255,255,0.06)
    borderTopWidth: 0.5,
    height: Spacing.bottomNavH,
    paddingBottom: 8,
    paddingTop: 8,
  },

  // Icon container: 22×22px with 6px border radius per design system (section 6.6)
  iconContainer: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.sm,          // 6px
  },

  // Active: soft primary ghost background rgba(124,111,255,0.15)
  iconContainerActive: {
    backgroundColor: Colors.primaryGhost,
    borderColor: Colors.primary,
  },

  // Icon: 16px, muted color (#6B6880) by default
  icon: {
    fontSize: 16,
    color: Colors.muted,
    lineHeight: 20,
  },

  // Active icon: primary color (#7C6FFF)
  iconActive: {
    color: Colors.primary,
  },

  // Nav label: 10px / Micro scale per design system
  label: {
    fontSize: 10,
    marginTop: 2,
  },
});
