import { View, ScrollView, useWindowDimensions, TouchableOpacity, Platform, ActivityIndicator, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import Loader from '../../../../../components/Loader';
import { getDocumentContent } from '../../../../../lib/appwrite';
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
  const { colors, fontSize, setFontSize, visibleColumns, toggleColumn, columnLoading, theme, toggleTheme } = useTheme();
  const [showControlsMenu, setShowControlsMenu] = useState(false);

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

  const renderControls = () => (
    <View style={{
        direction: 'ltr',
        start: undefined,
        end: 10,
        position: 'absolute',
        top: 10, // Adjust top position to account for header
        backgroundColor: 'transparent',
        zIndex: 50,

    }}>
        <TouchableOpacity
            onPress={() => setShowControlsMenu(!showControlsMenu)}
            style={{
                backgroundColor: `${colors.highlight}99`,
                borderRadius: 20,
                padding: 8,
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Ionicons
                name={showControlsMenu ? 'menu' : 'menu-outline'}
                size={24}
                color={colors.text}
            />
        </TouchableOpacity>

        {showControlsMenu && (
            <View style={{
                marginTop: 8,
                backgroundColor: `${colors.card}99`,
                borderRadius: 12,
                padding: 8,
                gap: 8,
            }}>
                {/* Theme Toggle */}
                <View>
                    <ThemedText style={{ fontSize: 14, marginBottom: 4, textAlign: 'center' }}>
                        ערכת נושא
                    </ThemedText>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        gap: 8,
                        padding: 4
                    }}>
                        <TouchableOpacity 
                            onPress={toggleTheme}
                            style={{ padding: 4 }}
                        >
                            <Ionicons 
                                name={theme === 'light' ? 'moon' : 'sunny'} 
                                size={24} 
                                color={colors.text}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Font Size Controls */}
                <View>
                    <ThemedText style={{ fontSize: 14, marginBottom: 4, textAlign: 'center' }}>
                        גודל טקסט
                    </ThemedText>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        gap: 8,
                        padding: 4
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
                        >
                            <Ionicons name="add" size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Column Controls */}
                <View>
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
                            onPress={() => toggleColumn(col.id)}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
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
                    {columnLoading && (
                        <ActivityIndicator size="small" color={colors.text} />
                    )}
                </View>
            </View>
        )}
    </View>
  );

  useEffect(() => {
    fetchContent();
  }, [id, visibleColumns]);

  if (loading) return <Loader isLoading={loading} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
      />
      {renderControls()}
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
    </SafeAreaView>
  );
}