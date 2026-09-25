import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Autenticación
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sjd_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Accesibilidad: Tamaño de fuente ('normal' | 'large' | 'xlarge')
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('sjd_fontsize') || 'normal';
  });

  // Accesibilidad: Tema claro / oscuro
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('sjd_theme') || 'light';
  });

  // Accesibilidad: Modo Alto Contraste (para baja visión / daltonismo)
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('sjd_high_contrast') === 'true';
  });

  // Accesibilidad: Lector de pantalla / Voz
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('sjd_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('sjd_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('sjd_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('sjd_fontsize', fontSize);
    document.documentElement.setAttribute('data-fontsize', fontSize);
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('sjd_high_contrast', highContrast);
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleHighContrast = () => {
    setHighContrast(prev => !prev);
  };

  const increaseFontSize = () => {
    setFontSize(prev => (prev === 'normal' ? 'large' : 'xlarge'));
  };

  const decreaseFontSize = () => {
    setFontSize(prev => (prev === 'xlarge' ? 'large' : 'normal'));
  };

  // Función de lectura por voz para discapacidad visual
  const speakText = (text) => {
    if (!('speechSynthesis' in window)) {
      alert('Su navegador no soporta síntesis de voz.');
      return;
    }
    window.speechSynthesis.cancel();
    if (isSpeaking) {
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-CR';
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        theme,
        toggleTheme,
        fontSize,
        increaseFontSize,
        decreaseFontSize,
        highContrast,
        toggleHighContrast,
        speakText,
        stopSpeaking,
        isSpeaking
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);