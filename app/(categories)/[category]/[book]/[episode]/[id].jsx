import { View, ScrollView, useWindowDimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import Loader from '../../../../../components/Loader';
import { getDocumentContent } from '../../../../../lib/appwrite';
import { useNavigation } from 'expo-router';
import { TableViewer } from '../../../../../components/JSONViewer';
import { useTheme } from '../../../../../context/ThemeContext';

export default function FileViewer() { 
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();
  const { id } = useLocalSearchParams();
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState(null);
  const navigation = useNavigation();

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
      contentContainerStyle={{ 
        direction: 'rtl',
        // Add padding that adjusts based on orientation
        paddingHorizontal: width > height ? 40 : 10 
      }}
    >
      <View className="flex-1">
        <TableViewer 
          data={tableData}
          // Pass orientation info to TableViewer
          isLandscape={width > height}
        />
      </View>
    </ScrollView>
  );
}