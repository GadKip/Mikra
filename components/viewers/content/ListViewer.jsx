import { View, Text } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import ThemedText from '../../ThemedText';

export const ListItem = ({ data }) => {
    const { colors } = useTheme();
    const indentation = data.level * 20;
    
    // Only log in development
    //if (__DEV__) {
    //    console.debug('ListItem:', { level: data.level, data: data });
    //}
    
    return (
        <View style={{ flexDirection: 'row', marginRight: indentation }}>
            <ThemedText 
                className="font-guttman"
                style={{ fontSize: 20 * fontSize }}>
                {data.marker}
            </ThemedText>
            <ThemedText 
                className="font-guttman"
                style={{ fontSize: 20 * fontSize, flex: 1 }}>
                {data.text}
            </ThemedText>
        </View>
    );
};