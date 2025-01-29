import { Stack } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

export default function CategoriesLayout() {
  const { colors } = useTheme();

  const screenOptions = {
    headerShown: true,
    headerStyle: {
      backgroundColor: colors.background,
    },
    headerTitleStyle: {
      fontWeight: 'bold',
      color: colors.text,
    },
    headerTintColor: colors.text,
    contentStyle: {
      backgroundColor: colors.background
    }
  };

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "ספרים",
          headerTitleAlign: 'center',
        }} 
      />
      <Stack.Screen 
        name="[category]/index"
        options={{
          headerTitleAlign: 'center',
          animation: 'slide_from_right'
        }}
      />
      <Stack.Screen 
        name="[category]/[book]/index"
        options={{
          headerTitleAlign: 'center',
          animation: 'slide_from_right'
        }}
      />
      <Stack.Screen 
        name="[category]/[book]/[episode]/[id]"
        options={{
          headerTitleAlign: 'center',
          animation: 'slide_from_right'
        }}
      />
    </Stack>
  );
}