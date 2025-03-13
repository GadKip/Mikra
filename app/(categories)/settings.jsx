import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import ThemedText from '../../components/ThemedText';

export default function Settings() {
  const { colors, fontSize, setFontSize } = useTheme();
  
  const fontSizes = [
    { label: 'קטן', value: 0.8 },
    { label: 'רגיל', value: 1 },
    { label: 'גדול', value: 1.2 },
    { label: 'גדול מאוד', value: 1.4 }
  ];

  return (
    <ScrollView 
      className="flex-1 p-4" 
      style={{ backgroundColor: colors.background }}
    >
      <View className="rounded-lg p-6" style={{ backgroundColor: colors.card }}>
        <ThemedText style={{ fontSize: 24, textAlign: 'center', marginBottom: 16 }} className="font-ezra">
          הגדרות
        </ThemedText>
        
        <View className="mt-4">
          <ThemedText style={{ fontSize: 20, marginBottom: 8, textAlign: 'right' }} className="font-ezra">
            גודל טקסט
          </ThemedText>
          <View className="flex-row justify-end gap-4 mt-2">
            {fontSizes.map((size) => (
              <TouchableOpacity
                key={size.value}
                onPress={() => setFontSize(size.value)}
                className={`px-4 py-2 rounded-lg ${
                  fontSize === size.value ? 'bg-primary' : 'bg-secondary'
                }`}
              >
                <ThemedText 
                  className="font-ezra"
                  style={{ 
                    color: fontSize === size.value ? '#fff' : colors.text,
                    fontSize: 16 * size.value  // Scale the button text too
                  }}
                >
                  {size.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}