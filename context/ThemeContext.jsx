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
    setColumnLoading(true);
    console.log('=== Toggle Column Start ===');
    console.log('Current state:', {
        columnIndex,
        visibleColumns,
        wasClicked: columnIndex === 2 ? 'מקור' : 'תרגום'
    });
    
    try {
        const newVisibility = await new Promise(resolve => {
            setVisibleColumns(prevVisibility => {
                console.log('Previous visibility:', prevVisibility);
                
                if (columnIndex === 2 || columnIndex === 3) {
                    const otherColumn = columnIndex === 2 ? 3 : 2;
                    console.log('Content column check:', {
                        columnIsVisible: prevVisibility[columnIndex],
                        otherIsVisible: prevVisibility[otherColumn],
                        columnIndex,
                        otherColumn
                    });

                    // Case 1: If this column is visible and other is hidden
                    if (prevVisibility[columnIndex] && !prevVisibility[otherColumn]) {
                        console.log('Case 1: Current visible, other hidden');
                        const newState = {
                            ...prevVisibility,
                            [columnIndex]: false,
                            [otherColumn]: true
                        };
                        console.log('New state (Case 1):', newState);
                        resolve(newState);
                        return newState;
                    }

                    // Case 2: If both are visible
                    if (prevVisibility[columnIndex] && prevVisibility[otherColumn]) {
                        console.log('Case 2: Both visible');
                        const newState = {
                            ...prevVisibility,
                            [columnIndex]: false
                        };
                        console.log('New state (Case 2):', newState);
                        resolve(newState);
                        return newState;
                    }

                    // Case 3: If current is hidden
                    if (!prevVisibility[columnIndex]) {
                        console.log('Case 3: Current hidden');
                        const newState = {
                            ...prevVisibility,
                            [columnIndex]: true
                        };
                        console.log('New state (Case 3):', newState);
                        resolve(newState);
                        return newState;
                    }

                    // Fallback case
                    console.log('No condition met, returning previous state');
                    resolve(prevVisibility);
                    return prevVisibility;
                }
                
                // Non-content columns
                const newState = {
                    ...prevVisibility,
                    [columnIndex]: !prevVisibility[columnIndex]
                };
                console.log('Non-content column toggle:', newState);
                resolve(newState);
                return newState;
            });
        });

        console.log('Saving to storage:', newVisibility);
        await AsyncStorage.setItem('columnVisibility', JSON.stringify(newVisibility));
        console.log('=== Toggle Column End ===');

    } catch (error) {
        console.error('Error in toggleColumn:', error);
    } finally {
        setColumnLoading(false);
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
