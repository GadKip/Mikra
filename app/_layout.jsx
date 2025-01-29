import React from 'react';
import { StatusBar } from 'react-native';
import "../global.css";
import { Slot, Stack } from 'expo-router'; // Add Slot import
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

function AppLayout() {
  const { colors } = useTheme();

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar 
          backgroundColor="transparent"
          barStyle={colors.statusBar}
        />
        <Slot />
        
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AppLayout />
    </ThemeProvider>
  );
}