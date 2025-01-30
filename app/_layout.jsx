import React, { useEffect, useState } from 'react';
import { StatusBar } from 'react-native';
import "../global.css";
import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

function AppLayout() {
  const { colors } = useTheme();
  const [error, setError] = useState(null);
  const [fontsLoaded] = useFonts({
    'Ezra SIL SR': require('../assets/fonts/Ezra SIL SR.ttf'),
    'Guttman Keren': require('../assets/fonts/Guttman Keren.ttf'),
    'David': require('../assets/fonts/David.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      try {
        if (fontsLoaded) {
          await SplashScreen.hideAsync();
        }
      } catch (e) {
        setError(e);
      }
    }
    prepare();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  if (error) throw error;

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