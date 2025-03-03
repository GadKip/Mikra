import { View, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import ThemedText from '../../components/ThemedText';

export default function Settings() {
  const { colors } = useTheme();
  
  return (
    <ScrollView 
      className="flex-1 p-4" 
      style={{ backgroundColor: colors.background }}
    >
      <View className="rounded-lg p-6" style={{ backgroundColor: colors.card }}>
        <ThemedText className="text-2xl font-ezra text-center mb-4">
          הגדרות
        </ThemedText>
        {/* Add settings options here */}
      </View>
    </ScrollView>
  );
}