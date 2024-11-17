import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { Link } from 'expo-router';
import "../global.css";



export default function App() {
  return (
    <View>
      <Text className="color-orange-800 bg-sky-500">מקרא מבואר</Text>
      <StatusBar />
      <Text className="text-3xl">ספר</Text>
      <Link href="/profile">ספר</Link>
    </View>
  );
}

