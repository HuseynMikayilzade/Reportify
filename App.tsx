// Root Application Entry Point
import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppNavigator } from './src/core/navigation/AppNavigator';
import { useAuthStore } from './src/store/authStore';
import { networkMonitor } from './src/infrastructure/network/NetworkMonitor';
import { NotificationService } from './src/infrastructure/notifications/NotificationService';
import { Colors } from './src/theme';

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

export default function App() {
  console.log('[App] Rendering Root Component');
  const { initialize } = useAuthStore();

  useEffect(() => {
    // Initialize auth session
    initialize();

    // Start network monitor (auto-sync on reconnect)
    networkMonitor.start();

    // Request notification permissions and schedule daily reminder
    NotificationService.requestPermissions().then((granted) => {
      if (granted) {
        NotificationService.scheduleDailyReminder(20, 0); // 8 PM reminder
      }
    });

    return () => {
      networkMonitor.stop();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.bg }}>
      <SafeAreaProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.bg}
          translucent={false}
        />
        <NavigationContainer
          theme={{
            dark: true,
            colors: {
              primary: Colors.primary,
              background: Colors.bg,
              card: Colors.surface,
              text: Colors.textPrimary  as string,
              border: Colors.border as string,
              notification: Colors.primary,
            },
            fonts: {
              regular: { fontFamily: 'System', fontWeight: '400' },
              medium: { fontFamily: 'System', fontWeight: '500' },
              bold: { fontFamily: 'System', fontWeight: '700' },
              heavy: { fontFamily: 'System', fontWeight: '800' },
            },
          }}
        >
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
