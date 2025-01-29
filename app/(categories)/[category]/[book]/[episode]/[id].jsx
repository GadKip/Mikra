import { View, ScrollView, useWindowDimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import Loader from '../../../../../components/Loader';
import { getDocumentContent } from '../../../../../lib/appwrite';
import { useNavigation } from 'expo-router';
import { TableViewer } from '../../../../../components/TableViewer';

export default function FileViewer() { 
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
        console.log('Raw content:', response.content); // Add this
        const jsonContent = JSON.parse(response.content);
        console.log('Parsed JSON:', jsonContent); // Add this
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

  useEffect(() => {
    if (metadata) {
      navigation.setOptions({
        title: `${metadata.category} > ${metadata.book} > ${metadata.episode}`,
      });
    }
  }, [metadata]);

  if (loading) return <Loader isLoading={loading} />;

  return (
    <ScrollView 
      className="flex-1"
      contentContainerStyle={{ direction: 'rtl' }}
    >
      <View className="p-4">
        <TableViewer data={tableData} />
      </View>
    </ScrollView>
  );
}