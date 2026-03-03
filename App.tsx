import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SidebarProvider } from './src/context/SidebarContext';
import { Sidebar } from './src/components/Sidebar';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <SidebarProvider>
        <NavigationContainer>
          <StatusBar style="dark" />
          <RootNavigator />
          <Sidebar />
        </NavigationContainer>
      </SidebarProvider>
    </SafeAreaProvider>
  );
}
