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

  // 1. Función para obtener y garantizar una voz en español
  const getSpanishVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    
    // Prioridad: Voces en español latino
    const latinoVoice = voices.find(v => 
      v.lang === 'es-419' || v.lang === 'es-CR' || v.lang === 'es-MX' || v.lang === 'es-US'
    );
    if (latinoVoice) return latinoVoice;

    const anySpanishVoice = voices.find(v => 
      v.lang.toLowerCase().startsWith('es') || 
      v.name.toLowerCase().includes('spanish') || 
      v.name.toLowerCase().includes('español')
    );
    return anySpanishVoice || null;
  };

  // 2. En el useEffect del componente, asegurarse de precargar las voces
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

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
      alert('Tu navegador no soporta lectura por voz.');
      return;
    }

    if (isSpeaking || window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = text || document.querySelector('main')?.innerText || 'Bienvenido a San Juan de Dios Informa.';
    const utterance = new SpeechSynthesisUtterance(textToRead);
    
    utterance.lang = 'es-419';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const selectedVoice = getSpanishVoice();
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang; // Sincronizar el lang exacto
    }

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