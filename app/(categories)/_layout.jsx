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
        options={({ route }) => ({
          title: route.params.category, // Will show כתובים
          headerTitleAlign: 'center',
          animation: 'slide_from_right'
        })}
      />

      {/* Book route */}
      <Stack.Screen 
        name="[category]/[book]/index"
        options={({ route }) => ({
          title: route.params.book, // Will show the book name
          headerTitleAlign: 'center',
          animation: 'slide_from_right'
        })}
      />

      {/* New Episode route */}
      <Stack.Screen 
        name="[category]/[book]/[episode]/[id]"
        options={({ route }) => ({
          title: route.params.episode, // Will show the episode name
          headerShown: false, // Changed from false to true
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
  );
}