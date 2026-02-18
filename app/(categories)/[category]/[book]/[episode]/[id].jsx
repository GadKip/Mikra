import { View, ScrollView, useWindowDimensions, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import Loader from '../../../../../components/Loader';
import { getDocumentContent } from '../../../../../lib/appwrite';
import { ContentViewer } from '../../../../../components/viewers/ContentViewer';
import { useTheme } from '../../../../../context/ThemeContext';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import ThemedText from '../../../../../components/ThemedText';
import { IndexSidebar } from '../../../../../components/IndexSidebar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function FileViewer() { 
    const { width, height } = useWindowDimensions();
    const { id } = useLocalSearchParams();
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
    const isLandscape = useMemo(() => width > height, [width, height]);

    const fetchContent = useCallback(async () => {
    setLoading(true);
    setTimeout(async () => {
        try {
            const response = await getDocumentContent(id);
            if (response && response.content) {
                const jsonContent = JSON.parse(response.content);

            setTableData(jsonContent);
            setLayoutMap({}); // Reset layout map on new content
            
            setTimeout( () => {
                const extractedHeadings = [];
            extractedHeadings.push({
            id: 'top',
            text: 'ראש הדף',
            });

            jsonContent.content.forEach((item, index) => {
            if (item.type === 'text' && item.data?.style === 'h2') {
                extractedHeadings.push({ 
                id: `heading-${index}`, 
                text: item.data.text 
                });
            }
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
            }, 0); // Delay to ensure layout is ready
        }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    }, 10);}, [id]);

    const handleItemLayout = useCallback(({ id, index, y }) => {
        setLayoutMap((prev) => ({
            ...prev,
            [id]: y,
        }));
    }, []);

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
            position: 'absolute',
            end: 10,
            top: 40,
            zIndex: 1000,
            flexDirection: 'column',
            alignItems: 'flex-end',
        }}>
            <TouchableOpacity
                onPress={() => setShowControlsMenu(!showControlsMenu)}
                style={{
                    backgroundColor: `${colors.emphasisSec}CC`,
                    borderRadius: 25,
                    padding: 10,
                    justifyContent: 'center'
                }}
            >
                <Ionicons
                    name={showControlsMenu ? 'close' : 'options'}
                    size={24}
                    color={colors.text}
                />
            </TouchableOpacity>

            {showControlsMenu && (
                <View style={{
                    marginTop: 8,
                    backgroundColor: `${colors.emphasisSec}F2`,
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
                                    flexDirection: 'row-reverse',
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
                                    דלג אל... 
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
                            <AntDesign name="font-size" size={20} color={colors.text} />
                            <TouchableOpacity 
                                onPress={() => {
                                    const newSize = Math.max(0.4, fontSize - 0.2);
                                    setFontSize(newSize);
                                }}
                            >
                                <Ionicons name="remove" size={24} color={colors.text} />
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => {
                                    const newSize = Math.min(1.6, fontSize + 0.2);
                                    setFontSize(newSize);
                                }}
                            >
                                <Ionicons name="add" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Column Controls */}
                    <View>
                        <ThemedText style={{ fontSize: 14, marginBottom: 4, textAlign: 'center' }}>
                            הצג/הסתר עמודות
                        </ThemedText>
                        {[
                            { id: 0, label: 'פרק' },
                            { id: 1, label: 'פסוק' },
                            { id: 2, label: 'מקרא' },
                            { id: 3, label: 'תרגום' }
                        ].map(col => (
                            <TouchableOpacity
                                key={col.id}
                                onPress={() => toggleColumn(col.id)}
                                style={{
                                    flexDirection: 'row-reverse',
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
    }, [id, visibleColumns, fetchContent]);

    if (loading) return <Loader isLoading={loading} />;

    return (
    <View 
        style={{ 
            flex: 1,
            direction: 'rtl', 
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
            <View style={{ direction: 'ltr' }}>
                {renderControls()}
            </View>
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
                width: '100%'
                }}
            >
                
                <View key={theme.mode} style={{ 
                flex: 1, 
                width: '100%',
                alignSelf: 'stretch'
                }}>
                <ContentViewer 
                    data={tableData}
                    isLandscape= {isLandscape}
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
                        end: 20,
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        alignItems: 'center',
                        justifyContent: 'center',
                        shadowRadius: 3,
                        zIndex: 999, // Ensure it sits on top of the table
                        backgroundColor: `${colors.emphasis}CC`, // Semi-transparent background
                    }}
                    onPress={() => handleJump('top')}
                >
                    <Ionicons name="arrow-up" size={30} color={colors.text} />
                </TouchableOpacity>
            )}
        </View>
    </View>
    );
}