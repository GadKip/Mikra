import { View, ScrollView, useWindowDimensions, Animated } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
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
  const scrollY = useRef(new Animated.Value(0)).current;

  // Header animation
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [60, 0],
    extrapolate: 'clamp'
  });

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

  useEffect(() => {
    if (metadata) {
      navigation.setOptions({
        headerStyle: {
          height: headerHeight,
          opacity: headerHeight.interpolate({
            inputRange: [0, 60],
            outputRange: [0, 1]
          })
        }
      });
    }
  }, [metadata, headerHeight]);

  if (loading) return <Loader isLoading={loading} />;

  return (
    <Animated.ScrollView 
      className="flex-1"
      contentContainerStyle={{ direction: 'rtl' }}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false }
      )}
      scrollEventThrottle={16}
    >
      <View className="flex-1">
        <TableViewer data={tableData} />
      </View>
    </Animated.ScrollView>
  );
}