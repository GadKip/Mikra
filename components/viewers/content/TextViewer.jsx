import { useTheme } from '../../../context/ThemeContext';
import ThemedText from '../../ThemedText';

export const TextContent = ({ data }) => {
    const { colors } = useTheme();
    
    return (
        <ThemedText 
            className={`
                font-ezra text-center my-4
                ${data.style === 'h1' && 'text-4xl'}
                ${data.style === 'h2' && 'text-3xl'}
                ${data.style === 'h3' && 'text-2xl'}
            `}
        >
            {data.text}
        </ThemedText>
    );
};