import { Text } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

export const TextContent = ({ data }) => {
    const { colors } = useTheme();
    
    return (
        <Text 
            className={`
                font-ezra text-center my-4
                ${data.style === 'h1' && 'text-4xl'}
                ${data.style === 'h2' && 'text-3xl'}
                ${data.style === 'h3' && 'text-2xl'}
            `}
            style={{ color: colors.text }}
        >
            {data.text}
        </Text>
    );
};