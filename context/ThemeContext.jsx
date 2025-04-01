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
  const [visibleColumns, setVisibleColumns] = useState({
    0: true,  // Chapter numbers
    1: true,  // Verse numbers
    2: true,  // Original text
    3: true   // Translation
  });
  const [columnLoading, setColumnLoading] = useState(false); // Add loading state

  const toggleColumn = async (columnIndex) => {
    setColumnLoading(true); // Set loading to true immediately

    // Optimistic update
    setVisibleColumns(prevVisibility => {
        const newVisibility = {
            ...prevVisibility,
            [columnIndex]: !prevVisibility[columnIndex]
        };
        if (columnIndex >= 2 && !newVisibility[2] && !newVisibility[3]) {
            return prevVisibility; // Revert if invalid
        }
        return newVisibility;
    });

    try {
        // Persist to AsyncStorage
        await AsyncStorage.setItem('columnVisibility', JSON.stringify({
            ...visibleColumns, // Use the previous state for persistence
            [columnIndex]: !visibleColumns[columnIndex]
        }));
    } catch (error) {
        console.error('Error saving column visibility:', error);
        // Revert on error
        setVisibleColumns(prevVisibility => prevVisibility);
    } finally {
        setColumnLoading(false); // Set loading to false after completion
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      const savedFontSize = await AsyncStorage.getItem('fontSize');
      let savedVisibility = await AsyncStorage.getItem('columnVisibility');
      
      if (savedTheme) setTheme(savedTheme);
      if (savedFontSize) {
        const parsedSize = parseFloat(savedFontSize);
        if (!isNaN(parsedSize)) {
          setFontSize(parsedSize);
        } else {
          setFontSize(1);
        }
      }
      if (savedVisibility) {
        try {
          savedVisibility = JSON.parse(savedVisibility);
          // Ensure all keys exist in parsed object
          setVisibleColumns({
            0: savedVisibility[0] !== undefined ? savedVisibility[0] : true,
            1: savedVisibility[1] !== undefined ? savedVisibility[1] : true,
            2: savedVisibility[2] !== undefined ? savedVisibility[2] : true,
            3: savedVisibility[3] !== undefined ? savedVisibility[3] : true,
          });
        } catch (parseError) {
          console.error('Error parsing column visibility, resetting to defaults', parseError);
          setVisibleColumns({ 0: true, 1: true, 2: true, 3: true });
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

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
      setTheme: updateTheme,
      visibleColumns,
      toggleColumn,
      columnLoading // Add loading state to context
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
