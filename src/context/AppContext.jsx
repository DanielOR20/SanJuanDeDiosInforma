import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  // Niveles de fuente: 'normal', 'large', 'xlarge'
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('fontSize') || 'normal');
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Efecto para aplicar tema
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Efecto para cambiar tamaño de texto en TODO el sitio
  useEffect(() => {
    const root = document.documentElement;
    if (fontSize === 'normal') {
      root.style.fontSize = '16px';
    } else if (fontSize === 'large') {
      root.style.fontSize = '18px';
    } else if (fontSize === 'xlarge') {
      root.style.fontSize = '20px';
    }
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const increaseFontSize = () => {
    setFontSize(prev => {
      if (prev === 'normal') return 'large';
      if (prev === 'large') return 'xlarge';
      return 'xlarge';
    });
  };

  const decreaseFontSize = () => {
    setFontSize(prev => {
      if (prev === 'xlarge') return 'large';
      if (prev === 'large') return 'normal';
      return 'normal';
    });
  };

  const toggleFontSize = () => {
    setFontSize(prev => (prev === 'normal' ? 'large' : prev === 'large' ? 'xlarge' : 'normal'));
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      fontSize,
      toggleFontSize,
      increaseFontSize,
      decreaseFontSize,
      user,
      login,
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
export { AppContext };