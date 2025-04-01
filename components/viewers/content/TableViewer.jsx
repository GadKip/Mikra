import { View } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { styles } from './styles/table.styles';
import CellContent from './cells/CellContent';

export const Table = ({ data, isLandscape, visibleColumns }) => {
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

    // Calculate total visible columns
    const visibleColumnCount = Object.values(visibleColumns).filter(Boolean).length;
    
    return (
        <View style={tableStyles}>
            {data.map((row, rowIndex) => {
                // Get base widths for visible columns
                const baseWidths = {
                    0: visibleColumns[0] ? 0.13 : 0, // 13%
                    1: visibleColumns[1] ? 0.07 : 0, // 7%
                    2: visibleColumns[2] ? 0.4 : 0,  // 40%
                    3: visibleColumns[3] ? 0.4 : 0   // 40%
                };


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
                            
                            return visibleColumns[colIndex] && (
                                <View 
                                    key={`cell-${rowIndex}-${colIndex}`} 
                                    style={[
                                        styles.cell,
                                        {
                                            flex: baseWidths[colIndex] * multiplier,
                                            minWidth: `${baseWidths[colIndex] * 100 * multiplier}%`,
                                            display: visibleColumns[colIndex] ? 'flex' : 'none'
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