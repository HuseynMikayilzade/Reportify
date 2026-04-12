// Root App Navigator — auth gate
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { useAuthStore } from '../../store/authStore';
import LoginScreen from '../../presentation/screens/auth/LoginScreen';
import { MainTabNavigator } from './MainTabNavigator';
import CreateReportScreen from '../../presentation/screens/reports/CreateReportScreen';
import ReportDetailScreen from '../../presentation/screens/reports/ReportDetailScreen';
import { Colors } from '../../theme';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const { user, isInitializing } = useAuthStore();

  if (isInitializing) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      {!user ? (
        <Stack.Screen name="Auth" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen
            name="CreateReport"
            component={CreateReportScreen}
            options={{ animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="ReportDetail"
            component={ReportDetailScreen}
            options={{ animation: 'slide_from_right' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
