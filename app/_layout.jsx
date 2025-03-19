import React, { useEffect, useMemo, useState } from 'react';
import { StatusBar, TouchableOpacity, View, Text, Platform, I18nManager } from 'react-native';
import "../global.css";
import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Ionicons } from '@expo/vector-icons';
import * as ScreenOrientation from 'expo-screen-orientation'; // Add this import
import ThemedText from '../components/ThemedText';

function AppLayout() {
  const { colors, theme, toggleTheme, fontSize, setFontSize } = useTheme();
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
        <ThemedText>Loading...</ThemedText>
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
          accessibilityHint={`שינוי ערכת נושא ל${theme === 'light' ? 'כהה' : 'בהירה'}`}
          accessibilityLabel={`שינוי ערכת נושא ל${theme === 'light' ? 'כהה' : 'בהירה'}`}
          style={[
            { 
              position: 'absolute',
              top: 12,
              right: 4,
              zIndex: 50,
              backgroundColor: `${colors.card}99`, // Added 99 for 60% opacity
              padding: 8,
              borderRadius: 20,
              transform: [{ scaleX: 1 }] // Fix for RTL
            }
          ]}
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