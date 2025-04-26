import { View, ScrollView, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import ThemedText from '../../components/ThemedText';
import { listFiles } from '../../lib/appwrite';
import { client } from '../../lib/appwrite';
import { useState, useEffect } from 'react';
import ThemeToggle from '../../components/ThemeToggle';

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
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <ThemeToggle />
      <ScrollView className="flex-1 p-4" style={{ backgroundColor: colors.background }}>
        {/* Logo */}
        <View className="items-center mb-6">
          <Image
            source={require('../../assets/logo.png')}
            style={{
              width: 200,
              height: 200,
              resizeMode: 'contain'
            }}
          />
        </View>

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

        {/* Spacer */}
        <View style={{ flex: 1, minHeight: 40 }} />

        {/* Bottom Navigation */}
        <View className="flex-row justify-between gap-4">
          <Pressable
            onPress={() => router.push('/(categories)/about')}
            className="flex-1 rounded-lg p-4"
            style={{ backgroundColor: `${colors.card}99` }}
          >
            <ThemedText 
              className="text-lg font-guttman text-center"
              style={{ textAlign: 'center' }}
            >
              אודות
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={() => router.push('/(categories)/settings')}
            className="flex-1 rounded-lg p-4"
            style={{ backgroundColor: `${colors.card}99` }}
          >
            <ThemedText 
              className="text-lg font-guttman text-center"
              style={{ textAlign: 'center' }}
            >
              הגדרות
            </ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}