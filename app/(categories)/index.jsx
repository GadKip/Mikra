import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import ThemedText from '../../components/ThemedText';

// Main categories view
export default function CategoryList() {
  const router = useRouter();
  const { colors } = useTheme();
  const categories = ['תורה', 'נביאים', 'כתובים'];

  return (
    <ScrollView className="flex-1 p-4" style={{ backgroundColor: colors.background }}>
      {categories.map((category) => (
        <Pressable
          key={category}
          onPress={() => router.push(`/(categories)/${category}`)}
          className="mb-6 rounded-lg p-6"
          style={{ backgroundColor: colors.card }}
        >
          <ThemedText className="text-2xl font-bold text-center">
            {category}
          </ThemedText>
        </Pressable>
      ))}
    </ScrollView>
  );
}