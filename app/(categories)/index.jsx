import { View, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import ThemedText from '../../components/ThemedText';
import { listFiles } from '../../lib/appwrite';
import { client } from '../../lib/appwrite';
import { useState, useEffect } from 'react';

export default function CategoryList() {
  const router = useRouter();
  const { colors } = useTheme();
  const categories = ['הקדמה והסכמות','תורה', 'נביאים', 'כתובים'];
  const [introductionId, setIntroductionId] = useState(null);

  useEffect(() => {
    // Fetch the introduction file ID when component mounts
    const fetchIntroductionId = async () => {
      try {
        const data = await listFiles(client);
        if (data['הקדמה והסכמות']) {
          const introBooks = Object.values(data['הקדמה והסכמות'])[0];
          if (introBooks && introBooks.length > 0) {
            setIntroductionId(introBooks[0].$id);
          }
        }
      } catch (error) {
        console.error('Error fetching introduction:', error);
      }
    };

    fetchIntroductionId();
  }, []);

  const handleCategoryPress = async (category) => {
    if (category === 'הקדמה והסכמות' && introductionId) {
      // Direct navigation to the introduction file
      router.push(`/(categories)/הקדמה והסכמות/introduction/introduction/${introductionId}`);
    } else {
      // Normal category navigation
      router.push(`/(categories)/${category}`);
    }
  };

  return (
    <ScrollView className="flex-1 p-4" style={{ backgroundColor: colors.background }}>
      {/* Main categories */}
      {categories.map((category) => (
        <Pressable
          key={category}
          onPress={() => handleCategoryPress(category)}
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