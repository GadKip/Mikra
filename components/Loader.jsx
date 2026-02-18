import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useTheme } from '../context/ThemeContext';
import ThemedText from "./ThemedText";

export default function Loader({ isLoading }) {
  const { colors } = useTheme();

  if (!isLoading) return null;

  return (
    <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
      <View style={[styles.container, { backgroundColor: colors.card }]}>
        <ActivityIndicator size="large" color={colors.highlight} />
        <ThemedText style={styles.text}>
          טוען...
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12, // Spaces out the spinner and the text
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  text: {
    fontSize: 18,
    fontFamily: 'EzraSILSR',
    marginTop: 8
  }
});