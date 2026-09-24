import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    // --- Autenticación y Rol ---
    // Inicializamos sesión con un usuario por defecto o recuperamos de localStorage
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('sanjuan_user');
        return saved ? JSON.parse(saved) : null;
    });

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('sanjuan_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('sanjuan_user');
    };

    // --- Accesibilidad: Modo Claro / Oscuro ---
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('sanjuan_theme') || 'light';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('sanjuan_theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    // --- Accesibilidad: Tamaño de fuente ajustable ---
    const [fontSize, setFontSize] = useState(16); // 16px base

    const adjustFontSize = (delta) => {
        setFontSize((prev) => {
            const next = prev + delta;
            if (next >= 12 && next <= 22) {
                document.documentElement.style.setProperty('--font-base', `${next}px`);
                return next;
            }
            return prev;
        });
    };

    return (
        <AppContext.Provider
            value={{
                user,
                login,
                logout,
                isAdmin: user?.role === 'admin',
                theme,
                toggleTheme,
                fontSize,
                adjustFontSize,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);