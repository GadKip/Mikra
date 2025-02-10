import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { isHebrewChapter } from '../utils/hebrewChapters';

const CellContent = ({ content, styles = {}, columnIndex, rowData, rowIndex }) => {
    const { colors } = useTheme();
    const isCol2Empty = !rowData.row[1]?.cell?.trim();
    
    // If content is an object with both cell and image properties
    const cellText = typeof content === 'object' ? content.cell : content;
    const cellImage = typeof content === 'object' ? content.image : null;

    // Base classes for all cells
    const baseClasses = "flex-1";
    
    // Dynamic classes based on column index
    const columnClasses = (() => {
        if (columnIndex === 0) {
            return styles.bold
                ?
                // If bold, use David font and larger text size
                "text-2xl font-davidbd"
                // If not bold, use Ezra font and smaller text size
                : "text-xs"
        }
        if (columnIndex === 1) {
            return rowIndex === 0 ? "text-3xl" : "text-xs"
        }
        if (columnIndex === 3) {
            return "text-2xl"
        }
        if (columnIndex === 2 && rowIndex === 0) {
            return "text-3xl"
        }
        return "text-xl"
    })();

    // Text style classes
    const styleClasses = [
        styles.bold && "font-davidbd",
        styles.italic && "italic",
        styles.underline && "underline",
        styles.isHeading1 && "text-3xl font-davidbd",
        styles.isHeading2 && "text-2xl font-davidbd",
    ].filter(Boolean).join(" ");

    const renderCol1Content = (text) => {
        const trimmedText = text.trim();
        if (isHebrewChapter(trimmedText) && trimmedText === text.trim()) {
            return (
                <Text
                    className = {styles.bold ? "text-2xl font-davidbd" : "text-2xl font-ezra"}
                >
                    {trimmedText}
                </Text>
            );
        }
        
        return (
            <Text 
                style={{
                    fontSize: 10,
                    flexWrap: 'wrap',
                    textAlign: 'right',
                    color: colors.text,
                    fontFamily: 'Ezra SIL SR',
                    wordBreak: 'normal' // Prevent word splitting
                }}
            >
                {text}
            </Text>
        );
    };

    const renderTextWithParentheses = (text) => {
        const parts = text.split(/(\([^)]+\))/);
        return (
            <>
                {parts.map((part, index) => {
                    if (part.match(/^\([^)]+\)$/)) {
                        return (
                            <Text 
                                key={index} 
                                className="font-david text-text" // Add theme color
                            >
                                {part}
                            </Text>
                        );
                    }
                    return <Text key={index} className="text-text">{part}</Text>;
                })}
            </>
        );
    };

    const fontClass = columnIndex === 3 
        ? (isCol2Empty ? "font-davidbd text-3xl" : "font-guttman")
        : "font-ezra";

    return (
        <View>
            {/* Render text content if exists */}
            {cellText && (
                <Text 
                    className={`
                        ${baseClasses}
                        ${columnClasses}
                        ${styleClasses}
                        ${fontClass}
                    `}
                    style={{ 
                        color: colors.text,
                        textAlign: 'justify',
                        writingDirection: 'rtl',
                        textAlignVertical: 'center',
                        flexWrap: 'wrap',
                        flexShrink: 1,
                        textAlignLast: 'right',
                        paddingTop: 4
                    }}
                    numberOfLines={0}
                    adjustsFontSizeToFit
                    minimumFontScale={0.5}
                    allowFontScaling
                >
                    {columnIndex === 0 
                        ? renderCol1Content(cellText)
                        : columnIndex === 3 && !isCol2Empty 
                            ? renderTextWithParentheses(cellText)
                            : cellText
                    }
                </Text>
            )}

            {/* Render image if exists */}
            {cellImage && (
                <Image
                    source={{ uri: cellImage.src }}
                    alt={cellImage.alt || 'Image'}
                    style={[styles.image, {
                        width: '100%',
                        height: 200,
                        resizeMode: 'contain',
                        marginVertical: 5
                    }]}
                    onError={(e) => {
                        console.error('Cell image load error:', {
                            error: e.nativeEvent,
                            src: cellImage.src?.substring(0, 50) + '...'
                        });
                    }}
                />
            )}
        </View>
    );
};

// Helper function to get column styles
const getColumnStyles = (columnIndex, rowIndex, isCol2Empty, styles) => {
    if (columnIndex === 0) {
        return {
            minWidth: '8%',
            flexShrink: 0,
        };
    }
    // Add other column style cases...
};

const TableHeader = ({ row }) => {
    return (
        <View style={styles.row}>
            {row.map((cell, colIndex) => (
                <View
                    key={colIndex}
                    style={[
                        styles.cell,
                        styles.headerCell,
                        colIndex === 0 && styles.firstColumn,
                        colIndex === 1 && styles.secondColumn,
                        colIndex === 2 && styles.thirdColumn,
                        colIndex === 3 && styles.fourthColumn,
                    ]}
                >
                    <Text style={styles.headerText}>{cell.cell}</Text>
                </View>
            ))}
        </View>
    );
};

