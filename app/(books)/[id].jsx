import { View, Text, ScrollView, useWindowDimensions, I18nManager, Pressable } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import Loader from '../../components/Loader';
import CustomRenderHTML from '../../components/CustomRenderHTML';
import { getDocumentContent } from '../../lib/appwrite';
import { useRouter, useNavigation, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

/**
 * BookScreen - Displays a single book's content with metadata
 * Handles RTL layout and themed styling
 */
export default function BookScreen() {  // Changed back to BookScreen
  const { id } = useLocalSearchParams();
  const { width } = useWindowDimensions();
  const [content, setContent] = useState('');
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const router = useRouter();
  const { theme } = useTheme();

  /**
   * Fetches book content and metadata from Appwrite
   * Sets error content if fetch fails
   */
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

  // Initial content fetch on component mount or id change
  useEffect(() => {
    fetchContent();
  }, [id]);

  // Update navigation header with hierarchical title and back button
  useEffect(() => {
    if (metadata) {
      navigation.setOptions({
        title: `${metadata.category} > ${metadata.book} > ${metadata.episode}`,
        headerLeft: () => (
          <Pressable 
            onPress={() => router.back()} 
            style={({ pressed }) => ({
              marginLeft: 16,
              padding: 8,
              opacity: pressed ? 0.5 : 1,
              zIndex: 1
            })}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons 
              name={I18nManager.isRTL ? "arrow-forward" : "arrow-back"} 
              size={24} 
              color={theme.text} 
            />
          </Pressable>
        )
      });
    }
  }, [metadata, theme]);

  // Show loader while content is being fetched
  if (loading) return <Loader isLoading={loading} />;

  return (
    <ScrollView 
      // Main container with RTL support
      style={{ backgroundColor: theme.background }}
      className="flex-1"
      contentContainerStyle={{ direction: 'rtl' }}
    >
      
      {/* Book content section with HTML rendering */}
      <View className="p-4">
        <CustomRenderHTML
          contentWidth={width}
          source={{ html: content }}
        />
      </View>
    </ScrollView>
  );

}