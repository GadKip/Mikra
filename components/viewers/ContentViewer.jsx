import { View } from 'react-native';
import { Table } from './content/TableViewer';
import { ListItem } from './content/ListViewer';
import { TextContent } from './content/TextViewer';
import { ImageContent } from './content/ImageViewer';

// Consolidate repeated styles
const CONTAINER_STYLES = {
    flex: 1,
    width: '100%',
    alignSelf: 'stretch'
};

export const ContentViewer = ({ data, isLandscape, visibleColumns, onItemLayout, scrollViewRef }) => {
    console.log('Rendering content item:', {
        hasData: !!data,
        type: data?.content?.[0]?.type
    });

    if (!data?.content) return null;

    return (
        <View style={CONTAINER_STYLES}>
            {data.content.map((item, index) => {
                if (item.type === 'image') {
                    console.log('Found image:', {
                        src: item.data?.src?.substring(0, 50) + '...',
                        alt: item.data?.alt
                    });
                }

                // Generate anchor ID for h2 text items
                const isHeading = item.type === 'text' && item.data?.style === 'h2';
                const headingId = isHeading ? `heading-${index}` : null;
                
                const itemElement = (() => {
                    switch (item.type) {
                        case 'table':
                            return (
                                <Table 
                                    key={`table-${index}`} 
                                    data={item.data} 
                                    isLandscape={isLandscape}
                                    visibleColumns={visibleColumns}
                                    onItemLayout={onItemLayout}
                                    scrollViewRef={scrollViewRef}
                                    tableIndex={index}
                                />
                            );
                        case 'list':
                            return <ListItems key={`list-${index}`} items={item.data} />;
                        case 'text':
                            return <TextContent key={`text-${index}`} data={item.data} />;
                        case 'image':
                            return <ImageContent key={`image-${index}`} data={item.data} />;
                        default:
                            return null;
                    }
                })();

                // Wrap h2 text items with layout tracking
                if (isHeading && onItemLayout) {
                    return (
                        <View
                            key={headingId}
                            onLayout={(event) => {
                                const { y } = event.nativeEvent.layout;
                                onItemLayout({ id: headingId, index, y });
                            }}
                        >
                            {itemElement}
                        </View>
                    );
                }

                return itemElement;
            })}
        </View>
    );
};