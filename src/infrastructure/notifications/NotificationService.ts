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
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      return finalStatus === 'granted';
    } catch (error) {
      console.warn('Notification permissions request failed (likely Expo Go limitation):', error);
      return false;
    }
  },


  async scheduleDailyReminder(hour: number = 20, minute: number = 0): Promise<void> {
    try {
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
    } catch (error) {
      console.warn('Failed to schedule daily reminder:', error);
    }
  },

  async showSyncSuccess(count: number): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '✅ Reports synced',
          body: `${count} report${count > 1 ? 's' : ''} successfully synced.`,
        },
        trigger: null, // immediate
      });
    } catch (error) {
      console.warn('Failed to show sync notification:', error);
    }
  },

  async cancelAll(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },
};
