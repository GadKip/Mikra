import { View, Text, Image } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { isHebrewChapter } from '../../../../utils/hebrewChapters';
import ThemedText from '../../../ThemedText';
import ZoomableImage from '../../../ZoomableImage';  // Add this import

export default function CellContent({ content, styles = {}, columnIndex, rowData }) {
    const { colors, fontSize } = useTheme();
    const isCol2Empty = !rowData.row[1]?.cell?.trim();
    const cellText = typeof content === 'object' ? content.cell : content;
    const cellImage = typeof content === 'object' ? content.image : null;
    
    // Constants
    const LINE_HEIGHT_MULTIPLIER = 1.5;

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

    // Base text style generator
    const getBaseTextStyles = (isParenthetical = false) => ({
        ...columnClasses,
        ...COMMON_TEXT_STYLES,
        fontSize: isParenthetical ? Math.floor(columnClasses.fontSize * 0.8) : columnClasses.fontSize,
        color: colors.text
    });

    // Process text once at the start
    const processedText = (() => {
        if (!cellText) return cellText;
        return cellText.replace(/\s+־/g, '־').replace(/־\s+/g, '־');
    })();

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
            if (isHebrewChapter(content?.cell?.trim())) {
                return { fontSize: 24, fontWeight: 'bold', fontFamily: 'GuttmanKeren' };
            }
            return content?.cell?.trim() === '*' ? 
                { fontSize: 24, fontWeight: 'bold' } : 
                { fontSize: 12 };
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

    // Updated style classes with dynamic fontSize
    const styleClasses = {
        fontSize: columnClasses.fontSize,
        fontWeight: styles.bold ? 'bold' : 'normal',
        fontStyle: styles.italic ? 'italic' : 'normal',
        textDecorationLine: styles.underline ? 'underline' : 'none',
        ...(styles.isHeading1 && { fontSize: 30 * fontSize }), // was text-3xl
        ...(styles.isHeading2 && { fontSize: 24 * fontSize }), // was text-2xl
        ...columnClasses
    };

    const renderCol1Content = (text) => {
        const trimmedText = text.trim();
        if (isHebrewChapter(trimmedText) && trimmedText === text.trim()) {
            return (
                <ThemedText
                    className="font-guttman"  // This adds the Guttman font
                    style={{
                        fontSize: 24, // Fixed size for Hebrew chapters
                        flexWrap: 'nowrap',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {trimmedText}
                </ThemedText>
            );
        }
        
        return (
            <ThemedText 
                className="font-guttman"
                style={{
                    fontSize: 12, // Fixed size for other content
                    flexWrap: 'nowrap',
                    whiteSpace: 'nowrap',
                }}
            >
                {text}
            </ThemedText>
        );
    };

    const renderTextWithParentheses = (text) => {
        // Only process columns 3 & 4 (indexes 2 & 3)
        if (columnIndex !== 2 && columnIndex !== 3) {
            return (
                <ThemedText 
                    className={fontClass}
                    style={{ 
                        ...columnClasses,
                        ...COMMON_TEXT_STYLES
                    }}
                >
                    {text}
                </ThemedText>
            );
        }

        const parts = text.split(/(\([^)]+\))/);

        return (
            <ThemedText 
                className={fontClass}
                style={getBaseTextStyles()}
            >
                {parts.map((part, index) => {
                    if (part.match(/^\([^)]+\)$/)) {
                        return (
                            <Text 
                                key={index}
                                style={getBaseTextStyles(true)}
                            >
                                {part}
                            </Text>
                        );
                    }
                    return part;
                })}
            </ThemedText>
        );
    };

    return (
        <View style={[styles.cellContainer, {overflow: 'visible'}]}>
            {cellText && (
                columnIndex <= 1 ? (
                    // Columns 0 and 1 - no processing needed
                    columnIndex === 0 && isHebrewChapter(cellText.trim()) ? (
                        renderCol1Content(cellText)
                    ) : (
                        <ThemedText 
                            className={`${fontClass}`}
                            style={{ 
                                ...columnClasses,
                                flexShrink: 0,
                                flexGrow: 0,
                                minWidth: 'fit-content', // Ensure content width
                                width: 'auto',
                                textAlign: 'justify',
                                flexBasis: 'auto' // Allow content to determine width
                            }}
                        >
                            {cellText}
                        </ThemedText>
                    )
                ) : (columnIndex === 2 || columnIndex === 3) ? (
                    renderTextWithParentheses(processedText)
                ) : (
                    // Other columns - default rendering
                    <ThemedText 
                        className="font-guttman"
                        style={{ 
                            ...columnClasses,
                            textAlign: 'justify',
                            writingDirection: 'rtl',
                            flexWrap: 'wrap'
                        }}
                    >
                        {processedText}
                    </ThemedText>
                )
            )}
            {/* Replace Image with ZoomableImage */}
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
};