import { View, Text, Image } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { isHebrewChapter } from '../../../../utils/hebrewChapters';
import ThemedText from '../../../ThemedText';

const processText = (text) => {
    if (!text) return text;
    // First replace space+hyphen
    let processed = text.replace(/\s+־/g, '־');
    // Then replace hyphen+space
    processed = processed.replace(/־\s+/g, '־');
    return processed;
};

export default function CellContent({ content, styles = {}, columnIndex, rowData }) {
    const { colors, fontSize } = useTheme();
    const isCol2Empty = !rowData.row[1]?.cell?.trim();
    
    // If content is an object with both cell and image properties
    const cellText = typeof content === 'object' ? content.cell : content;
    const cellImage = typeof content === 'object' ? content.image : null;
    
    // Updated column classes with dynamic fontSize
    const columnClasses = (() => {
        if (columnIndex === 0) {
            // Column 0 (first column) - fixed sizes with Guttman font
            if (isHebrewChapter(content?.cell?.trim())) {
                return { 
                    fontSize: 24, 
                    fontWeight: 'bold',
                    fontFamily: 'GuttmanKeren'  // Add Guttman font
                };
            }
            if (content?.cell?.trim() === '*') {
                return { fontSize: 24, fontWeight: 'bold' }; // Fixed size for asterisk
            }
            return { fontSize: 12 }; // Fixed size for other content in column 0
        }
        if (columnIndex === 1) {
            // Column 1 - fixed size
            return { fontSize: 12 };
        }
        if (columnIndex === 2) {
            // Column 2 - scalable sizes
            return isCol2Empty ? {
                fontSize: 34 * fontSize, 
                lineHeight: 34 * fontSize * 1.5, 
                letterSpacing: 0.5,
                fontFamily: 'EzraSILSR'
            } : { 
                fontSize: 22.4 * fontSize, 
                lineHeight: 22.4 * fontSize * 1.5, 
                letterSpacing: 0.5 
            };
        }
        if (columnIndex === 3) {
            // Column 3 - header style when col2 is empty
            return isCol2Empty ? 
                { fontSize: 24 * fontSize, lineHeight: 24 * fontSize * 1.5 } : // Header size
                { fontSize: 24 * fontSize, lineHeight: 24 * fontSize * 1.5 };
        }
        return { 
            fontSize: 20 * fontSize, 
            lineHeight: 20 * fontSize * 1.5,
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
                        textAlign: 'justify',
                        writingDirection: 'rtl',
                        flexWrap: 'wrap'
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
                style={{ 
                    ...columnClasses,
                    textAlign: 'justify',
                    writingDirection: 'rtl',
                    flexWrap: 'wrap'
                }}
            >
                {parts.map((part, index) => {
                    if (part.match(/^\([^)]+\)$/)) {
                        return (
                            <Text 
                                key={index}
                                style={{ 
                                    fontSize: Math.floor(columnClasses.fontSize * 0.8),
                                    color: colors.text
                                }}
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

    const fontClass = (() => {
        const selectedFont = (() => {
            if (columnIndex === 2) {
                return "font-ezra";
            }
            if (columnIndex === 3) {
                return isCol2Empty ? "font-ezra " : "font-guttman";
            }
            return "font-guttman";
        })();        
        return selectedFont;
    })();

    return (
        <View style={styles.cellContainer}>
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
                    renderTextWithParentheses(processText(cellText))
                ) : (
                    // Other columns - default rendering
                    <ThemedText 
                        className="font-guttman"
                        style={{ 
                            ...columnClasses,
                            textAlign: 'justify',
                            writingDirection: 'rtl',
                            flexWrap: 'wrap',
                            paddingTop: 4
                        }}
                    >
                        {processText(cellText)}
                    </ThemedText>
                )
            )}
            {/* Render image if exists */}
            {cellImage && (
                <Image
                    source={{ uri: cellImage.src }}
                    alt={cellImage.alt || 'Image'}
                    style={[styles.image, {
                        width: '100%',
                        height: 200,
                        resizeMode: 'contain',
                        marginVertical: 5
                    }]}
                    onError={(e) => {
                        console.error('Cell image load error:', {
                            error: e.nativeEvent,
                            src: cellImage.src?.substring(0, 50) + '...'
                        });
                    }}
                />
            )}
        </View>
    );
};