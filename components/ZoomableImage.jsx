import React, { useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';
import ThemedText from './ThemedText';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const ZoomableImage = ({ source, style, alt, debug = false }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    
    // 1. Shared values for scale AND movement
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const savedTranslateX = useSharedValue(0);
    const savedTranslateY = useSharedValue(0);

    const { colors } = useTheme();

    // Fix Lint Warning: Added 'debug' and 'source.uri' correctly to deps
    React.useEffect(() => {
        if (source?.uri) {
            if (source.uri.startsWith('data:image')) {
                setIsLoading(false);
                return;
            }

            Image.getSize(source.uri, (width, height) => {
                if (debug) console.log('Image dimensions:', { width, height });
                setIsLoading(false);
            }, (error) => {
                console.error('Error getting image size:', error);
                setHasError(true);
            });
        }
    }, [source?.uri, debug]);

    // 2. The Zoom (Pinch) Gesture
    const pinchGesture = Gesture.Pinch()
        .onUpdate((event) => {
            scale.value = Math.max(1, Math.min(8, savedScale.value * event.scale));
        })
        .onEnd(() => {
            savedScale.value = scale.value;
        });

    // 3. The Move (Pan) Gesture
    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            // Only allow panning if zoomed in
            if (scale.value > 1) {
                translateX.value = savedTranslateX.value + event.translationX;
                translateY.value = savedTranslateY.value + event.translationY;
            }
        })
        .onEnd(() => {
            savedTranslateX.value = translateX.value;
            savedTranslateY.value = translateY.value;
        });

    // Combine them
    const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

    const imageStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value }
        ],
    }));

    const resetZoom = () => {
        scale.value = withSpring(1);
        savedScale.value = 1;
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
    };

    // ... handleImageLoad, handleImageError, handleLayout (same as your original)
    const handleImageLoad = () => setIsLoading(false);
    const handleImageError = () => { setIsLoading(false); setHasError(true); };

    return (
        <>
            <TouchableOpacity onPress={() => setIsModalVisible(true)}>
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

            <Modal visible={isModalVisible} transparent={true} onRequestClose={() => { resetZoom(); setIsModalVisible(false); }}>
                <GestureHandlerRootView style={styles.modalContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => { resetZoom(); setIsModalVisible(false); }}>
                        <ThemedText style={{ color: 'white', fontSize: 18 }}>סגור</ThemedText>
                    </TouchableOpacity>

                    <GestureDetector gesture={composedGesture}>
                        <Animated.View style={styles.gestureContainer}>
                            <Animated.Image
                                source={source}
                                style={[styles.modalImage, imageStyle]}
                                resizeMode="contain"
                            />
                        </Animated.View>
                    </GestureDetector>
                </GestureHandlerRootView>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    modalContainer: { flex: 1, backgroundColor: 'black' },
    gestureContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    modalImage: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT },
    closeButton: { position: 'absolute', top: 50, right: 20, zIndex: 10, padding: 10, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 20 },
    imageWrapper: { width: '100%', height: '100%', overflow: 'hidden' },
    thumbnailImage: { width: '100%', height: '100%' },
    errorContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' }
});

export default ZoomableImage;