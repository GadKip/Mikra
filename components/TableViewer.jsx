import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const CellContent = ({ content, styles = {}, columnIndex, rowData, rowIndex }) => {
    const { colors, theme } = useTheme();
    
    // Check if col2 is empty for this row
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
                            <Text key={index} className="font-david">
                                {part}
                            </Text>
                        );
                    }
                    return <Text key={index}>{part}</Text>;
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

export const TableViewer = ({ data }) => {
    const { colors, theme } = useTheme();
    
    return (
        <ScrollView style={styles.container}>
            {data.tables.map((table, tableIndex) => (
                <View key={`table-${tableIndex}`} style={[styles.table, { backgroundColor: colors.card }]}>
                    {table.map((rowData, rowIndex) => (
                        <View key={`row-${rowIndex}`} style={[styles.row, { borderBottomColor: colors.border }]}>
                            {rowData.row.map((cellData, cellIndex) => (
                                <View 
                                    key={`cell-${cellIndex}`} 
                                    style={[
                                        styles.cell,
                                        cellIndex === 0 && styles.firstColumn,
                                        cellIndex === 1 && styles.secondColumn,
                                        cellIndex === 2 && styles.thirdColumn,
                                        cellIndex === 3 && [
                                            styles.fourthColumn,
                                            { backgroundColor: theme === 'light' ? '#e5e5e5' : '#2d2d2d' }
                                        ]
                                    ]}
                                >
                                    <CellContent 
                                        content={cellData.cell || ' '} 
                                        styles={cellData.styles} 
                                        columnIndex={cellIndex}
                                        rowData={rowData}
                                        rowIndex={rowIndex}
                                    />
                                </View>
                            ))}
                        </View>
                    ))}
                </View>
            ))}
        </ScrollView>
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