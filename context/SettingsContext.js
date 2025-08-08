import { createContext, useContext, useState, useEffect } from 'react';

export const SettingsContext = createContext();

const defaultSettings = {
  theme: 'light', // 'light' or 'dark'
  accentColor: 'indigo',
  isDemoMode: false,
  demoCredentials: {
    email: 'demo@delighthomes.com',
    password: 'demo123',
  },
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    // Load settings from localStorage if available
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('appSettings');
      return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    }
    return defaultSettings;
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('appSettings', JSON.stringify(settings));
      
      // Update document class for theme
      document.documentElement.classList.toggle('dark', settings.theme === 'dark');
      
      // Update CSS variables for accent color
      document.documentElement.style.setProperty('--color-primary', `var(--${settings.accentColor}-600)`);
      document.documentElement.style.setProperty('--color-primary-light', `var(--${settings.accentColor}-500)`);
      document.documentElement.style.setProperty('--color-primary-dark', `var(--${settings.accentColor}-700)`);
    }
  }, [settings]);

  const toggleTheme = () => {
    setSettings(prev => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light',
    }));
  };

  const setAccentColor = (color) => {
    setSettings(prev => ({
      ...prev,
      accentColor: color,
    }));
  };

  const toggleDemoMode = () => {
    setSettings(prev => ({
      ...prev,
      isDemoMode: !prev.isDemoMode,
    }));
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        toggleTheme,
        setAccentColor,
        toggleDemoMode,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
