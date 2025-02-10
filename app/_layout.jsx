import React, { useEffect, useState } from 'react';
import { StatusBar, TouchableOpacity, View, Text, Platform } from 'react-native';
import "../global.css";
import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Ionicons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation'; // Add this import

function AppLayout() {
  const { colors, theme, toggleTheme } = useTheme();
  const [error, setError] = useState(null);
  const [fontsLoaded] = useFonts(Platform.select({
    web: {}, // Empty object for web - fonts will be loaded via app.json
    default: { // Native platforms
      'Ezra SIL SR': require('../assets/fonts/Ezra SIL SR.ttf'),
      'Guttman Keren': require('../assets/fonts/Guttman Keren.ttf'),
      'David': require('../assets/fonts/David.ttf'),
      'DavidBD': require('../assets/fonts/DavidBD.ttf'),
    }
  }));

  useEffect(() => {
    async function prepare() {
      try {
        if (fontsLoaded) {
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
    // Add this orientation setup
    async function setupOrientation() {
      try {
        await ScreenOrientation.unlockAsync(); // Allow all orientations
      } catch (error) {
        console.error('Error setting up orientation:', error);
      }
    }

    setupOrientation();
  }, []);

  // Add loading state debug
  if (!fontsLoaded && Platform.OS !== 'web') {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }
  if (error) throw error;

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView 
        style={{ flex: 1, backgroundColor: colors.background }}
        className={`flex-1 ${theme === 'dark' ? 'dark' : ''}`}
      >
        <StatusBar 
          backgroundColor={theme === 'dark' ? colors.card : 'transparent'}
          barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
          translucent={false}
        />
        <TouchableOpacity 
          onPress={toggleTheme}
          className="absolute top-12 right-4 z-50 p-2 rounded-full"
          style={{ backgroundColor: colors.card }}
        >
          <Ionicons 
            name={theme === 'light' ? 'moon' : 'sunny'} 
            size={24} 
            color={colors.text}
          />
        </TouchableOpacity>
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