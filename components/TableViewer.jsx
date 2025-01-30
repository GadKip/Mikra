// components/TableViewer.jsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const CellContent = ({ content, styles = {}, columnIndex }) => {
    const { colors } = useTheme();
    let textStyle = [
        baseStyles.cellText, 
        { 
            color: colors.text,
            className: 'text-right text-justify',
            fontFamily: styles.fontFamily || 'Ezra SIL SR',
            textAlign: 'right',
            writingDirection: 'rtl',
            fontSize: (() => {
                if (columnIndex === 0) {
                    return styles.bold 
                        ? baseStyles.cellText.fontSize * 0.8
                        : baseStyles.cellText.fontSize * 0.35
                }
                if (columnIndex === 1) {
                    return baseStyles.cellText.fontSize * 0.5
                }
                return baseStyles.cellText.fontSize
            })()
        }
    ];
    
    if (styles.textSize) {
        textStyle.push({ fontSize: textStyle[0].fontSize * styles.textSize });
    }
    if (styles.bold) textStyle.push({ fontWeight: 'bold' });
    if (styles.italic) textStyle.push({ fontStyle: 'italic' });
    if (styles.underline) textStyle.push({ textDecorationLine: 'underline' });
    if (styles.isHeading1) textStyle.push({ fontSize: textStyle[0].fontSize * 1.5, fontWeight: 'bold' });
    if (styles.isHeading2) textStyle.push({ fontSize: textStyle[0].fontSize * 1.25, fontWeight: 'bold' });

    return (
        <Text 
            style={textStyle} 
            numberOfLines={0}
            adjustsFontSizeToFit={true}
            minimumFontScale={0.5}
            allowFontScaling={true}
        >
            {content}
        </Text>
    );
};

export const TableViewer = ({ data }) => {
    const { colors } = useTheme();
    
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
                                        cellIndex === 3 && [styles.fourthColumn, { backgroundColor: colors.secondary }],
                                    ]}
                                >
                                    <CellContent 
                                        content={cellData.cell || ' '} 
                                        styles={cellData.styles} 
                                        columnIndex={cellIndex}
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
        justifyContent: 'center',
        alignItems: 'flex-end',  // Align content to the right
        flexShrink: 0,  // Prevent cell shrinking
    },
    firstColumn: {
        minWidth: '8.5%',  // Increased from 6%
        flex: 1,
        flexWrap: 'wrap',
    },
    secondColumn: {
        minWidth: '8.5%',  // Increased from 4%
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