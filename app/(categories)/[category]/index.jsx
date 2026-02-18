import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StatusBar, View } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { client, listFiles } from '../../../lib/appwrite';

import Loader from '../../../components/Loader';
import ThemedText from '../../../components/ThemedText';
import ThemeToggle from '../../../components/ThemeToggle';

export default function BookList() {
  const { category } = useLocalSearchParams();
  const router = useRouter();
  const { colors, theme } = useTheme();
  const [books, setBooks] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await listFiles(client);
        setBooks(data[category] || {}); // Change from 'id' to 'category'
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [category]); // Change from 'id' to 'category'

  if (loading) return <Loader isLoading={loading} />;

  return (
    <View 
      style={{
        flex: 1, 
        backgroundColor: colors.background
      }}
      edges={['top']}
    >
      <StatusBar
        backgroundColor="transparent"
        translucent={true}
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      />
      
        <ThemeToggle />
        <ScrollView className="flex-1 p-4" style={{ backgroundColor: colors.background }}>
          {Object.entries(books).map(([book, episodes]) => (
            <Pressable
              key={book}
              onPress={() => router.push(`/(categories)/${category}/${book}`)}
              className="mb-6 rounded-lg p-6"
              style={{ backgroundColor: colors.card }}
            >
              <ThemedText 
                className="text-2xl font-guttman text-center"
                style={{
                  textAlign: 'center'
                }}
              >
                {book}
              </ThemedText>
            </Pressable>
          ))}
        </ScrollView>
    </View>
  );
}