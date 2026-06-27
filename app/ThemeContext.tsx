import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeType = {
  isDark: boolean;
  setTheme: (v: boolean) => Promise<void>;
};

const ThemeContext = createContext<ThemeType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setDark] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem('darkMode');
        if (saved !== null) {
          setDark(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeTheme();
  }, []);

  const setTheme = async (value: boolean) => {
    try {
      setDark(value);
      await AsyncStorage.setItem('darkMode', JSON.stringify(value));
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  if (loading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ isDark, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
}