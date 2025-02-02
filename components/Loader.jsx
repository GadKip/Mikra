import { View, ActivityIndicator, Dimensions, Platform, Text } from "react-native";
import { useTheme } from '../context/ThemeContext';

export default function Loader({ isLoading }) {
  const { colors } = useTheme();
  const osName = Platform.OS;
  const screenHeight = Dimensions.get("screen").height;

  if (!isLoading) return null;

  return (
    <View className="absolute inset-0 z-50 flex-1 items-center justify-center bg-black/50">
      <View className="rounded-lg p-4" style={{ backgroundColor: colors.card }}>
        <Text className="text-lg" style={{ color: colors.text }}>
          טוען...
        </Text>
      </View>
    </View>
  );
}