import { View  } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { styles } from './styles/table.styles';
import CellContent from './cells/CellContent';

export const Table = ({ data, isLandscape }) => {
    const { colors } = useTheme();
    
    const tableStyles = [
        styles.table,
        { 
            borderColor: colors.border,
            }
    ];
    
    if (!Array.isArray(data)) {
        if (__DEV__) {
            console.error('Table data is not an array:', data);
        }
        return null;
    }
    
    return (
        <View style={tableStyles}>
            {data.map((row, rowIndex) => {
                return (
                    <View 
                        key={`row-${rowIndex}`} 
                        style={[
                            styles.row, 
                            { 
                                borderColor: colors.border,
                                overflow: 'visible'  // Add this
                            },
                        ]}
                    >
                        {row.row.map((cell, colIndex) => (
                            <View 
                                key={`cell-${rowIndex}-${colIndex}`} 
                                style={[
                                    styles.cell,
                                    {overflow: 'visible',
                                        transform: [{ perspective: 1000 }], // Improve text rendering
                                        backfaceVisibility: 'hidden', // Improve text rendering
                            
                                    },
                                    colIndex === 0 && styles.firstColumn,
                                    colIndex === 1 && styles.secondColumn,
                                    colIndex === 2 && styles.thirdColumn,
                                    colIndex === 3 && [styles.fourthColumn, {
                                        backgroundColor: colors.highlight,
                                    }],
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