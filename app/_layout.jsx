import React from 'react';
import { LogBox, StatusBar } from 'react-native';
import "../global.css";
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Suppress specific warnings
LogBox.ignoreLogs([
  'Support for defaultProps will be removed',
  'TRenderEngineProvider:',
  'MemoizedTNodeRenderer:',
  'TNodeChildrenRenderer:',
  'Warning: props.pointerEvents is deprecated',
  '"shadow*" style props are deprecated'
]);

export default function RootLayout() {
  return (
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              headerShown: false,
              gestureEnabled: false,
            }}
          >
            <Stack.Screen 
              name="splash"
              options={{
                headerShown: false,
                gestureEnabled: false,
              }} 
            />
            <Stack.Screen 
              name="(books)" 
              options={{
                headerShown: false,
                gestureEnabled: true,
              }} 
            />
          </Stack>
        </GestureHandlerRootView>
      </SafeAreaProvider>
  );
}