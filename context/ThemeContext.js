import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

// context/ThemeContext.js
export const themes = {
  light: {
    text: '#000000',
    background: '#FFFFFF',
    primary: '#2196F3',
    secondary: '#646464',
    card: '#F5F5F5',
    border: '#E0E0E0',
    statusBar: 'dark-content'
  },
  dark: {
    text: '#FFFFFF',
    background: '#121212',
    primary: '#1976D2',
    secondary: '#424242',
    card: '#1E1E1E',
    border: '#333333',
    statusBar: 'light-content'
  }
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: themes[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);