import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { client, listFiles } from '../../../../lib/appwrite';

import Loader from '../../../../components/Loader';
import ThemedText from '../../../../components/ThemedText';
import ThemeToggle from '../../../../components/ThemeToggle';

export default function EpisodeList() {
  const { category, book } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();
  const [episodes, setEpisodes] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const LIMIT = 100;
  
  const fetchEpisodes = useCallback(async (currentOffset = 0) => {
    try {
      const response = await listFiles(client);
      // First check if the category and book exist in the response
      if (!response[category] || !response[category][book]) {
        console.error('Category or book not found:', { category, book });
        setEpisodes([]);
        setHasMore(false);
        return;
      }

      // Get episodes for this specific book
      const bookEpisodes = response[category][book];
      
      // Sort episodes by episodeOrder
      const sortedEpisodes = bookEpisodes.sort((a, b) => 
        (a.episodeOrder || 0) - (b.episodeOrder || 0)
      );

      // Handle pagination
      const paginatedEpisodes = sortedEpisodes.slice(
        currentOffset, 
        currentOffset + LIMIT
      );

      setEpisodes(prev => 
        currentOffset === 0 ? paginatedEpisodes : [...prev, ...paginatedEpisodes]
      );
      
      setHasMore(paginatedEpisodes.length === LIMIT);

      //If there is only one episode, navigate directly to it
      if (sortedEpisodes.length === 1) {
        const episode = sortedEpisodes[0];
        router.replace(`/(categories)/${category}/${book}/${episode.episode}/${episode.$id}`);
        return;
      }

    } catch (error) {
      console.error('Error fetching episodes:', error);
      setEpisodes([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [category, book, router]);

  const loadMore = () => {
    if (hasMore && !loading) {
      const newOffset = offset + LIMIT;
      setOffset(newOffset);
      fetchEpisodes(newOffset);
    }
  };

  useEffect(() => {
    setLoading(true);
    setOffset(0); // Reset offset when category or book changes
    fetchEpisodes(0);
  }, [category, book, fetchEpisodes]);

  if (loading && offset === 0) return <Loader isLoading={loading} />;

  return (
    <View 
      style={{
        flex: 1, 
        backgroundColor: colors.background 
      }}
      edges={['top']}
    >
      <View className="flex-1" style={{ backgroundColor: colors.background }}>
        <ThemeToggle />
        <ScrollView 
          className="flex-1 p-4" 
          style={{ backgroundColor: colors.background }}
          onScroll={({ nativeEvent }) => {
            const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
            const isEndReached = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
            if (isEndReached && hasMore && !loading) {
              loadMore();
            }
          }}
          scrollEventThrottle={400}
        >
          {episodes.length > 0 ? (
            episodes.map((episode) => (
              <Pressable
                key={episode.$id}
                onPress={() => router.push(`/(categories)/${category}/${book}/${episode.episode}/${episode.$id}`)}
                className="mb-6 rounded-lg p-6"
                style={{ backgroundColor: colors.card }}
              >
                <ThemedText 
                  className="text-2xl font-guttman text-center"
                  style={{
                    textAlign: 'center'
                  }}
                >
                  {episode.episode}
                </ThemedText>
              </Pressable>
            ))
          ) : (
            <ThemedText className="text-xl font-guttman text-center mt-4">
              אין פרקים זמינים
            </ThemedText>
          )}
          {loading && offset > 0 && <Loader isLoading={true} />}
        </ScrollView>
      </View>
    </View>

  );
}