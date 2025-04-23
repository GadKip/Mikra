import React, { useEffect } from 'react';
import { StatusBar, View, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as ScreenOrientation from 'expo-screen-orientation';
import { Ionicons } from '@expo/vector-icons';

export default function CategoriesLayout() {
  const { colors, theme, toggleTheme } = useTheme();

  const [fontsLoaded] = useFonts({
    'EzraSILSR': require('../../assets/fonts/EzraSILSR.ttf'),
    'GuttmanKeren': require('../../assets/fonts/GuttmanKeren.ttf'),
    'David': require('../../assets/fonts/David.ttf'),
    'DavidBD': require('../../assets/fonts/DavidBD.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
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

  const screenOptions = {
    headerShown: true,
    headerStyle: {
      backgroundColor: colors.card
    },
    headerTitleStyle: {
      color: colors.text,
      fontFamily: 'EzraSILSR'
    },
    headerTintColor: colors.text,
    contentStyle: {
      backgroundColor: colors.background
    }
  };

  return (
    <>
      <StatusBar 
        backgroundColor={theme === 'dark' ? colors.card : 'transparent'}
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        translucent={false}
      />
      <Stack screenOptions={{
        ...screenOptions,
        headerTitleAlign: 'center'
      }}>
        <Stack.Screen 
          name="about" 
          options={{ 
            title: "אודות",
            headerTitleAlign: 'center'
          }} 
        />
        <Stack.Screen 
          name="settings" 
          options={{ 
            title: "הגדרות",
            headerTitleAlign: 'center'
          }} 
        />
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'מקרא מבואר',
            headerTitleAlign: 'center'
          }} 
        />
        <Stack.Screen 
          name="[category]/index"
          options={({ route }) => ({
            title: route.params.category,
            headerTitleAlign: 'center',
            animation: 'slide_from_right'
          })}
        />
        <Stack.Screen 
          name="[category]/[book]/index"
          options={({ route }) => ({
            title: route.params.book,
            headerTitleAlign: 'center',
            animation: 'slide_from_right'
          })}
        />
        <Stack.Screen 
          name="[category]/[book]/[episode]/[id]"
          options={({ route }) => ({
            title: route.params.episode,
            headerShown: false,
            headerTitleAlign: 'center',
            animation: 'slide_from_right',
            headerStyle: {
              backgroundColor: colors.card
            },
            headerTintColor: colors.text,
            headerTitleStyle: {
              color: colors.text
            }
          })}
        />
      </Stack>
    </>
  );
}