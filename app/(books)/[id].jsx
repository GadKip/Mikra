import { View, Text, ScrollView, useWindowDimensions, I18nManager, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import Loader from '../../components/Loader';
import CustomRenderHTML from '../../components/CustomRenderHTML';
import { getDocumentContent } from '../../lib/appwrite';
import { useRouter, useNavigation, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function BookScreen() {
  const { id } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const [content, setContent] = useState('');
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const router = useRouter();
  useEffect(() => {
    // Force RTL layout
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
        const response = await getDocumentContent(id);
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

  useEffect(() => {
    if (metadata) {
      navigation.setOptions({
        title: metadata.episode
      });
    }
  }, [metadata]);

  if (loading) return <Loader isLoading={loading} />;

  return (
    <>
      <ScrollView 
        className="flex-1 bg-background"
        contentContainerStyle={{ direction: 'rtl' }}
      >
        <Pressable 
          onPress={() => router.replace('/(books)')}
          style={{ marginLeft: 16 }}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </Pressable>
        {metadata && (
          <View className="p-4 bg-gray-900 border-b border-gray-800">
            <Text className="text-text text-2xl font-bold text-right mb-2" 
                  style={{ writingDirection: 'rtl' }}>
              {metadata.book}
            </Text>
            <Text className="text-text text-xl text-right" 
                  style={{ writingDirection: 'rtl' }}>
              {metadata.episode}
            </Text>
            <View className="flex-row justify-end mt-2">
              <Text className="text-gray-400 text-sm px-3 py-1 bg-gray-800 rounded-full">
                {metadata.category}
              </Text>
            </View>
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
    </>
  );

}