import { View, ScrollView, useWindowDimensions, TouchableOpacity, Platform, ActivityIndicator, StatusBar } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState, useRef } from 'react';
import Loader from '../../../../../components/Loader';
import { getDocumentContent } from '../../../../../lib/appwrite';
import { ContentViewer } from '../../../../../components/viewers/ContentViewer';
import { useTheme } from '../../../../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import ThemedText from '../../../../../components/ThemedText';
import { IndexSidebar } from '../../../../../components/IndexSidebar';
import { SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';

export default function FileViewer() { 
    const { width, height } = useWindowDimensions();
    const { id } = useLocalSearchParams();
    const [metadata, setMetadata] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tableData, setTableData] = useState(null);
    const { colors, fontSize, setFontSize, visibleColumns, toggleColumn, columnLoading, theme, toggleTheme } = useTheme();
    const [showControlsMenu, setShowControlsMenu] = useState(false);
    const [headings, setHeadings] = useState([]);
    const [showIndex, setShowIndex] = useState(false);
    const [layoutMap, setLayoutMap] = useState({});
    const scrollViewRef = useRef(null);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const insets = useSafeAreaInsets();

    const fetchContent = async () => {
    setLoading(true);
    try {
        const response = await getDocumentContent(id);
        if (response && response.content) {
        const jsonContent = JSON.parse(response.content);

        setTableData(jsonContent);
        setLayoutMap({}); // Reset layout map on new content
        
        const extractedHeadings = [];

        // 1. Add "Top of Page" as the very first item
        extractedHeadings.push({
        id: 'top',
        text: 'תחילת הדף', // Hebrew for "Top of Page"
        });

        jsonContent.content.forEach((item, index) => {
        // 2. Capture headings outside the table
        if (item.type === 'text' && item.data?.style === 'h2') {
            extractedHeadings.push({ 
            id: `heading-${index}`, 
            text: item.data.text 
            });
        }

        // 3. Capture headings inside the table
        if (item.type === 'table' && Array.isArray(item.data)) {
            item.data.forEach((rowData, rowIndex) => {
            const col2Text = rowData.row?.[1]?.cell?.trim();
            const col4Text = rowData.row?.[3]?.cell?.trim();

            if (col4Text && !col2Text) {
                extractedHeadings.push({
                id: `heading-table-${index}-${rowIndex}`,
                text: col4Text,
                });
            }
            });
        }
        });

        setHeadings(extractedHeadings);
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

    const handleItemLayout = ({ id, index, y }) => {
        setLayoutMap((prev) => ({
            ...prev,
            [id]: y,
        }));
    };

    const handleJump = (headingId) => {
    // Handle the top anchor manually
    if (headingId === 'top') {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        return;
    }

    // Handle all other tracked headings
    const position = layoutMap[headingId];
    if (position !== undefined && scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
        y: Math.max(0, position - 60),
        animated: true,
        });
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
                backgroundColor: `${colors.highlight}E6`,
                borderRadius: 20,
                padding: 8,
                justifyContent: 'center'
            }}
        >
            <Ionicons
                name={showControlsMenu ? 'close' : 'menu'}
                size={24}
                color={colors.text}
            />
        </TouchableOpacity>

        {showControlsMenu && (
            <View style={{
                marginTop: 8,
                backgroundColor: `${colors.card}F2`,
                borderRadius: 12,
                padding: 8,
                gap: 8,
            }}>
                {/* Index Toggle */}
                {headings.length > 0 && (
                    <View>
                        <TouchableOpacity
                            onPress={() => setShowIndex(!showIndex)}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8,
                                padding: 8,
                                backgroundColor: showIndex ? colors.highlight : 'transparent',
                                borderRadius: 8,
                            }}
                        >
                            <Ionicons name="list" size={20} color={colors.text} />
                            <ThemedText style={{ fontSize: 16 }}>
                                תוכן עניינים
                            </ThemedText>
                        </TouchableOpacity>
                    </View>
                )}

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
    <View 
        style={{ 
            flex: 1, 
            backgroundColor: colors.background,
            paddingTop: insets.top
        }}
    >
        <StatusBar
            barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
            backgroundColor={theme === 'dark' ? colors.card : 'transparent'}
            translucent={true}
        />
        <View style={{ flex: 1, position: 'relative' }}>
            {renderControls()}
        <ScrollView 
            ref={scrollViewRef}
            onScroll={(event) => {
            const verticalOffset = event.nativeEvent.contentOffset.y;
            if (verticalOffset > 300) { // If scrolled down more than 300 pixels
            setShowScrollButton(true);
            } else {
            setShowScrollButton(false);
            }
        }}
            scrollEventThrottle={16}
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
                onItemLayout={handleItemLayout}
                scrollViewRef={scrollViewRef}
            />
            </View>
        </ScrollView>
        <IndexSidebar
            headings={headings}
            onJump={handleJump}
            onClose={() => setShowIndex(false)}
            isOpen={showIndex}
        />
        {showScrollButton && (
            <TouchableOpacity
                style={{
                    position: 'absolute',
                    bottom: 30,
                    left: 20,
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    justifyContent: 'center',
                    alignItems: 'center',
                    // Shadow for iOS
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 3,
                    // Shadow for Android
                    elevation: 5,
                    zIndex: 999, // Ensure it sits on top of the table
                }}
                onPress={() => handleJump('top')}
            >
                <Ionicons name="arrow-up" size={30} color="#fff" />
            </TouchableOpacity>
        )}
        </View>
    </View>
    );
}