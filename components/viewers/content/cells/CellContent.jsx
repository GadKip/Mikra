import { View, Text } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { isHebrewChapter } from '../../../../utils/hebrewChapters';
import ThemedText from '../../../ThemedText';
import ZoomableImage from '../../../ZoomableImage';

export default function CellContent({ content, styles = {}, columnIndex, rowData, hasChapter }) {
    const { colors, fontSize } = useTheme();
    const isCol2Empty = !rowData.row[1]?.cell?.trim();
    const cellText = typeof content === 'object' ? content.cell : content;
    const cellImage = typeof content === 'object' ? content.image : null;
    
    // Constants
    const LINE_HEIGHT_MULTIPLIER = 1.5;
    const CHAPTER_FONT_SIZE = 24;

    // Common styles
    const COMMON_TEXT_STYLES = {
        textAlign: 'justify',
        writingDirection: 'rtl',
        flexWrap: 'wrap'
    };

    // Process text helper function
    const processText = (text) => {
        if (!text) return text;
        return text.replace(/\s+־/g, '־').replace(/־\s+/g, '־');
    };

    // Font class determination
    const fontClass = (() => {
        if (columnIndex === 2) return "font-ezra";
        if (columnIndex === 3) return isCol2Empty ? "font-ezra" : "font-guttman";
        return "font-guttman";
    })();

    // Column classes with consistent line height calculation
    const columnClasses = (() => {
        const getLineHeight = (size) => size * fontSize * LINE_HEIGHT_MULTIPLIER;
        
        if (columnIndex === 0) {
            return { fontSize: 12 };
        }
        if (columnIndex === 1) return { fontSize: 12 };
        if (columnIndex === 2) {
            const baseSize = isCol2Empty ? 34 : 22.4;
            return {
                fontSize: baseSize * fontSize,
                lineHeight: getLineHeight(baseSize),
                letterSpacing: 0.5,
                ...(isCol2Empty && { fontFamily: 'EzraSILSR' })
            };
        }
        if (columnIndex === 3) {
            const baseSize = 24;
            return {
                fontSize: baseSize * fontSize,
                lineHeight: getLineHeight(baseSize),
                letterSpacing: 0.5
            };
        }
        return {
            fontSize: 20 * fontSize,
            lineHeight: getLineHeight(20),
            letterSpacing: 0.5
        };
    })();

    if (hasChapter && columnIndex === 0) {
        const words = String(cellText).split(/\s+/);
        const chapterWord = words.find(word => isHebrewChapter(word));
        const otherWords = words.filter(word => !isHebrewChapter(word));
        
        return (
            <View style={[styles.cellContainer, {overflow: 'visible'}]}>
                <View style={{ alignItems: 'flex-end' }}>
                    <ThemedText 
                        className={fontClass}
                        style={{ fontSize: CHAPTER_FONT_SIZE }}
                    >
                        {chapterWord}
                    </ThemedText>
                    {otherWords.length > 0 && (
                        <ThemedText 
                            className={fontClass}
                            style={{ fontSize: columnClasses.fontSize }}
                        >
                            {otherWords.join(' ')}
                        </ThemedText>
                    )}
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.cellContainer, {overflow: 'visible'}]}>
            {cellText && (
                <ThemedText 
                    className={fontClass}
                    style={{ 
                        ...columnClasses,
                        ...COMMON_TEXT_STYLES
                    }}
                >
                    {processText(cellText)}
                </ThemedText>
            )}
            {cellImage && (
                <View style={{ width: '100%', height: 200 }}>
                    <ZoomableImage
                        source={{ uri: cellImage.src }}
                        alt={cellImage.alt || 'Image'}
                        style={{
                            width: '100%',
                            height: '100%'
                        }}
                    />
                </View>
            )}
        </View>
    );
}