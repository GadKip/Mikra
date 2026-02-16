import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function ThemeToggle({ style }) {
  const { colors, theme, toggleTheme } = useTheme();
  
  return (
    <TouchableOpacity 
      onPress={toggleTheme}
      style={[{
        position: 'absolute',
        top: 10,
        left: 20,
        padding: 8,
        borderRadius: 20,
        backgroundColor: `${colors.highlight}99`,
        zIndex: 50
      }, style]}
    >
      <Ionicons 
        name={theme === 'light' ? 'moon' : 'sunny'} 
        size={24} 
        color={colors.text}
      />
    </TouchableOpacity>
  );
}