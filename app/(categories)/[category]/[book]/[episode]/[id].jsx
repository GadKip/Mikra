import { View, ScrollView, useWindowDimensions, TouchableOpacity, I18nManager } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import Loader from '../../../../../components/Loader';
import { getDocumentContent } from '../../../../../lib/appwrite';
import { useNavigation } from 'expo-router';
import { ContentViewer } from '../../../../../components/viewers/ContentViewer';
import { useTheme } from '../../../../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function FileViewer() { 
  const { width, height } = useWindowDimensions();
  const { id } = useLocalSearchParams();
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState(null);
  const { colors, fontSize, setFontSize } = useTheme();

  const fetchContent = async () => {
    setLoading(true);
    try {
      const response = await getDocumentContent(id);
      if (response && response.content) {
        const jsonContent = JSON.parse(response.content);
        setTableData(jsonContent);
        setMetadata({
          book: response.book,
          episode: response.episode,
          category: response.category
        });
      } else {
        console.error('No content available');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [id]);

  if (loading) return <Loader isLoading={loading} />;

  return (
    <>
      <View style={{ 
        position: 'absolute',
        top: 60, // Changed from 12 to 60 to position under theme toggle
        right: 4, // Changed from left to right to align with theme toggle
        zIndex: 50,
        flexDirection: 'row',
        backgroundColor: `${colors.card}99`, // Added 99 for 60% opacity
        borderRadius: 20,
        padding: 4,
        gap: 8,
        alignItems: 'center',
        transform: [{ scaleX: 1 }] // Force LTR layout
      }}>
        <TouchableOpacity 
          onPress={() => setFontSize(prev => Math.max(0.4, prev - 0.2))}
          style={{ padding: 4 }}
        >
          <Ionicons name="remove" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setFontSize(prev => Math.min(1.6, prev + 0.2))}
          style={{ padding: 4 }}
          accessibilityLabel="הקטן גודל טקסט"
          accessibilityHint="הקטן גודל טקסט"
        >
          <Ionicons name="add" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1"
        style={{ width: '100%' }}  // Add explicit width
        contentContainerStyle={{ 
          direction: 'rtl',
          width: '100%'  // Add width here too
        }}
      >
        <View style={{ 
          flex: 1, 
          width: '100%',
          alignSelf: 'stretch' 
        }}>
          <ContentViewer 
            data={tableData}
            // Pass orientation info to ContentViewer
            isLandscape={width > height}
          />
        </View>
      </ScrollView>
    </>
  );
}