// components/ThemedText.jsx
import React from 'react';
import { Text } from 'react-native'; // Import Text from react-native
import { useTheme } from '../context/ThemeContext';

const ThemedText = ({ style, ...props }) => {
  const { colors } = useTheme();
  return (
    <Text // Corrected: Rendering the standard Text component
      {...props}
      style={[
        { color: colors.text,
          textAlign: 'justify'
         }, // Apply theme-aware text color
        style,                     // Allow overriding with specific styles
      ]}
    />
  );
};

export default ThemedText;