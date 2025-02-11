import { View, Text } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

export const ListItem = ({ data }) => {
    const { colors } = useTheme();
    const indentation = data.level * 20;
    
    // Only log in development
    //if (__DEV__) {
    //    console.debug('ListItem:', { level: data.level, data: data });
    //}
    
    return (
        <View style={{ flexDirection: 'row', marginRight: indentation }}>
            <Text 
                className="font-ezra text-xl" 
                style={{ color: colors.text }}
            >
                {data.marker}
            </Text>
            <Text 
                className="font-ezra text-xl flex-1" 
                style={{ color: colors.text }}
            >
                {data.text}
            </Text>
        </View>
    );
};