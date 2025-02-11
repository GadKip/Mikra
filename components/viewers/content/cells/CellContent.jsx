import { View, Text, Image, Platform } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { isHebrewChapter } from '../../../../utils/hebrewChapters';

const guttmanFont = {
    fontFamily: 'GuttmanKeren'
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
            if (content?.cell?.trim() === '*') {
                return "font-bold text-2xl"
            }
            return styles.bold ? "font-bold" : "text-xs"
        }
        if (columnIndex === 1) {
            return "text-xs"
        }
        if (columnIndex === 2) {
            if (rowIndex === 0) {
                return "text-4xl"
            }
            return "text-3xl"
        }
        if (columnIndex === 3) {
            return isCol2Empty ? "text-2xl" : "text-3xl"
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
                <Text
                    className={`text-2xl font-ezra`}
                >
                    {trimmedText}
                </Text>
            );
        }
        
        return (
            <Text 
                className="font-ezra text-xs"
                style={{
                    flexWrap: 'wrap',
                    textAlign: 'right',
                    color: colors.text,
                    wordBreak: 'normal'
                }}
            >
                {text}
            </Text>
        );
    };
    const renderTextWithParentheses = (text) => {
        const parts = text.split(/(\([^)]+\))/);
        return (
            <>
                {parts.map((part, index) => {
                    if (part.match(/^\([^)]+\)$/)) {
                        return (
                            <Text 
                                key={index} 
                                className={`font-david ${columnClasses}`}
                            >
                                {part}
                            </Text>
                        );
                    }
                    return (
                        <Text 
                            key={index} 
                            className={`${fontClass} ${columnClasses}`}
                        >
                            {part}
                        </Text>
                    );
                })}
            </>
        );
    };

    const fontClass = (() => {
        const selectedFont = (() => {
            if (columnIndex === 2) {
                return "font-guttman";
            }
            if (columnIndex === 3) {
                return isCol2Empty ? "font-guttman" : "font-ezra";
            }
            return "font-ezra";
        })();        
        return selectedFont;
    })();

    // Add debug logs
    console.log('CellContent debug:', {
        columnIndex,
        styles,
        fontClass,
        columnClasses,
        styleClasses
    });

    return (
        <View style={styles.cellContainer}>
            {/* Render text content if exists */}
            {cellText && (
                columnIndex === 1 ? (
                    <View>
                        <Text 
                            className={`
                                ${fontClass}
                                ${baseClasses}
                                ${columnClasses}
                                ${styleClasses}
                            `}
                            style={{ 
                                color: colors.text,
                                writingDirection: 'rtl',
                                flexWrap: 'wrap',
                                flexShrink: 1,
                                paddingTop: 4,
                                alignSelf: 'flex-start',
                            }}
                            numberOfLines={0}
                            adjustsFontSizeToFit
                            minimumFontScale={0.5}
                            allowFontScaling
                        >
                            {cellText}
                        </Text>
                    </View>
                ) : columnIndex === 2 ? (
                    <Text
                        key={`col2-${rowIndex}`}
                        className={`
                            ${baseClasses}
                            ${columnClasses}
                            ${styleClasses}
                        `.trim()}
                        style={[
                            {
                                color: colors.text,
                                textAlign: 'justify',
                                writingDirection: 'rtl',
                                flexWrap: 'wrap',
                                flexShrink: 1,
                                textAlignLast: 'right',
                                paddingTop: 4,
                                fontFamily: 'GuttmanKeren' // Apply the Guttman font directly
                            }
                        ]}
                        onLayout={() => {
                            console.log('Column 3 styles:', {
                                columnIndex,
                                platform: Platform.OS,
                                fontClass,
                                styles: styles.text || {},
                                finalStyles: [
                                    styles.text || {},
                                    {
                                        color: colors.text,
                                        textAlign: 'justify',
                                        writingDirection: 'rtl',
                                        flexWrap: 'wrap',
                                        flexShrink: 1,
                                        textAlignLast: 'right',
                                        paddingTop: 4,
                                        fontFamily: 'GuttmanKeren' // Apply the Guttman font directly
                                    }
                                ]
                            });
                        }}
                    >
                        {cellText}
                    </Text>
                )
                : (
                    columnIndex === 0 ? (
                        renderCol1Content(cellText)
                    ) : (
                        columnIndex === 3 && !isCol2Empty ? (
                            renderTextWithParentheses(cellText)
                        ) : (
                            <Text 
                                className={`
                                    ${fontClass}
                                    ${baseClasses}
                                    ${columnClasses}
                                    ${styleClasses}
                                `.trim()}
                                style={{ 
                                    color: colors.text,
                                    textAlign: 'justify',
                                    writingDirection: 'rtl',
                                    flexWrap: 'wrap',
                                    flexShrink: 1,
                                    textAlignLast: 'right',
                                    paddingTop: 4,
                                }}
                            >
                                {cellText}
                            </Text>
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