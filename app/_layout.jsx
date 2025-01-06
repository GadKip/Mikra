import React from 'react';
import "../global.css";
import { Tabs } from 'expo-router';
import { Head } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'nativewind';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Layout() {
const { setColorScheme } = useColorScheme();

// Force dark mode
React.useEffect(() => {
    setColorScheme('dark');
}, []);

return (
    <SafeAreaProvider>
    <GestureHandlerRootView style={{ flex: 1 }}>
        <Tabs
        screenOptions={{
            headerShown: false,
            tabBarStyle: {
            backgroundColor: '#1a1a1a',
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: -2
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            },
            tabBarActiveTintColor: '#ffffff',
            tabBarInactiveTintColor: '#666666'
        }}
        >
        <Tabs.Screen
            name="index"
            options={{
            title: 'בית',
            tabBarIcon: ({ color, size }) => (
                <Ionicons name="home" size={size} color={color} />
            ),
            }}
        />
        <Tabs.Screen
            name="books"
            options={{
            title: 'ספרים',
            tabBarIcon: ({ color, size }) => (
                <Ionicons name="book" size={size} color={color} />
            ),
            }}
        />
        </Tabs>
    </GestureHandlerRootView>
    </SafeAreaProvider>
);
}