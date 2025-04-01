import { View, ScrollView, useWindowDimensions, TouchableOpacity, I18nManager, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import Loader from '../../../../../components/Loader';
import { getDocumentContent } from '../../../../../lib/appwrite';
import { useNavigation } from 'expo-router';
import { ContentViewer } from '../../../../../components/viewers/ContentViewer';
import { useTheme } from '../../../../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '../../../../../components/ThemedText';

export default function FileViewer() { 
  const { width, height } = useWindowDimensions();
  const { id } = useLocalSearchParams();
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState(null);
  const { colors, fontSize, setFontSize, visibleColumns, toggleColumn } = useTheme();
  const [showColumnMenu, setShowColumnMenu] = useState(false);

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

  const renderColumnControls = () => (
    <View style={{
        position: 'absolute',
        top: 120,
        right: 4,
        zIndex: 50,
        direction: 'ltr',
    }}>
        <TouchableOpacity
            onPress={() => setShowColumnMenu(!showColumnMenu)}
            style={{
                backgroundColor: `${colors.card}99`,
                borderRadius: 20,
                padding: 8,
            }}
        >
            <Ionicons
                name={showColumnMenu ? 'menu' : 'menu-outline'}
                size={24}
                color={colors.text}
            />
        </TouchableOpacity>

        {showColumnMenu && (
            <View style={{
                marginTop: 8,
                backgroundColor: `${colors.card}99`,
                borderRadius: 12,
                padding: 8,
                gap: 8,
            }}>
                <ThemedText style={{ fontSize: 14, marginBottom: 4, textAlign: 'center' }}>
                    הצג עמודות
                </ThemedText>
                {[
                    { id: 0, label: 'פרק' },
                    { id: 1, label: 'פסוק' },
                    { id: 2, label: 'מקור' },
                    { id: 3, label: 'תרגום' }
                ].map(col => (
                    <TouchableOpacity
                        key={col.id}
                        onPress={() => {
                            // Don't allow hiding both content columns
                            if (col.id >= 2) {
                                const otherContentCol = col.id === 2 ? 3 : 2;
                                if (!visibleColumns[otherContentCol] && visibleColumns[col.id]) {
                                    return;
                                }
                            }
                            toggleColumn(col.id);
                        }}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 8,
                            padding: 4
                        }}
                    >
                        <Ionicons
                            name={visibleColumns[col.id] ? 'eye' : 'eye-off'}
                            size={20}
                            color={colors.text}
                        />
                        <ThemedText style={{ fontSize: 16 }}>
                            {col.label}
                        </ThemedText>
                    </TouchableOpacity>
                ))}
            </View>
        )}
    </View>
  );

  useEffect(() => {
    fetchContent();
  }, [id, visibleColumns]);

  if (loading) return <Loader isLoading={loading} />;

  return (
    <>
      <View style={{ 
        position: 'absolute',
        top: 60,
        right: 4,
        zIndex: 50,
        flexDirection: 'row',
        backgroundColor: `${colors.card}99`,
        borderRadius: 20,
        padding: 4,
        gap: 8,
        alignItems: 'center',
        direction: 'ltr',
        writingDirection: 'ltr',
        ...(Platform.OS === 'android' && {
          layoutDirection: 'ltr',
        })
      }}>
        <TouchableOpacity 
          onPress={() => {
            const newSize = Math.max(0.4, fontSize - 0.2);
            setFontSize(newSize);
          }}
          style={{ padding: 4 }}
        >
          <Ionicons name="remove" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => {
            const newSize = Math.min(1.6, fontSize + 0.2);
            setFontSize(newSize);
          }}
          style={{ padding: 4 }}
          accessibilityLabel="הגדל גודל טקסט"
          accessibilityHint="הגדל גודל טקסט"
        >
          <Ionicons name="add" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {renderColumnControls()}

      <ScrollView 
        className="flex-1"
        style={{ width: '100%' }}
        contentContainerStyle={{ 
          direction: 'rtl',
          width: '100%'
        }}
      >
        <View style={{ 
          flex: 1, 
          width: '100%',
          alignSelf: 'stretch' 
        }}>
          <ContentViewer 
            data={tableData}
            isLandscape={width > height}
            visibleColumns={visibleColumns}
          />
        </View>
      </ScrollView>
    </>
  );
}