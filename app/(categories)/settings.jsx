import { View, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import ThemedText from '../../components/ThemedText';

export default function Settings() {
  const { colors, fontSize, setFontSize } = useTheme();
  
  const fontSizes = [
    { label: 'קטנטן', value: 0.4 },
    { label: 'קטן מאוד', value: 0.6 },
    { label: 'קטן', value: 0.8 },
    { label: 'בינוני', value: 1 },
    { label: 'גדול', value: 1.2 },
    { label: 'גדול מאוד', value: 1.4 },
    { label: 'ענק', value: 1.6 }
  ];

  return (
    <ScrollView 
      className="flex-1 p-4" 
      style={{ backgroundColor: colors.background }}
    >
      <View className="rounded-lg p-6" style={{ backgroundColor: colors.card }}>
        
        <View className="mt-4">
          <ThemedText style={{ fontSize: 20, marginBottom: 8, textAlign: 'right' }} className="font-guttman">
            גודל טקסט
          </ThemedText>
          <View className="flex-column items-center gap-4 mt-2">
            {fontSizes.map((size) => (
              <TouchableOpacity
                key={size.value}
                onPress={() => setFontSize(size.value)}
                style={{ 
                  padding: 8,
                  borderRadius: 8,
                  backgroundColor: fontSize === size.value ? colors.primary : colors.secondary,
                  width: '80%',  // Add fixed width
                }}
              >
                <ThemedText 
                  className="font-guttman"
                  style={{ 
                    color: fontSize === size.value ? colors.text : colors.text,
                    fontSize: 20 * size.value,
                    textAlign: 'center'  // Center the text
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