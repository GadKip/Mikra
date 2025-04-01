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

    if (!data?.content) return null;

    return (
        <View style={CONTAINER_STYLES}>
            {data.content.map((item, index) => {                
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