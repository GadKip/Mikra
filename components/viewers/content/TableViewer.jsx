import { View } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { styles } from './styles/table.styles';
import TableHeader from './cells/TableHeader'; // Update import
import CellContent from './cells/CellContent';

export const Table = ({ data, isLandscape }) => {
    const { colors } = useTheme();
    
    const tableStyles = [
        styles.table,
        { 
            borderColor: colors.border,
            maxWidth: isLandscape ? '80%' : '100%',
            alignSelf: 'center'
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
                if (rowIndex === 0) {
                    return <TableHeader key={`header-${rowIndex}`} row={row.row} />;
                }

                return (
                    <View 
                        key={`row-${rowIndex}`} 
                        style={[styles.row, { borderColor: colors.border }]}
                    >
                        {row.row.map((cell, colIndex) => (
                            <View 
                                key={`cell-${rowIndex}-${colIndex}`} 
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