import { StyleSheet } from 'react-native';

const baseStyles = {
    cellText: {
        textAlign: 'right',
        fontSize: 24,
        fontFamily: 'Ezra SIL SR',
    },
};

export const styles = StyleSheet.create({
    ...baseStyles,
    table: {
        marginVertical: 10,
        borderRadius: 8,
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
    },
    cell: {
        padding: 5,
        justifyContent: 'flex-end',
        alignItems: 'stretch',
        width: '100%'
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
    },
    headerCell: {
        backgroundColor: '#f0f0f0',
    },
    headerText: {
        fontWeight: 'bold',
    }
});