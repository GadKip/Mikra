import { View, Text, Image, Platform } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { isHebrewChapter } from '../../../../utils/hebrewChapters';
import ThemedText from '../../../ThemedText';

const ezraFont = {
    fontFamily: 'EzraSILSR'
};

const processText = (text) => {
    if (!text) return text;
    // First replace space+hyphen
    let processed = text.replace(/\s+־/g, '־');
    // Then replace hyphen+space
    processed = processed.replace(/־\s+/g, '־');
    return processed;
};

export default function CellContent({ content, styles = {}, columnIndex, rowData, rowIndex }) {
    const { colors, fontSize } = useTheme();
    const isCol2Empty = !rowData.row[1]?.cell?.trim();
    
    // If content is an object with both cell and image properties
    const cellText = typeof content === 'object' ? content.cell : content;
    const cellImage = typeof content === 'object' ? content.image : null;

    // Base classes for all cells
    const baseClasses = "flex-1";
    
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
            if (rowIndex === 0) {
                return { fontSize: 36 * fontSize, lineHeight: 36 * fontSize * 1.5 };
            }
            return { 
                fontSize: 22.4 * fontSize, 
                lineHeight: 22.4 * fontSize * 1.5, 
                letterSpacing: 0.5 
            };
        }
        if (columnIndex === 3) {
            // Column 3 - scalable sizes
            return isCol2Empty ? 
                { fontSize: 20 * fontSize, lineHeight: 20 * fontSize * 1.5 } :
                { fontSize: 24 * fontSize, lineHeight: 24 * fontSize * 1.5 };
        }
        return { fontSize: 20 * fontSize, lineHeight: 20 * fontSize * 1.5 };
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
        const parts = text.split(/(\([^)]+\))/);
        const useGuttmanFont = columnIndex === 3 && !isCol2Empty;
        const fontFamily = useGuttmanFont ? 'GuttmanKeren' : 'EzraSILSR';
        const fontClass = useGuttmanFont ? 'font-guttman' : 'font-ezra';

        // If it's column 3, explicitly set font size based on isCol2Empty
        const baseFontSize = columnIndex === 3 
            ? (isCol2Empty ? 20 * fontSize : 24 * fontSize)
            : columnClasses.fontSize;

        return (
            <ThemedText 
                className={fontClass}
                style={{ 
                    ...columnClasses,
                    textAlign: 'justify',
                    writingDirection: 'rtl',
                    flexWrap: 'wrap',
                    paddingTop: 4,
                }}
            >
                {parts.map((part, index) => {
                    if (part.match(/^\([^)]+\)$/)) {
                        return (
                            <Text 
                                key={index}
                                style={{ 
                                    fontSize: Math.floor(baseFontSize * 0.8),
                                    color: colors.text,
                                    fontFamily,
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
                ) : columnIndex === 2 ? (
                    // Column 2 - EZRA font
                    <ThemedText
                        className="font-ezra"
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
                ) : columnIndex === 3 || columnIndex === 4 ? (
                    // Columns 3 and 4 - Use renderTextWithParentheses with correct font
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