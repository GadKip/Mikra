import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const themes = {
  light: {
    text: '#000000',
    background: '#FFFFFF',
    primary: '#8cc0ff',
    secondary: '#aba9a9',
    card: '#F5F5F5',
    border: '#E0E0E0',
    highlight: '#e0ffff',
    statusBar: 'dark-content'
  },
  dark: {
    text: '#FFFFFF',
    background: '#121212',
    primary: '#8cc0ff',
    secondary: '#424242',
    card: '#1E1E1E',
    border: '#333333',
    highlight: '#001024',
    statusBar: 'light-content'
  }
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState(1);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      const savedFontSize = await AsyncStorage.getItem('fontSize');
      
      if (savedTheme) setTheme(savedTheme);
      // Add proper parsing and validation for fontSize
      if (savedFontSize) {
        const parsedSize = parseFloat(savedFontSize);
        if (!isNaN(parsedSize)) {
          setFontSize(parsedSize);
        } else {
          setFontSize(1); // Set default if parsing fails
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  // Also modify the updateFontSize function to ensure we're working with numbers
  const updateFontSize = async (newSize) => {
    try {
      const sizeNumber = parseFloat(newSize);
      if (!isNaN(sizeNumber)) {
        await AsyncStorage.setItem('fontSize', sizeNumber.toString());
        setFontSize(sizeNumber);
      } else {
        console.warn('Invalid font size value:', newSize);
      }
    } catch (error) {
      console.error('Error saving font size:', error);
    }
  };

  const updateTheme = async (newTheme) => {
    try {
      await AsyncStorage.setItem('theme', newTheme);
      setTheme(newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      colors: themes[theme], 
      toggleTheme, 
      fontSize,
      setFontSize: updateFontSize,
      setTheme: updateTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
