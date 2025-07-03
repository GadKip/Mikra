import { useEffect, useRef } from 'react';
import { Animated, Text, View, ImageBackground, useWindowDimensions, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import Constants from 'expo-constants';
import ThemedText from '../components/ThemedText';
import ThemeToggle from '../components/ThemeToggle';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SplashScreen() {
  const router = useRouter();
  const { colors, theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const version = Constants.expoConfig?.version ?? '1.0.0';
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

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
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar
        backgroundColor={theme === 'dark' ? colors.card : 'transparent'}
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <ImageBackground
        source={isLandscape ? 
          require('../assets/splash-landscape.png') : 
          require('../assets/splash.png')
        }
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <Animated.View 
          className="flex-1"
          style={{ 
            opacity: fadeAnim,
            backgroundColor: `${colors.background}CC`
          }}
        >
          <ThemeToggle />
          {/* Main content - conditionally positioned */}
          <View
            style={{
              flex: 1,
              justifyContent: isLandscape ? 'center' : 'flex-start',
              alignItems: 'center',
              paddingHorizontal: 20,
              marginTop: isLandscape ? 0 : 100 // Add top margin only in portrait mode
            }}
          >
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
        </Animated.View>
      </ImageBackground>
    </SafeAreaView>
  );
}
