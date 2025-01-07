import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function BooksLayout() {
  const router = useRouter();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#1a1a1a',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerLeft: () => (
          <Pressable onPress={() => router.back()} style={{ marginLeft: 16 }}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </Pressable>
        ),
      }}
    >
      <Stack.Screen 
        name="index"
        options={{ 
          title: "ספרים",
          headerLeft: () => null, // Hide back button on main books page
        }}
      />
      <Stack.Screen 
        name="[id]"
        options={{ 
          title: "ספר",
          animation: 'slide_from_right',
        }}
      />
    </Stack>
  );
}