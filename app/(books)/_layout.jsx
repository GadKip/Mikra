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
        },
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="index"
        options={{ 
          title: "ספרים",
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="[id]"
        options={{ 
          animation: 'slide_from_right',
          headerTitleAlign: 'center',
        }}
      />
    </Stack>
  );
}