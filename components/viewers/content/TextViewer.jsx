import { useTheme } from '../../../context/ThemeContext';
import ThemedText from '../../ThemedText';

export const TextContent = ({ data }) => {
    const { colors, fontSize } = useTheme();
    
    const getSize = () => {
        switch (data.style) {
            case 'h1': return 32 * fontSize;
            case 'h2': return 28 * fontSize;
            case 'h3': return 24 * fontSize;
            default: return 16 * fontSize;
        }
    };
    
    return (
        <ThemedText 
            className="font-ezra"
            style={{
                textAlign: 'center',
                marginVertical: 16,
                fontSize: getSize()
            }}
        >
            {data.text}
        </ThemedText>
    );
};