// Add Table component
const Table = ({ data, isLandscape }) => {
    const { colors } = useTheme();
    
    // Add responsive styles based on orientation
    const tableStyles = [
        styles.table,
        { 
            borderColor: colors.border,
            // Adjust max-width based on orientation
            maxWidth: isLandscape ? '80%' : '100%',
            alignSelf: 'center'
        }
    ];
    
    if (!Array.isArray(data)) {
        console.error('Table data is not an array:', data);
        return null;
    }
    
    return (
        <View style={tableStyles}>
            {data.map((row, rowIndex) => {
                if (rowIndex === 0) {
                    return <TableHeader key={rowIndex} row={row.row} />;
                }

                return (
                    <View 
                        key={rowIndex} 
                        style={[styles.row, { borderColor: colors.border }]}
                    >
                        {row.row.map((cell, colIndex) => (
                            <View 
                                key={colIndex} 
                                style={[
                                    styles.cell,
                                    colIndex === 0 && styles.firstColumn,
                                    colIndex === 1 && styles.secondColumn,
                                    colIndex === 2 && styles.thirdColumn,
                                    colIndex === 3 && styles.fourthColumn,
                                ]}
                            >
                                <CellContent 
                                    content={cell} 
                                    styles={cell.styles} 
                                    columnIndex={colIndex}
                                    rowData={row}
                                    rowIndex={rowIndex}
                                />
                            </View>
                        ))}
                    </View>
                );
            })}
        </View>
    );
};

export const TableViewer = ({ data, isLandscape }) => {
    const { colors } = useTheme();
    
    // Log initial data
    console.log('TableViewer received data:', {
        hasContent: !!data?.content,
        contentLength: data?.content?.length,
        contentTypes: data?.content?.map(item => item.type)
    });

    if (!data?.content) return null;

    return (
        <View style={{ flex: 1 }}>
            {data.content.map((item, index) => {
                // Log each item being processed
                console.log('Processing content item:', {
                    index,
                    type: item.type,
                    dataPreview: item.type === 'list' ? {
                        length: item.data?.length,
                        firstItem: item.data?.[0]
                    } : item.type === 'image' ? {
                        src: item.data?.src?.substring(0, 50) + '...',
                        alt: item.data?.alt
                    } : 'other'
                });

                if (item.type === 'table') {
                    return <Table 
                        key={`table-${index}`} 
                        data={item.data}
                        isLandscape={isLandscape} 
                    />;
                } else if (item.type === 'list') {
                    return (
                        <View key={`list-${index}`}>
                            {item.data.map((listItem, listIndex) => (
                                <ListItem key={`list-${index}-${listIndex}`} item={listItem} />
                            ))}
                        </View>
                    );
                } else if (item.type === 'text') {
                    return (
                        <Text key={index} 
                            className={`
                                font-davidbd text-center my-4
                                ${item.data.style === 'h1' && 'text-5xl'}
                                ${item.data.style === 'h2' && 'text-4xl'}
                                ${item.data.style === 'h3' && 'text-3xl'}
                            `}
                        >
                            {item.data.text}
                        </Text>
                    );
                } else if (item.type === 'image') {
                    // Add specific image logging
                    console.log('Rendering image:', {
                        src: item.data.src?.substring(0, 50) + '...',
                        alt: item.data.alt,
                        hasSource: !!item.data.src,
                        sourceType: item.data.src?.startsWith('data:') ? 'base64' : 'url'
                    });
                    
                    if (!item.data.src) {
                        console.error('Image missing source:', item);
                        return null;
                    }

                    return (
                        <View key={`image-${index}`} style={styles.imageContainer}>
                            <Image
                                source={{ uri: item.data.src }}
                                alt={item.data.alt || 'Image'}
                                style={styles.image}
                                onError={(e) => {
                                    console.error('Image load error:', {
                                        error: e.nativeEvent,
                                        src: item.data.src?.substring(0, 50) + '...'
                                    });
                                }}
                            />
                        </View>
                    );
                }
                return null;
            })}
        </View>
    );
};

const ListItem = ({ item }) => {
    const { colors } = useTheme();
    const indentation = item.data.level * 20;
    
    console.log('Rendering ListItem:', {
        text: item.data.text,
        marker: item.data.marker,
        level: item.data.level
    });
    
    return (
        <View style={{ flexDirection: 'row', marginRight: indentation }}>
            <Text className="font-davidbd text-xl" style={{ color: colors.text }}>
                {item.data.marker}
            </Text>
            <Text className="font-david text-xl flex-1" style={{ color: colors.text }}>
                {item.data.text}
            </Text>
        </View>
    );
};

const baseStyles = StyleSheet.create({
    cellText: {
        textAlign: 'right',
        fontSize: 24, // Increased from 16
        fontFamily: 'Ezra SIL SR',
    },
});

const styles = StyleSheet.create({
    ...baseStyles,
    container: {
        flex: 1,
    },
    table: {
        marginVertical: 10,
        borderRadius: 8,
        width: '100%'
    },
    row: {
        flexDirection: 'row',  // Remove row-reverse
        borderBottomWidth: 1,
    },
    cell: {
        padding: 5,
        justifyContent: 'flex-end', // Align content to the end (right in RTL)
        alignItems: 'stretch', // Stretch content to fill width
        width: '100%' // Ensure cell takes full width
    },
    firstColumn: {
        minWidth: '8%',  // Increased from 6%
        flex: 1,
    },
    secondColumn: {
        minWidth: '6%',  // Increased from 4%
        flex: 1,
        flexWrap: 'wrap',
    },
    thirdColumn: {
        flex: 4,
        minWidth: '40%',
    },
    fourthColumn: {
        flex: 4,
        minWidth: '40%',
    },
    cellText: {
    },
    error: {
        padding: 20,
        alignItems: 'center',
    },
    headerCell: {
        backgroundColor: '#f0f0f0',
    },
    headerText: {
        fontWeight: 'bold',
    },
    imageContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    image: {
        width: '90%',
        height: 300,
        resizeMode: 'contain',
    },
});