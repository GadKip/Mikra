import { View } from 'react-native';
import { Table } from './content/TableViewer';
import { ListItem } from './content/ListViewer';
import { TextContent } from './content/TextViewer';
import { ImageContent } from './content/ImageViewer';

export const ContentViewer = ({ data, isLandscape }) => {
    if (!data?.content) return null;

    // Single debug log for content structure
    if (__DEV__) {
        console.debug('ContentViewer rendering:', {
            contentTypes: data.content.map(item => item.type)
        });
    }

    return (
        <View style={{ flex: 1 }}>
            {data.content.map((item, index) => {
                switch (item.type) {
                    case 'table':
                        return <Table key={`table-${index}`} data={item.data} isLandscape={isLandscape} />;
                    case 'list':
                        return (
                            <View key={`list-${index}`}>
                                {item.data.map((listItem, listIndex) => (
                                    <ListItem key={`list-item-${listIndex}`} data={listItem.data} />
                                ))}
                            </View>
                        );
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