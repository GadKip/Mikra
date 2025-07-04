import React, { useEffect, useMemo, useState } from 'react';
import { StatusBar, View, Platform, I18nManager } from 'react-native';
import "../global.css";
import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as ScreenOrientation from 'expo-screen-orientation';
import ThemedText from '../components/ThemedText';

function AppLayout() {
  const { colors, theme } = useTheme();
  const [error, setError] = useState(null);
  const memoizedThemeStyles = useMemo(() => ({
    flex: 1,
    backgroundColor: colors.background
  }), [colors.background]);

  const [fontsLoaded] = useFonts(
    Platform.select({
      web: {}, 
      default: useMemo(() => ({
        'EzraSILSR': require('../assets/fonts/EzraSILSR.ttf'),
        'GuttmanKeren': require('../assets/fonts/GuttmanKeren.ttf'),
        'David': require('../assets/fonts/David.ttf'),
        'DavidBD': require('../assets/fonts/DavidBD.ttf'),
      }), [])
    })
  );

  useEffect(() => {
    async function prepare() {
      try {
        if (fontsLoaded) {
          console.log('Fonts loaded successfully');
          if (Platform.OS !== 'web') {
            await SplashScreen.hideAsync();
          }
        }
      } catch (e) {
        console.error('Error loading fonts:', e);
        setError(e);
      }
    }
    prepare();
  }, [fontsLoaded]);

  useEffect(() => {
    async function setupOrientation() {
      try {
        await ScreenOrientation.unlockAsync();
      } catch (error) {
        console.error('Error setting up orientation:', error);
      }
    }

    setupOrientation();
  }, []);

  if (!fontsLoaded && Platform.OS !== 'web') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>טוען...</ThemedText>
      </View>
    );
  }
  if (error) throw error;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <GestureHandlerRootView 
          style={{ flex: 1, backgroundColor: colors.background }}
          className={`flex-1 ${theme === 'dark' ? 'dark' : ''}`}
        >
          <StatusBar 
            backgroundColor={theme === 'dark' ? colors.card : 'transparent'}
            barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
            translucent={false}
          />
          <Slot />
        </GestureHandlerRootView>
      </SafeAreaView>
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