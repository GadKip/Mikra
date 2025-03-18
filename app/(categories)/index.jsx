import { View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import ThemedText from '../../components/ThemedText';

export default function CategoryList() {
  const router = useRouter();
  const { colors } = useTheme();
  const categories = ['תורה', 'נביאים', 'כתובים'];

  return (
    <ScrollView className="flex-1 p-4" style={{ backgroundColor: colors.background }}>
      {/* Main categories */}
      {categories.map((category) => (
        <Pressable
          key={category}
          onPress={() => router.push(`/(categories)/${category}`)}
          className="mb-6 rounded-lg p-6"
          style={{ backgroundColor: colors.card }}
        >
          <ThemedText 
            className="text-2xl font-guttman text-center"
            style={{ textAlign: 'center' }}
          >
            {category}
          </ThemedText>
        </Pressable>
      ))}

      {/* Divider */}
      <View 
        className="my-4 h-[1px]" 
        style={{ backgroundColor: colors.border }}
      />

      {/* About and Settings */}
      <Pressable
        onPress={() => router.push('/(categories)/about')}
        className="mb-6 rounded-lg p-6"
        style={{ backgroundColor: colors.card }}
      >
        <ThemedText 
          className="text-2xl font-guttman text-center"
          style={{ textAlign: 'center' }}
        >
          אודות
        </ThemedText>
      </Pressable>

      <Pressable
        onPress={() => router.push('/(categories)/settings')}
        className="mb-6 rounded-lg p-6"
        style={{ backgroundColor: colors.card }}
      >
        <ThemedText 
          className="text-2xl font-guttman text-center"
          style={{ textAlign: 'center' }}
        >
          הגדרות
        </ThemedText>
      </Pressable>
    </ScrollView>
  );
}