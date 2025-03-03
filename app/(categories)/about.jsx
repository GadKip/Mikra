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
        <ThemedText className="text-2xl font-ezra text-center mb-4">
          אודות האפליקציה
        </ThemedText>
        <ThemedText className="text-lg font-ezra text-right mb-2">
          מקרא מבואר - המקרא לצד פירושו בשפה עכשווית
        </ThemedText>
        <ThemedText className="text-lg font-ezra text-right">
          מאת דוד כוכב
        </ThemedText>
      </View>
    </ScrollView>
  );
}