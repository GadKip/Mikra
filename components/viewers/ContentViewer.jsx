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

export const ContentViewer = ({ data, isLandscape, visibleColumns }) => {
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
                
                switch (item.type) {
                    case 'table':
                        return (
                            <Table 
                                key={`table-${index}`} 
                                data={item.data} 
                                isLandscape={isLandscape}
                                visibleColumns={visibleColumns}
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
            })}
        </View>
    );
};