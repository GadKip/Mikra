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
        minWidth: '13%', // Set absolute minimum width in pixels
        flex: 1,
        flexShrink: 0, // Prevent shrinking smaller than minWidth
        paddingRight: 2
    },
    secondColumn: {
        minWidth: '7%', // Set absolute minimum width in pixels
        flex: 1,
        flexShrink: 0, // Prevent shrinking smaller than minWidth
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