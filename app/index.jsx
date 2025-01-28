import "../global.css";
import { View, Text, Image, Animated } from 'react-native';
import { Redirect } from 'expo-router';
import { useState, useEffect, useRef } from 'react';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        setIsReady(true);
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isReady) {
    return <Redirect href="/books" />;
  }

  return (
    <Animated.View 
      className="flex-1 items-center justify-center bg-background p-4"
      style={{ opacity: fadeAnim }}
    >
      <Text className="text-text text-3xl mb-4 text-center">מקרא</Text>
      <Text className="text-text text-lg mb-2 text-center">
        ספר הספרים העברי הראשון
      </Text>
      <Text className="text-text text-base text-center opacity-75">
        גישה מהירה ונוחה לתנ״ך
      </Text>
    </Animated.View>
  );
}