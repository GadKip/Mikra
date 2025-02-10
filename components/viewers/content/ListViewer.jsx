import { View, Text } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

export const ListItem = ({ data }) => {
    const { colors } = useTheme();
    const indentation = data.level * 20;
    
    // Only log in development
    if (__DEV__) {
        console.debug('ListItem:', { level: data.level, data: data }); // Added data log
    }
    
    return (
        <View style={{ flexDirection: 'row', marginRight: indentation }}>
            <Text 
                className="font-davidbd text-xl" 
                style={{ color: colors.text }}
            >
                {data.marker}
            </Text>
            <Text 
                className="font-david text-xl flex-1" 
                style={{ color: colors.text }}
            >
                {data.text}
            </Text>
        </View>
    );
};