import { View, ScrollView, useWindowDimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import Loader from '../../../../../components/Loader';
import { getDocumentContent } from '../../../../../lib/appwrite';
import { useNavigation } from 'expo-router';
import { ContentViewer } from '../../../../../components/viewers/ContentViewer';
import { useTheme } from '../../../../../context/ThemeContext';

export default function FileViewer() { 
  const { width, height } = useWindowDimensions();
  const { id } = useLocalSearchParams();
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState(null);

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
  );
}