import { View, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import ThemedText from '../../components/ThemedText';
import Constants from 'expo-constants';
import ThemeToggle from '../../components/ThemeToggle';

export default function About() {
  const { colors } = useTheme();
  const version = Constants.expoConfig?.version ?? '1.0.0';
  
  return (
    <ScrollView 
      className="flex-1 p-4" 
      style={{ backgroundColor: colors.background }}
    >
      <ThemeToggle />
      {/* Main content card */}
      <View className="rounded-lg p-6"
      style={{
        backgroundColor: colors.card,
        alignItems: 'center',
        direction: 'ltr',
       }}>
        <ThemedText 
        style={{
          fontSize: 24,
          textAlign: 'center',
          marginBottom: 16,
          width: '100%'
        }}
          className="font-guttman"
        >
          מקרא מבואר
        </ThemedText>
        <ThemedText
        style={{
          fontSize: 18,
          textAlign: 'right',
          marginBottom: 8
        }}
        className="font-guttman">
          המקרא לצד תרגומו לשפה עכשווית
        </ThemedText>
        <ThemedText
        style={{
          fontSize: 20,
          textAlign: 'right',
          marginBottom: 8
        }}
        className="font-guttman">
          מאת הרב דוד כוכב
        </ThemedText>
      </View>

      {/* Bottom info */}
      <View className="items-center pb-8">
        <ThemedText
          style={{ 
            fontSize: 14, 
            marginBottom: 12, 
            textAlign: 'center', 
            opacity: 0.7 
          }}
        >
          Developed by Gadi K. ©
        </ThemedText>
        <ThemedText 
          style={{ 
            fontSize: 14, 
            textAlign: 'center', 
            opacity: 0.6 
            }}
        >
          Version {version}
        </ThemedText>
      </View>
    </ScrollView>
  );
}