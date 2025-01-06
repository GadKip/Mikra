import { Stack } from 'expo-router';

export default function BooksLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: 'חזרה',
      }}
    >
      <Stack.Screen 
        name="index"
        options={{ 
          headerTitle: "ספרים",
        }}
      />
      <Stack.Screen 
        name="[id]"
        options={{ 
          headerTitle: "ספר",
        }}
      />
    </Stack>
  );
}