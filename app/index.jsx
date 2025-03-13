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
      <ThemedText style={{ fontSize: 30, marginBottom: 16, textAlign: 'center' }}>
        מקרא מבואר
      </ThemedText>
      <ThemedText style={{ fontSize: 18, marginBottom: 8, textAlign: 'center' }}>
        המקרא לצד פירושו בשפה עכשווית
      </ThemedText>
      <ThemedText style={{ fontSize: 16, marginBottom: 8, textAlign: 'center' }}>
        מאת דוד כוכב
      </ThemedText>
      <ThemedText style={{ fontSize: 14, textAlign: 'center', opacity: 0.75 }}>
        גרסה {version}
      </ThemedText>
    </Animated.View>
  );
}
