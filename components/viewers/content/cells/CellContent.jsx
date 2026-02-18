import React, { memo, useMemo, useRef } from 'react'; // Added memo, useMemo
import { View } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { isHebrewChapter } from '../../../../utils/hebrewChapters';
import ThemedText from '../../../ThemedText';
import ZoomableImage from '../../../ZoomableImage';

const LINE_HEIGHT_MULTIPLIER = 1.5;
const CHAPTER_FONT_SIZE = 24;

const COMMON_TEXT_STYLES = {
    textAlign: 'justify',
    writingDirection: 'rtl',
    flexWrap: 'wrap'
};

const processText = (text) => {
    if (!text) return text;
    return text.replace(/\s+־/g, '־').replace(/־\s+/g, '־');
};

const CellContent = memo(({ 
    content, 
    styles = {}, 
    columnIndex, 
    rowData, 
    hasChapter,
    onItemLayout,
    cellId,
    scrollViewRef 
}) => {
    const cellRef = useRef(null);
    const { fontSize } = useTheme();
    
    const isCol2Empty = !rowData.row[1]?.cell?.trim();
    const cellText = typeof content === 'object' ? content.cell : content;
    const cellImage = typeof content === 'object' ? content.image : null;
    const col2Text = rowData.row?.[1]?.cell?.trim();
    const isTrackedHeading = columnIndex === 3 && cellText && !col2Text;

    const handleLayout = () => {
        if (isTrackedHeading && onItemLayout && cellRef.current && scrollViewRef?.current) {
            // Check if measurement is actually needed to avoid spamming the bridge
            setTimeout(() => {
                cellRef.current?.measureLayout(
                    scrollViewRef.current,
                    (x, y) => { onItemLayout({ id: cellId, y: y }); },
                    (error) => console.log('Measurement error', error)
                );
            }, 100);
        }
    };

    const fontClass = useMemo(() => {
        if (columnIndex === 2) return "font-ezra";
        if (columnIndex === 3) return isCol2Empty ? "font-ezra" : "font-guttman";
        return "font-guttman";
    }, [columnIndex, isCol2Empty]);

    const columnStyles = useMemo(() => {
        const getLineHeight = (size) => size * fontSize * LINE_HEIGHT_MULTIPLIER;
        let baseStyles = {};

        if (columnIndex === 0 || columnIndex === 1) {
            baseStyles = { fontSize: 12 };
        } else if (columnIndex === 2) {
            const baseSize = isCol2Empty ? 34 : 22.4;
            baseStyles = {
                fontSize: baseSize * fontSize,
                lineHeight: getLineHeight(baseSize),
                letterSpacing: 0.5,
                ...(isCol2Empty && { fontFamily: 'EzraSILSR' })
            };
        } else if (columnIndex === 3) {
            const baseSize = 24;
            baseStyles = {
                fontSize: baseSize * fontSize,
                lineHeight: getLineHeight(baseSize),
                letterSpacing: 0.5
            };
        } else {
            baseStyles = {
                fontSize: 20 * fontSize,
                lineHeight: getLineHeight(20),
                letterSpacing: 0.5
            };
        }

        return { ...baseStyles, ...COMMON_TEXT_STYLES };
    }, [columnIndex, fontSize, isCol2Empty]);

    if (hasChapter && columnIndex === 0) {
        const words = String(cellText).split(/\s+/);
        const chapterWord = words.find(word => isHebrewChapter(word));
        const otherWords = words.filter(word => !isHebrewChapter(word));
        
        return (
            <View ref={cellRef} onLayout={handleLayout}>
                <ThemedText className={fontClass} style={{ fontSize: CHAPTER_FONT_SIZE }}>
                    {chapterWord}
                </ThemedText>
                {otherWords.length > 0 && (
                    <ThemedText className={fontClass} style={{ fontSize: columnStyles.fontSize }}>
                        {otherWords.join(' ')}
                    </ThemedText>
                )}
            </View>
        );
    }

    return (
        <View 
            ref={cellRef} 
            onLayout={handleLayout}
            style={[styles.cellContainer, { overflow: 'visible' }]}
        >
            {cellText && (
                <ThemedText className={fontClass} style={columnStyles}>
                    {processText(cellText)}
                </ThemedText>
            )}
            {cellImage && (
                <View style={{ width: '100%', height: 200 }}>
                    <ZoomableImage
                        source={{ uri: cellImage.src }}
                        alt={cellImage.alt || 'Image'}
                        style={{ width: '100%', height: '100%' }}
                    />
                </View>
            )}
        </View>
    );
});
CellContent.displayName = 'CellContent';
export default CellContent;