import { Stack } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

export default function CategoriesLayout() {
  const { colors } = useTheme();

  const screenOptions = {
    headerShown: true,
    headerStyle: {
      backgroundColor: colors.card // Change from background to card
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

      {/* Category route */}
      <Stack.Screen 
        name="[category]/index"
        options={{
          headerTitleAlign: 'center',
          animation: 'slide_from_right'
        }}
      />

      {/* Book route */}
      <Stack.Screen 
        name="[category]/[book]/index"
        options={{
          headerTitleAlign: 'center',
          animation: 'slide_from_right'
        }}
      />


      {/* New Episode route */}
      <Stack.Screen 
        name="[category]/[book]/[episode]/[id]"
        options={{
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
        }}
      />
    </Stack>
  );
}