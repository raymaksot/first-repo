import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

export type RemotePayload = {
  type: 'eventReminder' | 'newArticle' | 'groupMilestone';
  title: string;
  body: string;
  data?: Record<string, string>;
};

export function useContentNotifications() {
  useEffect(() => {
    const sub = Notifications.addNotificationReceivedListener(() => {
      // leave default handler; screen-level deep links can be added later
    });
    return () => sub.remove();
  }, []);

  // Expose scheduling helper for local content notifications
  async function scheduleLocal(payload: RemotePayload, when: Date) {
    await Notifications.scheduleNotificationAsync({ content: { title: payload.title, body: payload.body, data: payload.data }, trigger: { date: when } });
  }

  return { scheduleLocal };
}