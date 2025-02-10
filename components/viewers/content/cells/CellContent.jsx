import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { isHebrewChapter } from '../../../../utils/hebrewChapters';

const styles = StyleSheet.create({
    col2Container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end', // Align to the right
        alignItems: 'flex-start',   // Align to the top
    },
    cellContainer: {
        flex: 1,
    }
});

export default function CellContent({ content, styles = {}, columnIndex, rowData, rowIndex, isHeader }) {
    const { colors } = useTheme();
    const isCol2Empty = !rowData.row[1]?.cell?.trim();
    
    // If content is an object with both cell and image properties
    const cellText = typeof content === 'object' ? content.cell : content;
    const cellImage = typeof content === 'object' ? content.image : null;

    // Base classes for all cells
    const baseClasses = "flex-1 ";
    
    // Dynamic classes based on column index
    const columnClasses = (() => {
        if (columnIndex === 0) {
            if (content?.cell?.trim() === '*') {
                return "font-davidbd"
            }
            return styles.bold ? "text-2xl font-davidbd" : "text-xs flex-wrap"
        }
        if (columnIndex === 1) {
            return "text-xs"
        }
        if (columnIndex === 2 && rowIndex === 0) {
            return "text-4xl font-guttman"
        }

        if (columnIndex === 3) {
            return styles.bold ? "text-3xl font-davidbd" : "text-xl"
        }
        return "text-xl"
    })();

    // Text style classes
    const styleClasses = [
        styles.bold && "font-davidbd",
        styles.italic && "italic",
        styles.underline && "underline",
        styles.isHeading1 && "text-3xl font-davidbd",
        styles.isHeading2 && "text-2xl font-davidbd",
    ].filter(Boolean).join(" ");

    const renderCol1Content = (text) => {
        const trimmedText = text.trim();
        if (isHebrewChapter(trimmedText) && trimmedText === text.trim()) {
            return (
                <Text
                    className = {styles.bold ? "text-2xl font-davidbd" : "text-2xl font-ezra"}
                >
                    {trimmedText}
                </Text>
            );
        }
        
        return (
            <Text 
                style={{
                    fontSize: 10,
                    flexWrap: 'wrap',
                    textAlign: 'right',
                    color: colors.text,
                    fontFamily: 'Ezra SIL SR',
                    wordBreak: 'normal' // Prevent word splitting
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
                                className="font-david text-text" // Add theme color
                            >
                                {part}
                            </Text>
                        );
                    }
                    return <Text key={index} className="text-text">{part}</Text>;
                })}
            </>
        );
    };

    const fontClass = columnIndex === 3 
        ? (isCol2Empty ? "font-davidbd text-3xl" : "font-guttman")
        : "font-ezra";

    return (
        <View style={styles.cellContainer}>
            {/* Render text content if exists */}
            {cellText && (
                columnIndex === 1 ? (
                    <View style={styles.col2Container}>
                        <Text 
                            className={`
                                ${baseClasses}
                                ${columnClasses}
                                ${styleClasses}
                                ${fontClass}
                            `}
                            style={{ 
                                color: colors.text,
                                writingDirection: 'rtl',
                                flexWrap: 'wrap',
                                flexShrink: 1,
                                paddingTop: 4,
                                alignSelf: 'flex-start', // Add this
                            }}
                            numberOfLines={0}
                            adjustsFontSizeToFit
                            minimumFontScale={0.5}
                            allowFontScaling
                        >
                            {cellText}
                        </Text>
                    </View>
                ) : (
                    <Text 
                        className={`
                            ${baseClasses}
                            ${columnClasses}
                            ${styleClasses}
                            ${fontClass}
                        `}
                        style={{ 
                            color: colors.text,
                            textAlign: 'justify',
                            writingDirection: 'rtl',
                            flexWrap: 'wrap',
                            flexShrink: 1,
                            textAlignLast: 'right',
                            paddingTop: 4,
                            alignSelf: 'flex-start', // Add this
                        }}
                        numberOfLines={0}
                        adjustsFontSizeToFit
                        minimumFontScale={0.5}
                        allowFontScaling
                    >
                        {columnIndex === 0 
                            ? renderCol1Content(cellText)
                            : columnIndex === 3 && !isCol2Empty 
                                ? renderTextWithParentheses(cellText)
                                : cellText
                        }
                    </Text>
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