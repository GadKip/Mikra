import { View, Text, ScrollView, useWindowDimensions, I18nManager } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import Loader from '../../components/Loader';
import CustomRenderHTML from '../../components/CustomRenderHTML';
import { getDocumentContent } from '../../lib/appwrite';

export default function BookScreen() {
  const { id } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const [content, setContent] = useState('');
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Force RTL layout
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    console.log('Fetching content for ID:', id);
    try {
        const response = await getDocumentContent(id);
        console.log('Response:', response);
        if (response && response.content) {
            setContent(response.content);
            setMetadata({
                book: response.book,
                episode: response.episode,
                category: response.category
            });
        } else {
            setContent('<div dir="rtl">אין תוכן זמין</div>');
        }
    } catch (error) {
        console.error('Error:', error);
        setContent('<div dir="rtl">שגיאה בטעינת התוכן</div>');
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [id]);

  if (loading) return <Loader isLoading={loading} />;

  return (
    <ScrollView 
      className="flex-1 bg-background"
      contentContainerStyle={{ direction: 'rtl' }}
    >
      {metadata && (
        <View className="p-4 border-b border-gray-700">
          <Text className="text-text text-2xl text-right" style={{ writingDirection: 'rtl' }}>
            {metadata.book}
          </Text>
          <Text className="text-text text-xl text-right mt-1" style={{ writingDirection: 'rtl' }}>
            {metadata.episode}
          </Text>
          <Text className="text-text text-lg text-right mt-1 opacity-75" style={{ writingDirection: 'rtl' }}>
            {metadata.category}
          </Text>
        </View>
      )}
      <View className="p-4">
        <CustomRenderHTML
          contentWidth={width}
          source={{ html: content }}
          baseStyle={{ 
            direction: 'rtl',
            textAlign: 'right',
            writingDirection: 'rtl'
          }}
        />
      </View>
    </ScrollView>
  );
}