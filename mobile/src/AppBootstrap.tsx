import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store, bootstrapPreferences } from './store';
import PreferencesConnector from './screens/Settings/PreferencesConnector';
import { registerMidnightRefresh } from './notifications/usePrayerNotifications';

export default function AppBootstrap({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    (async () => {
      await bootstrapPreferences();
      await registerMidnightRefresh();
    })();
  }, []);

  return (
    <Provider store={store}>
      <PreferencesConnector />
      {children}
    </Provider>
  );
}