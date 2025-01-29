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
      {/* Main categories list */}
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "ספרים",
          headerTitleAlign: 'center',
        }} 
      />

      {/* Individual category view */}
      <Stack.Screen 
        name="[category]"
        options={{
          headerTitleAlign: 'center',
          animation: 'slide_from_left'
        }}
      />

      {/* Book episodes list */}
      <Stack.Screen 
        name="[category]/[book]"
        options={{
          headerTitleAlign: 'center',
          animation: 'slide_from_left'
        }}
      />

      {/* Episode view */}
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