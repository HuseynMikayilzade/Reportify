// Notification Service — local reminders
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const NotificationService = {
  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') return true;
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  },

  async scheduleDailyReminder(hour: number = 20, minute: number = 0): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "📋 Don't forget your report",
        body: "You haven't submitted today's report yet.",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
  },

  async showSyncSuccess(count: number): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '✅ Reports synced',
        body: `${count} report${count > 1 ? 's' : ''} successfully synced.`,
      },
      trigger: null, // immediate
    });
  },

  async cancelAll(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },
};
