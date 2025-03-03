import { View, Text, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../../context/ThemeContext';
import { useEffect, useState } from 'react';
import { listFiles } from '../../../lib/appwrite';
import { client } from '../../../lib/appwrite';
import Loader from '../../../components/Loader';
import ThemedText from '../../../components/ThemedText';

export default function BookList() {
  const { category } = useLocalSearchParams(); // Change from 'id' to 'category'
  const router = useRouter();
  const { colors } = useTheme();
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
    <ScrollView className="flex-1 p-4" style={{ backgroundColor: colors.background }}>
      {Object.entries(books).map(([book, episodes]) => (
        <Pressable
          key={book}
          onPress={() => router.push(`/(categories)/${category}/${book}`)}
          className="mb-6 rounded-lg p-6"
          style={{ backgroundColor: colors.card }}
        >
          <ThemedText 
            className="text-2xl font-ezra text-center"  // Add font-ezra here
            style={{
              textAlign: 'center'
            }}
          >
            {book}
          </ThemedText>
        </Pressable>
      ))}
    </ScrollView>
  );
}