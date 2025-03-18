import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
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
      className="flex-1"
      style={{ 
        opacity: fadeAnim,
        backgroundColor: colors.background
      }}
    >
      {/* Main content in center */}
      <View className="flex-1 items-center justify-center">
        <ThemedText style={{ fontSize: 30, marginBottom: 16, textAlign: 'center' }}>
          מקרא מבואר
        </ThemedText>
        <ThemedText style={{ fontSize: 18, marginBottom: 8, textAlign: 'center' }}>
          המקרא לצד תרגומו לשפה עכשווית
        </ThemedText>
        <ThemedText style={{ fontSize: 16, marginBottom: 8, textAlign: 'center' }}>
          מאת דוד כוכב
        </ThemedText>
      </View>

      {/* Bottom section */}
      <View className="items-center pb-8">
        <ThemedText style={{ fontSize: 14, marginBottom: 12, textAlign: 'center', opacity: 0.7 }}>
          Developed by Gadi K. ©
        </ThemedText>
        <ThemedText style={{ fontSize: 14, textAlign: 'center', opacity: 0.6 }}>
          Version {version}
        </ThemedText>
      </View>
    </Animated.View>
  );
}
