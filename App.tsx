import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './src/navigation/NavigationService';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SidebarProvider } from './src/context/SidebarContext';
import { Sidebar } from './src/components/Sidebar';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useOnboardingStore } from './src/store';
import { TouchableOpacity, Text } from 'react-native';
import { resetOnboarding } from './src/services/storage';

export default function App() {
  const setDone = useOnboardingStore((s) => s.setDone);
  
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
        </NavigationContainer>
      </SidebarProvider>
    </SafeAreaProvider>
  );
}
