import { StyleSheet } from 'react-native';

const baseStyles = {
    cellText: {
        textAlign: 'right',
        textAlignVertical: 'top',
        flexWrap: 'wrap',},
};

export const styles = StyleSheet.create({
    ...baseStyles,
    table: {
        width: '100%',
        minWidth: '100%',
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        minHeight: 40,
    },
    cell: {
        alignItems: 'stretch',
        textAlignVertical: 'top',
        padding: 8
    },

    firstColumn: {
        minWidth: '8%',
        flex: 1,
    },
    secondColumn: {
        minWidth: '6%',
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
    }
});