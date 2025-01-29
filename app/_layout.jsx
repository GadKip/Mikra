import React from 'react';
import { StatusBar } from 'react-native';
import "../global.css";
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

function AppLayout() {
  const { colors, theme } = useTheme();

  const screenOptions = {
    headerShown: false,
    gestureEnabled: false,
    contentStyle: {
      backgroundColor: colors.background
    }
  };

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
        <StatusBar 
          backgroundColor="transparent"
          barStyle={colors.statusBar}
        />
        <Stack screenOptions={screenOptions}>
          <Stack.Screen name="index" />  // Splash
          <Stack.Screen name="(categories)" />
        </Stack>
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