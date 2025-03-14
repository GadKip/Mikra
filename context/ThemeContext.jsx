import React, { createContext, useContext, useState, useCallback } from 'react';

const ThemeContext = createContext();

export const themes = {
  light: {
    text: '#000000',
    background: '#FFFFFF',
    primary: '#8cc0ff',
    secondary: '#aba9a9',
    card: '#F5F5F5',
    border: '#E0E0E0',
    highlight: '#e4edf7',
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

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      colors: themes[theme], 
      toggleTheme, 
      fontSize,
      setFontSize
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
