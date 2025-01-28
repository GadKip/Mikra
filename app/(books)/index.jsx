import { View, Text, ScrollView, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { listFiles, initializeAnonymousSession } from '../../lib/appwrite';
import { client } from '../../lib/appwrite';
import Loader from '../../components/Loader';
import alert from '../../components/alert';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs([
  'Warning: TRenderEngineProvider:',
  'Warning: MemoizedTNodeRenderer:',
  'Warning: TNodeChildrenRenderer:'
]);

export default function Books() {
  const router = useRouter();
  const [books, setBooks] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAndFetch();
  }, []);

  const initializeAndFetch = async () => {
    try {
      // Initialize anonymous session first
      await initializeAnonymousSession(client);
      await fetchBooks();
    } catch (error) {
      alert('Error', 'Could not initialize session');
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const files = await listFiles(client);
      if (!files) {
        throw new Error('No books data received');
      }
      setBooks(files);
    } catch (error) {
      console.error('Error fetching books:', error);
      alert('Error', error.message || 'Could not fetch books');
    } finally {
      setLoading(false);
    }
  };

  const navigateToBook = (bookId) => {
    router.replace(`./${bookId}`);
  };

  if (loading) return <Loader isLoading={loading} />;

  return (
    <ScrollView className="flex-1 bg-background p-4">
      {Object.entries(books).map(([category, categoryBooks]) => (
        <View key={category} className="mb-8 bg-gray-900 rounded-lg p-4">
          <Text className="text-text text-2xl font-bold text-right mb-4 border-b border-gray-800 pb-2">
            {category}
          </Text>
          {Object.entries(categoryBooks).map(([bookName, episodes]) => (
            <View key={bookName} className="mb-6 bg-gray-800 rounded-lg p-3">
              <Text className="text-text text-xl font-semibold text-right mb-3 border-b border-gray-700 pb-2">
                {bookName}
              </Text>
              {episodes.map((episode) => (
                <Pressable 
                  key={episode.$id}
                  onPress={() => navigateToBook(episode.$id)}
                  className="py-3 px-4 mb-2 bg-gray-700 rounded-md active:bg-gray-600"
                >
                  <Text className="text-text text-lg text-right">
                    {episode.episode}
                  </Text>
                </Pressable>
              ))}
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}