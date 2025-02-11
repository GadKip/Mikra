import { View, Image } from 'react-native';
import { StyleSheet } from 'react-native';

export const ImageContent = ({ data }) => {
    //if (!data.src) {
    //    if (__DEV__) {
    //        console.warn('Image missing source:', data);
    //    }
    //    return null;
    //}

    return (
        <View style={styles.imageContainer}>
            <Image
                source={{ uri: data.src }}
                alt={data.alt || 'Image'}
                style={styles.image}
                onError={(e) => {
                    if (__DEV__) {
                        console.warn('Image load error:', {
                            src: data.src?.substring(0, 50) + '...'
                        });
                    }
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    image: {
        width: '90%',
        height: 300,
        resizeMode: 'contain',
    },
});