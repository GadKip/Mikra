import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const CellContent = ({ content, styles = {}, columnIndex, rowData, rowIndex }) => {
    const { colors } = useTheme();
    const isCol2Empty = !rowData.row[1]?.cell?.trim();
    
    // Base classes for all cells
    const baseClasses = "flex-1";
    
    // Dynamic classes based on column index
    const columnClasses = (() => {

        if (columnIndex === 0) {
            return styles.bold 
                ? "text-[19px] font-davidbd" // Use David for bold text
                : "text-[8px]"
        }
        if (columnIndex === 1) {
            return rowIndex === 0 ? "text-3xl" : "text-[12px]"
        }
        if (columnIndex === 3) {
            return "text-2xl" // Larger font size for column 4
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

    const renderTextWithParentheses = (text) => {
        const parts = text.split(/(\([^)]+\))/);
        return (
            <>
                {parts.map((part, index) => {
                    if (part.match(/^\([^)]+\)$/)) {
                        return (
                            <Text 
                                key={index} 
                                className="font-david"
                                style={{ color: colors.text }} // Add theme color
                            >
                                {part}
                            </Text>
                        );
                    }
                    return <Text key={index} style={{ color: colors.text }}>{part}</Text>;
                })}
            </>
        );
    };

    const fontClass = columnIndex === 3 
    ? (isCol2Empty 
        ? "font-davidbd text-3xl" 
        : "font-guttman"
    ) 
    : "font-ezra";

    return (
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
                paddingTop: 4    // Add some top padding specifically for text
            }}
            numberOfLines={0}
            adjustsFontSizeToFit
            minimumFontScale={0.5}
            allowFontScaling
        >
            {columnIndex === 3 && !isCol2Empty 
                ? renderTextWithParentheses(content)
                : content
            }
        </Text>
    );
};

// Add Table component
const Table = ({ data }) => {
    const { colors } = useTheme();
    
    if (!Array.isArray(data)) {
        console.error('Table data is not an array:', data);
        return null;
    }
    
    return (
        <View style={[styles.table, { borderColor: colors.border }]}>
            {data.map((row, rowIndex) => (
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
                                content={cell.cell} 
                                styles={cell.styles} 
                                columnIndex={colIndex}
                                rowData={row}
                                rowIndex={rowIndex}
                            />
                        </View>
                    ))}
                </View>
            ))}
        </View>
    );
};

export const TableViewer = ({ data }) => {
    const { colors } = useTheme(); // Add this line
    
    if (!data?.content) return null;

    return (
        <View>
            {data.content.map((item, index) => {
                if (item.type === 'table') {
                    return <Table key={`table-${index}`} data={item.data} />;
                } else if (item.type === 'text') {
                    return (
                        <Text
                            key={`text-${index}`}
                            className={`
                                text-center mb-4
                                ${item.style === 'h1' && 'text-3xl font-ezra'}
                                ${item.style === 'h2' && 'text-3xl font-ezra'}
                                ${item.style === 'h3' && 'text-3xl font-ezra'}
                                ${item.style === 'p' && 'text-lg'}
                            `}
                            style={{ 
                                color: colors.text,
                                backgroundColor: colors.background 
                            }}                        
                        >
                            {item.data.text}
                        </Text>
                    );
                }
                return null;
            })}
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
        overflow: 'hidden',
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
        flexShrink: 0,
        width: '100%' // Ensure cell takes full width
    },
    firstColumn: {
        minWidth: '8%',  // Increased from 6%
        flex: 1,
        flexWrap: 'wrap',
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
        ...baseStyles.cellText,
        flexWrap: 'wrap',
    },
    error: {
        padding: 20,
        alignItems: 'center',
    }
});