// components/TableViewer.jsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const CellContent = ({ content, styles = {} }) => {
    const { colors } = useTheme();
    let textStyle = [baseStyles.cellText, { color: colors.text }];
    
    // Handle relative text size
    if (styles.textSize) {
        textStyle.push({ fontSize: baseStyles.cellText.fontSize * styles.textSize });
    }
    
    if (styles.bold) textStyle.push({ fontWeight: 'bold' });
    if (styles.italic) textStyle.push({ fontStyle: 'italic' });
    if (styles.underline) textStyle.push({ textDecorationLine: 'underline' });
    if (styles.isHeading1) textStyle.push({ fontSize: baseStyles.cellText.fontSize * 1.5, fontWeight: 'bold' });
    if (styles.isHeading2) textStyle.push({ fontSize: baseStyles.cellText.fontSize * 1.25, fontWeight: 'bold' });

    return <Text style={textStyle}>{content}</Text>;
};

export const TableViewer = ({ data }) => {
    const { colors } = useTheme();
    
    if (!data || !data.tables || data.tables.length === 0) {
        return (
            <View style={styles.error}>
                <Text style={{ color: colors.text }}>No table data available</Text>
            </View>
        );
    }

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
                                        cellIndex === 0 && [styles.firstCell, { backgroundColor: colors.secondary }]
                                    ]}
                                >
                                    <CellContent 
                                        content={cellData.cell}
                                        styles={cellData.styles || {}} 
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
        fontSize: 16,
        fontFamily: 'Ezra SIL SR',
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    table: {
        marginVertical: 10,
        borderRadius: 8,
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
    },
    cell: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
    },
    firstCell: {
        width: '30%',
    },
    cellText: {
        ...baseStyles.cellText,
    },
    error: {
        padding: 20,
        alignItems: 'center',
    }
});