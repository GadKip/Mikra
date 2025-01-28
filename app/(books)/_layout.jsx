import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

export default function BooksLayout() {
  const router = useRouter();
  const { isDarkMode, toggleTheme, theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.background,
        },
        headerTintColor: theme.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: () => (
          <Pressable 
            onPress={toggleTheme}
            style={({ pressed }) => ({
              marginRight: 16,
              padding: 8,
              opacity: pressed ? 0.5 : 1,
              zIndex: 1
            })}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons 
              name={isDarkMode ? "sunny" : "moon"} 
              size={24} 
              color={theme.text} 
            />
          </Pressable>
        ),
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