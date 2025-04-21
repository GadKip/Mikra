import { StyleSheet } from 'react-native';

const baseStyles = {
    cellText: {
        textAlign: 'justify',
        textAlignVertical: 'top',
        flexWrap: 'wrap',
        fontFamily: 'GuttmanKeren',
    },
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
    },
    firstColumn: {
        paddingVertical: 6,
        paddingRight: 2,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        flexDirection: 'row-reverse'
    },
    secondColumn: {
        paddingRight: 2
    },
    thirdColumn: {
        flex: 4,
        minWidth: '40%',
        paddingHorizontal: 4,
        paddingVertical: 6
    },
    fourthColumn: {
        flex: 4,
        minWidth: '40%',
        paddingHorizontal: 4,
        paddingVertical: 6
    }
});