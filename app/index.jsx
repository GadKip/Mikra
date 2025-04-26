import { useEffect, useRef } from 'react';
import { Animated, Text, View, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import Constants from 'expo-constants';
import ThemedText from '../components/ThemedText';
import ThemeToggle from '../components/ThemeToggle';

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
    <ImageBackground
      source={require('../assets/splash.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <Animated.View 
        className="flex-1"
        style={{ 
          opacity: fadeAnim,
          backgroundColor: `${colors.background}CC` // Semi-transparent background
        }}
      >
        <ThemeToggle />
        {/* Main content - moved down using marginTop */}
        <View className="flex-1 items-center justify-end" style={{ paddingBottom: 100 }}>
          <ThemedText style={{ 
            fontSize: 30, 
            marginBottom: 16, 
            textAlign: 'center',
            textShadowColor: colors.card,
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 2
          }}>
            מקרא מבואר
          </ThemedText>
          <ThemedText style={{ 
            fontSize: 18, 
            marginBottom: 8, 
            textAlign: 'center',
            textShadowColor: colors.card,
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 2
          }}>
            מאת הרב דוד כוכב
          </ThemedText>
          <ThemedText style={{ 
            fontSize: 16, 
            marginBottom: 8, 
            textAlign: 'center',
            textShadowColor: colors.card,
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 2
          }}>
            המקרא לצד תרגומו לשפה עכשווית
          </ThemedText>
        </View>

      </Animated.View>
      
        {/* Bottom section */}
        <View className="items-center pb-8">
          <ThemedText style={{ 
            fontSize: 14, 
            marginBottom: 12, 
            textAlign: 'center', 
            opacity: 0.7,
            textShadowColor: colors.card,
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 2
          }}>
            Developed by Gadi K. ©
          </ThemedText>
          <ThemedText style={{ 
            fontSize: 14, 
            textAlign: 'center', 
            opacity: 0.6,
            textShadowColor: colors.card,
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 2
          }}>
            Version {version}
          </ThemedText>
        </View>

    </ImageBackground>
  );
}
