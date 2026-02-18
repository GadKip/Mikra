import { memo, useMemo } from 'react';
import { View } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { styles } from './styles/table.styles';
import CellContent from './cells/CellContent';

export const Table = memo(({ data, isLandscape, visibleColumns, onItemLayout, scrollViewRef, tableIndex }) => {
    const { colors } = useTheme();
        
    // Base widths that will be adjusted based on orientation
    const widthsCalculated = useMemo(() => {
        const base = {
            0: visibleColumns[0] ? (isLandscape ? 0.065 : 0.12) : 0,
            1: visibleColumns[1] ? (isLandscape ? 0.035 : 0.06) : 0,
            2: visibleColumns[2] ? (isLandscape ? 0.45 : 0.41) : 0,
            3: visibleColumns[3] ? (isLandscape ? 0.45 : 0.41) : 0
        };
        const total = Object.values(base).reduce((a, b) => a + b, 0);
        const mult = total > 0 ? 1 / total : 1;
        return { base, mult };

    }, [visibleColumns, isLandscape]); 

    const tableContainerStyle = useMemo(() => [
        styles.table,
        { borderColor: colors.border }
    ], [colors.border]);

    const rowStyle = useMemo(() => [
        styles.row,
        { borderColor: colors.border }
    ], [colors.border]);

    if (!Array.isArray(data)) {
        return null;
    }
return (
        <View style={tableContainerStyle}>
            {data.map((row, rowIndex) => {
                const { base, mult } = widthsCalculated;

                return (
                    <View key={`row-${rowIndex}`} style={rowStyle}>
                        {row.row.map((cell, colIndex) => {
                            if (!visibleColumns[colIndex]) return null;

                            // Calculate final width percentage
                            const widthPct = colIndex <= 1 ? 
                                base[colIndex] * 100 : 
                                base[colIndex] * 100 * mult;

                            return (
                                <View 
                                    key={`cell-${rowIndex}-${colIndex}`} 
                                    style={[
                                        styles.cell,
                                        {
                                            flex: colIndex <= 1 ? 0 : base[colIndex] * mult,
                                            width: `${widthPct}%`,
                                            minWidth: colIndex <= 1 ? `${widthPct}%` : undefined,
                                            justifyContent: 'flex-start',
                                            // Only apply highlight color if it's the translation column
                                            backgroundColor: colIndex === 3 ? colors.highlight : 'transparent'
                                        },
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
                                        hasChapter={colIndex === 0 && typeof cell.cell === 'string' && isTextIncludesChapter(cell.cell)}
                                        onItemLayout={onItemLayout}
                                        scrollViewRef={scrollViewRef}
                                        cellId={`heading-table-${tableIndex}-${rowIndex}`}
                                    />
                                </View>
                            );
                        })}
                    </View>
                );
            })}
        </View>
    );
}, (prev, next) => {
    // Custom Comparison to prevent any re-render if data hasn't actually changed
    return (
        prev.data === next.data &&
        prev.isLandscape === next.isLandscape &&
        JSON.stringify(prev.visibleColumns) === JSON.stringify(next.visibleColumns)
    );
});
Table.displayName = 'Table';

const isTextIncludesChapter = (text) => {
    const hebrewChapterRegex = /^[א-ת]{1,3}$/;
    const words = String(text).split(/\s+/);
    return words.some(word => hebrewChapterRegex.test(word.trim()));
};