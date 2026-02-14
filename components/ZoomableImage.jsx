import React, { useState } from 'react';
import { Modal, View, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { 
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';
import ThemedText from './ThemedText';

const ZoomableImage = ({ source, style, alt, debug = false }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const { colors } = useTheme();

    React.useEffect(() => {
        if (source?.uri) {
            // Check if it's a base64 image
            if (source.uri.startsWith('data:image')) {
                console.log('Loading base64 image...');
                // For base64 images, we don't need to pre-fetch size
                setIsLoading(false);
                return;
            }

            Image.getSize(source.uri, (width, height) => {
                if (debug) {
                    console.log('Image dimensions:', { width, height });
                }
                setImageSize({ width, height });
            }, (error) => {
                console.error('Error getting image size:', error);
                setHasError(true);
            });
        }
    }, [source?.uri]);

    const pinchGesture = Gesture.Pinch()
        .onUpdate((event) => {
            // The new logic uses the saved scale from the previous gesture's end
            // and multiplies it by the current gesture's scale factor.
            scale.value = Math.max(0.5, Math.min(8, savedScale.value * event.scale));
        })
        .onEnd(() => {
            // Save the final scale for the next gesture
            savedScale.value = scale.value;
            // The logic from the old onEnded prop is now here
            if (scale.value < 1) {
                scale.value = withSpring(1);
                savedScale.value = 1;
            }
        });

    const imageStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const resetZoom = () => {
        scale.value = withSpring(1);
        savedScale.value = 1;
    };

    const handleImageLoad = () => {
        if (debug) {
            console.log('Image loaded successfully:', {
                isBase64: source?.uri?.startsWith('data:image'),
                sourceLength: source?.uri?.length
            });
        }
        setIsLoading(false);
        setHasError(false);
    };

    const handleImageError = (e) => {
        console.error('Image failed to load:', {
            error: e.nativeEvent,
            isBase64: source?.uri?.startsWith('data:image'),
            sourceStart: source?.uri?.substring(0, 50)
        });
        setIsLoading(false);
        setHasError(true);
    };

    const handleLayout = (event) => {
        const { width, height } = event.nativeEvent.layout;
        console.log('ZoomableImage layout:', {
            width,
            height,
            style,
            imageSize
        });
    };

    return (
        <>
            <TouchableOpacity 
                onPress={() => setIsModalVisible(true)}
                onLayout={handleLayout}
            >
                {/* Unchanged thumbnail view */}
                <View style={[styles.imageWrapper, style]}>
                    <Image 
                        source={source} 
                        style={[styles.thumbnailImage, { opacity: isLoading ? 0 : 1 }]}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        resizeMode="contain"
                    />
                    {isLoading && <ActivityIndicator size="large" color={colors.text} style={StyleSheet.absoluteFill} />}
                    {hasError && <View style={styles.errorContainer}><ThemedText>Failed to load image</ThemedText></View>}
                </View>
            </TouchableOpacity>

            <Modal
                visible={isModalVisible}
                transparent={true}
                onRequestClose={() => {
                    resetZoom();
                    setIsModalVisible(false);
                }}
            >
                <GestureHandlerRootView style={styles.modalContainer}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => {
                            resetZoom();
                            setIsModalVisible(false);
                        }}
                    >
                        <View style={styles.closeIcon}>
                            <View style={[styles.closeLine, { transform: [{ rotate: '45deg' }] }]} />
                            <View style={[styles.closeLine, { transform: [{ rotate: '-45deg' }] }]} />
                        </View>
                    </TouchableOpacity>

                    <GestureDetector gesture={pinchGesture}>
                        <Animated.View style={styles.gestureContainer}>
                            <Animated.Image
                                source={source}
                                style={[styles.modalImage, imageStyle]}
                                resizeMode="contain"
                                onLoad={handleImageLoad}
                                onError={handleImageError}
                            />
                            {isLoading && (
                                <ActivityIndicator 
                                    size="large" 
                                    color="white"
                                    style={StyleSheet.absoluteFill}
                                />
                            )}
                        </Animated.View>
                    </GestureDetector>
                </GestureHandlerRootView>
            </Modal>
        </>
    );
};


const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    gestureContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalImage: {
        width: '100%',
        height: '100%',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1,
        padding: 10,
    },
    closeIcon: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeLine: {
        position: 'absolute',
        width: 30,
        height: 2,
        backgroundColor: 'white',
    },
    imageWrapper: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    errorContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    thumbnailImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain', // This is key for maintaining aspect ratio
    },
});

export default ZoomableImage;