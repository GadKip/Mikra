import { View, Text, Image, Platform } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { isHebrewChapter } from '../../../../utils/hebrewChapters';
import ThemedText from '../../../ThemedText';

const guttmanFont = {
    fontFamily: 'GuttmanKeren'
};

const processText = (text) => {
    if (!text) return text;
    // Match different types of Hebrew hyphens/dashes followed by spaces
    // ־ (Hebrew hyphen/maqaf U+05BE)
    // ‐ (Regular hyphen U+2010)
    // - (Regular minus/hyphen U+002D)
    // ― (Horizontal bar U+2015)
    // – (En dash U+2013)
    // — (Em dash U+2014)
    return text.replace(/[־‐\-―–—]\s+/g, '־');
};

export default function CellContent({ content, styles = {}, columnIndex, rowData, rowIndex }) {
    const { colors } = useTheme();
    const isCol2Empty = !rowData.row[1]?.cell?.trim();
    
    // If content is an object with both cell and image properties
    const cellText = typeof content === 'object' ? content.cell : content;
    const cellImage = typeof content === 'object' ? content.image : null;

    // Base classes for all cells
    const baseClasses = "flex-1";
    
    // Dynamic classes based on column index
    const columnClasses = (() => {
        if (columnIndex === 0) {
            // Check for chapter numbers first
            if (isHebrewChapter(content?.cell?.trim())) {
                return "text-2xl"; // Size for chapter numbers
            }
            // Then check for asterisk
            if (content?.cell?.trim() === '*') {
                return "font-bold text-2xl";
            }
            return styles.bold ? "font-bold" : "text-xs";
        }
        if (columnIndex === 1) {
            return "text-xs"
        }
        if (columnIndex === 2) {
            if (rowIndex === 0) {
                return "text-4xl leading-[1.5]"
            }
            return "text-[1.4rem] leading-[1.5] tracking-wide"
        }
        if (columnIndex === 3) {
            return isCol2Empty ? "text-[1.25rem] align-middle" : "text-2xl"
        }
        return "text-xl"
    })();

    // Text style classes
    const styleClasses = [
        styles.bold && "font-bold",
        styles.italic && "italic",
        styles.underline && "underline",
        styles.isHeading1 && "text-3xl",
        styles.isHeading2 && "text-2xl",
    ].filter(Boolean).join(" ");

    const renderCol1Content = (text) => {
        const trimmedText = text.trim();
        if (isHebrewChapter(trimmedText) && trimmedText === text.trim()) {
            return (
                <ThemedText
                    className={`text-2xl font-ezra`}
                    style={{
                        flexWrap: 'nowrap',
                        whiteSpace: 'nowrap'  // Prevents text wrapping
                    }}
                >
                    {trimmedText}
                </ThemedText>
            );
        }
        
        return (
            <ThemedText 
                className="font-ezra text-xs"
                style={{
                    flexWrap: 'nowrap',
                    whiteSpace: 'nowrap',  // Prevents text wrapping
                }}
            >
                {text}
            </ThemedText>
        );
    };
    const renderTextWithParentheses = (text) => {
        const parts = text.split(/(\([^)]+\))/);
        return (
            <ThemedText 
                className={`${fontClass} ${columnClasses}`}
                style={{ 
                    textAlign: 'justify',
                    writingDirection: 'rtl',
                    flexWrap: 'wrap',
                    flexShrink: 1,
                    textAlignLast: 'right',
                    paddingTop: 4,
                }}
            >
                {parts.map((part, index) => {
                    if (part.match(/^\([^)]+\)$/)) {
                        return (
                            <Text 
                                key={index} 
                                className="font-david text-xl"  // Changed from font-guttman and made smaller
                                style={{ 
                                    display: 'inline',  // Prevent line break
                                    color: colors.text
                                }}
                            >
                                {part}
                            </Text>
                        );
                    }
                    return part;  // Return plain text for non-parenthesized parts
                })}
            </ThemedText>
        );
    };

    const fontClass = (() => {
        const selectedFont = (() => {
            if (columnIndex === 2) {
                return "font-guttman";
            }
            if (columnIndex === 3) {
                return isCol2Empty ? "font-guttman " : "font-ezra";
            }
            return "font-ezra";
        })();        
        return selectedFont;
    })();

    return (
        <View style={styles.cellContainer}>
            {/* Render text content if exists */}
            {cellText && (
                columnIndex <= 1 ? ( // For columns 0 and 1
                    columnIndex === 0 && isHebrewChapter(cellText.trim()) ? (
                        renderCol1Content(cellText)
                    ) : (
                        <ThemedText 
                            className={`${fontClass} ${columnClasses}`}
                            style={{ 
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
                    <ThemedText
                        key={`col2-${rowIndex}`}
                        className={`
                            ${baseClasses}
                            ${columnClasses}
                            ${styleClasses}
                        `.trim()}
                        style={{ 
                            textAlign: 'justify',
                            writingDirection: 'rtl',
                            flexWrap: 'wrap',
                            flexShrink: 1,
                            textAlignLast: 'right',
                            paddingTop: 4,
                            fontFamily: 'GuttmanKeren'
                        }}                
                    >
                        {processText(cellText).split(/(\([^)]+\))/).map((part, index) => {
                            if (part.match(/^\([^)]+\)$/)) {
                                return (
                                    <Text 
                                        key={index}
                                        style={{ 
                                            fontSize: 16, // Smaller text for parentheses
                                            fontFamily: 'GuttmanKeren',
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
                )
                : (
                    columnIndex === 0 ? (
                        renderCol1Content(cellText)
                    ) : (
                        columnIndex === 3 && !isCol2Empty ? (
                            renderTextWithParentheses(cellText)
                        ) : (
                            <ThemedText 
                                className={`
                                    ${fontClass}
                                    ${baseClasses}
                                    ${columnClasses}
                                    ${styleClasses}
                                `.trim()}
                                style={{ 
                                    textAlign: 'justify',
                                    writingDirection: 'rtl',
                                    flexWrap: 'wrap',
                                    flexShrink: 1,
                                    textAlignLast: 'right',
                                    paddingTop: 4,
                                }}
                            >
                                {cellText}
                            </ThemedText>
                        )
                    )
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