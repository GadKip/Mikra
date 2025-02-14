import { StyleSheet } from 'react-native';

const baseStyles = {
    cellText: {
        textAlign: 'right',
        textAlignVertical: 'top',
        flexWrap: 'wrap',
        fontFamily: 'EzraSILSR'
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
        padding: 8
    },

    firstColumn: {
        minWidth: 40, // Set absolute minimum width in pixels
        flex: 1,
        flexShrink: 0, // Prevent shrinking smaller than minWidth
    },
    secondColumn: {
        minWidth: 30, // Set absolute minimum width in pixels
        flex: 1,
        flexShrink: 0, // Prevent shrinking smaller than minWidth
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