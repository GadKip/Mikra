import { memo } from 'react';
import { View , StyleSheet } from 'react-native';

import ZoomableImage from '../../ZoomableImage';

export const ImageContent = memo(({ data }) => {
    if (!data?.src) {
        return null;
    }

    return (
        <View style={styles.imageContainer}>
            <View style={styles.imageWrapper}>
                <ZoomableImage
                    source={{ uri: data.src }}
                    alt={data.alt || 'Image'}
                    style={styles.image}
                    debug={true}
                />
            </View>
        </View>
    );
});
ImageContent.displayName = 'ImageContent';

const styles = StyleSheet.create({
    imageContainer: {
        alignItems: 'center',
        marginVertical: 10,
        width: '100%',
    },
    imageWrapper: {
        width: '90%',
        aspectRatio: 1,
        maxHeight: 400,
    },
    image: {
        width: '100%',
        height: '100%',
    },
});