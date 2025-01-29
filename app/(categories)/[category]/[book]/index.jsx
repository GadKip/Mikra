import { View, Text, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../../../context/ThemeContext';
import { useEffect, useState } from 'react';
import { listFiles } from '../../../../lib/appwrite';
import { client } from '../../../../lib/appwrite';
import Loader from '../../../../components/Loader';

export default function EpisodeList() {
  const { category, book } = useLocalSearchParams();
  const router = useRouter();
  const { colors } = useTheme();
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const data = await listFiles(client);
        setEpisodes(data[category]?.[book] || []);
      } catch (error) {
        console.error('Error fetching episodes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisodes();
  }, [category, book]);

  if (loading) return <Loader isLoading={loading} />;

  return (
    <ScrollView className="flex-1 p-4" style={{ backgroundColor: colors.background }}>
      {episodes.map((episode) => (
        <Pressable
          key={episode.$id}
          onPress={() => router.push(`/(categories)/${category}/${book}/${episode}/${episode.$id}`)}
          className="mb-6 rounded-lg p-6"
          style={{ backgroundColor: colors.card }}
        >
          <Text 
            className="text-2xl font-bold text-center"
            style={{ color: colors.text }}
          >
            {episode.episode}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}