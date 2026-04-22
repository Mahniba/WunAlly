import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './src/navigation/NavigationService';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SidebarProvider } from './src/context/SidebarContext';
import { Sidebar } from './src/components/Sidebar';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useOnboardingStore, useSymptomsStore } from './src/store';
import { requestNotificationPermissions, scheduleDailyReminder } from './src/services/notifications';
import { evaluateSymptomRules } from './src/services/symptomRules';
import { DoctorAlert } from './src/components/DoctorAlert';
import { getSymptomReminderTime } from './src/services/storage';
import { Alert } from 'react-native';
import { TouchableOpacity, Text } from 'react-native';
import { resetOnboarding } from './src/services/storage';

export default function App() {
  const setDone = useOnboardingStore((s) => s.setDone);
  const hydrateSymptoms = useSymptomsStore((s) => s.hydrate);
  const entries = useSymptomsStore((s) => s.entries);
  const [doctorAlert, setDoctorAlert] = React.useState<{ visible: boolean; message?: string }>({ visible: false });
  
  const handleResetOnboarding = async () => {
    try {
      await resetOnboarding();
      setDone(false);
      // navigate to onboarding if navigation is ready
      navigationRef?.current && navigationRef.navigate && navigationRef.navigate('Onboarding' as any);
    } catch (e) {
      console.error('Failed to reset onboarding', e);
    }
  };

  React.useEffect(() => {
    // hydrate symptoms store on app start and schedule daily reminder
    (async () => {
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
    // evaluate rules whenever entries change and show an alert if any rules fire
    if (!entries || entries.length === 0) return;
    const alerts = evaluateSymptomRules(entries);
    if (alerts.length > 0) {
      const first = alerts[0];
      setDoctorAlert({ visible: true, message: first.message });
    }
  }, [entries]);

  return (
    <SafeAreaProvider>
      <SidebarProvider>
        <NavigationContainer ref={navigationRef}>
          <StatusBar style="dark" />
          <RootNavigator />
          <Sidebar />
          
          {/* Dev button to reset onboarding - remove in production */}
          <TouchableOpacity 
            onPress={handleResetOnboarding}
            style={{
              position: 'absolute',
              bottom: 20,
              right: 20,
              backgroundColor: '#FF69B4',
              padding: 10,
              borderRadius: 5,
              zIndex: 999,
            }}
          >
            <Text style={{ color: 'white', fontSize: 12 }}>Reset Onboarding</Text>
          </TouchableOpacity>
          <DoctorAlert
            visible={doctorAlert.visible}
            onClose={() => setDoctorAlert({ visible: false })}
            message={doctorAlert.message || ''}
          />
        </NavigationContainer>
      </SidebarProvider>
    </SafeAreaProvider>
  );
}
