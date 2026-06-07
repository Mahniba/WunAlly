import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './src/navigation/NavigationService';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SidebarProvider } from './src/context/SidebarContext';
import { Sidebar } from './src/components/Sidebar';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useOnboardingStore, useSymptomsStore } from './src/store';
import { requestNotificationPermissions, scheduleDailyReminder } from './src/services/notifications';
import { evaluateSymptomRules } from './src/services/symptomRules';
import { logAlertEvent } from './src/services/api/alerts';
import { hasAccessToken } from './src/services/api/session';
import { DoctorAlert } from './src/components/DoctorAlert';
import { getSymptomReminderTime } from './src/services/storage';
import { initI18n } from './src/i18n';

export default function App() {
  const setDone = useOnboardingStore((s) => s.setDone);
  const hydrateSymptoms = useSymptomsStore((s) => s.hydrate);
  const entries = useSymptomsStore((s) => s.entries);
  const [doctorAlert, setDoctorAlert] = React.useState<{ visible: boolean; message?: string }>({ visible: false });
  const lastAlertKeyRef = React.useRef<string | null>(null);
  
  // NOTE: Avoid dev-only UI overlays in production builds.

  React.useEffect(() => {
    (async () => {
      await initI18n();
      await hydrateSymptoms();
      const granted = await requestNotificationPermissions();
      if (granted) {
        // read stored preferred time
        try {
          const t = await getSymptomReminderTime();
          if (t) {
            const m = t.match(/^(\d{1,2}):(\d{2})$/);
            if (m) {
              const h = parseInt(m[1], 10);
              const mm = parseInt(m[2], 10);
              await scheduleDailyReminder(h, mm);
            } else {
              await scheduleDailyReminder(9, 0);
            }
          } else {
            await scheduleDailyReminder(9, 0);
          }
        } catch (e) {
          await scheduleDailyReminder(9, 0);
        }
      }
    })();
  }, [hydrateSymptoms]);

  React.useEffect(() => {
    if (!entries || entries.length === 0) return;
    const alerts = evaluateSymptomRules(entries);
    if (alerts.length > 0) {
      const first = alerts[0];
      const alertKey = `${first.symptom}:${first.count}:${first.windowDays}`;
      setDoctorAlert({ visible: true, message: first.message });
      if (lastAlertKeyRef.current !== alertKey) {
        lastAlertKeyRef.current = alertKey;
        (async () => {
          if (await hasAccessToken()) {
            await logAlertEvent({
              symptom: first.symptom,
              count: first.count,
              window_days: first.windowDays,
              message: first.message,
            });
          }
        })();
      }
    }
  }, [entries]);

  return (
    <SafeAreaProvider>
      <KeyboardProvider preload={false}>
        <SidebarProvider>
          <NavigationContainer ref={navigationRef}>
            <StatusBar style="dark" />
            <RootNavigator />
            <Sidebar />
            <DoctorAlert
              visible={doctorAlert.visible}
              onClose={() => setDoctorAlert({ visible: false })}
              message={doctorAlert.message || ''}
            />
          </NavigationContainer>
        </SidebarProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}
