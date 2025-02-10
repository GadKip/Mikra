import { View, Text, Image } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { isHebrewChapter } from '../../../../utils/hebrewChapters';

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
            return styles.bold
                ?
                // If bold, use David font and larger text size
                "text-2xl font-davidbd"
                // If not bold, use Ezra font and smaller text size
                : "text-xs"
        }
        if (columnIndex === 1) {
            return rowIndex === 0 ? "text-3xl" : "text-xs"
        }
        if (columnIndex === 3) {
            return "text-2xl"
        }
        if (columnIndex === 2 && rowIndex === 0) {
            return "text-3xl"
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
        <View>
            {/* Render text content if exists */}
            {cellText && (
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
                        textAlignVertical: 'center',
                        flexWrap: 'wrap',
                        flexShrink: 1,
                        textAlignLast: 'right',
                        paddingTop: 4
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