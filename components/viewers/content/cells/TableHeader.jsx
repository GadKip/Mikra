import { View, Text } from 'react-native';
import { styles } from '../styles/table.styles';

const TableHeader = ({ row }) => {
    return (
        <View style={styles.row}>
            {row.map((cell, colIndex) => (
                <View
                    key={`header-cell-${colIndex}`}
                    style={[
                        styles.cell,
                        styles.headerCell,
                        colIndex === 0 && styles.firstColumn,
                        colIndex === 1 && styles.secondColumn,
                        colIndex === 2 && styles.thirdColumn,
                        colIndex === 3 && styles.fourthColumn,
                    ]}
                >
                    <Text style={[styles.headerText, styles.cellText]}>{cell.cell}</Text>
                </View>
            ))}
        </View>
    );
};

export default TableHeader;
