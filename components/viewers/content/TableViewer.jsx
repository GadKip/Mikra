import { View } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { styles } from './styles/table.styles';
import CellContent from './cells/CellContent';

export const Table = ({ data, isLandscape, visibleColumns, onItemLayout, scrollViewRef, tableIndex }) => {
    const { colors } = useTheme();
        
    const tableStyles = [
        styles.table,
        { borderColor: colors.border }
    ];
    
    if (!Array.isArray(data)) {
        if (__DEV__) {
            console.error('Table data is not an array:', data);
        }
        return null;
    }

    const isTextIncludesChapter = (text) => {
        const hebrewChapterRegex = /^[א-ת]{1,3}$/;
        const words = String(text).split(/\s+/);
        return words.some(word => hebrewChapterRegex.test(word.trim()));
    };

    // Base widths that will be adjusted based on orientation
    const getBaseWidths = () => ({
        0: visibleColumns[0] ? (isLandscape ? 0.065 : 0.12) : 0, // 13% in portrait, 6.5% in landscape
        1: visibleColumns[1] ? (isLandscape ? 0.035 : 0.06) : 0, // 7% in portrait, 3.5% in landscape
        2: visibleColumns[2] ? (isLandscape ? 0.45 : 0.41) : 0,  // 40% always
        3: visibleColumns[3] ? (isLandscape ? 0.45 : 0.41) : 0   // 40% always
    });

    return (
        <View style={tableStyles}>
            {data.map((row, rowIndex) => {
                const baseWidths = getBaseWidths();

                // Adjust widths based on visible columns
                const totalWidth = Object.values(baseWidths).reduce((a, b) => a + b, 0);
                const multiplier = totalWidth > 0 ? 1 / totalWidth : 1;

                return (
                    <View 
                        key={`row-${rowIndex}`} 
                        style={[
                            styles.row, 
                            { borderColor: colors.border }
                        ]}
                    >
                        {row.row.map((cell, colIndex) => {
                            const width = colIndex <= 1 ? 
                                baseWidths[colIndex] * 100 : 
                                baseWidths[colIndex] * 100 * multiplier;

                            return visibleColumns[colIndex] && (
                                <View 
                                    key={`cell-${rowIndex}-${colIndex}`} 
                                    style={[
                                        styles.cell,
                                        {
                                            flex: colIndex <= 1 ? 0 : baseWidths[colIndex] * multiplier,
                                            width: `${width}%`,
                                            minWidth: colIndex <= 1 ? `${width}%` : undefined,
                                            display: visibleColumns[colIndex] ? 'flex' : 'none',
                                            justifyContent: 'flex-start'
                                        },
                                        colIndex === 0 && styles.firstColumn,
                                        colIndex === 1 && styles.secondColumn,
                                        colIndex === 2 && styles.thirdColumn,
                                        colIndex === 3 && [styles.fourthColumn, {
                                            backgroundColor: colors.highlight
                                        }]
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
};