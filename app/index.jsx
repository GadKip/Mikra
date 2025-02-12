import { useEffect, useRef } from 'react';
import { Animated, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import Constants from 'expo-constants';
import ThemedText from '../components/ThemedText';

export default function SplashScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const version = Constants.expoConfig?.version ?? '1.0.0';

  useEffect(() => {
    // Start fade in animation immediately
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Set timer for navigation
    const timer = setTimeout(() => {
      // Start fade out animation
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        router.push('/(categories)');
      });
    }, 3400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View 
      className="flex-1 items-center justify-center"
      style={{ 
        opacity: fadeAnim,
        backgroundColor: colors.background
      }}
    >
      <ThemedText className="text-3xl mb-4 text-center">
        מקרא מבואר
      </ThemedText>
      <ThemedText className="text-lg mb-2 text-center">
        המקרא לצד פירושו בשפה עכשווית
      </ThemedText>
      <ThemedText className="text-base mb-2 text-center" >
        מאת דוד כוכב
      </ThemedText>
      <ThemedText className="text-sm text-center opacity-75">
        גרסה {version}
      </ThemedText>
    </Animated.View>
  );
}
