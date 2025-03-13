import { View, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import ThemedText from '../../components/ThemedText';

export default function About() {
  const { colors } = useTheme();
  
  return (
    <ScrollView 
      className="flex-1 p-4" 
      style={{ backgroundColor: colors.background }}
    >
      <View className="rounded-lg p-6" style={{ backgroundColor: colors.card }}>
        <ThemedText style={{ fontSize: 24, textAlign: 'center', marginBottom: 16 }} className="font-ezra">
          אודות האפליקציה
        </ThemedText>
        <ThemedText style={{ fontSize: 18, textAlign: 'right', marginBottom: 8 }} className="font-ezra">
          מקרא מבואר - המקרא לצד פירושו בשפה עכשווית
        </ThemedText>
        <ThemedText style={{ fontSize: 18, textAlign: 'right' }} className="font-ezra">
          מאת דוד כוכב
        </ThemedText>
      </View>
    </ScrollView>
  );
}