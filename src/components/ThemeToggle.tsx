'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Only render theme-dependent content after mount to avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // During SSR and initial render, show a placeholder to avoid hydration mismatch
    if (!mounted) {
        return (
            <button
                className="p-2 text-slate-400 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors rounded-full hover:bg-slate-200 dark:hover:bg-slate-800"
                title="Toggle theme"
                disabled
            >
                <div className="w-6 h-6" />
            </button>
        );
    }

    return (
        <button
            onClick={toggleTheme}
            className="p-2 text-slate-400 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors rounded-full hover:bg-slate-200 dark:hover:bg-slate-800"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
            {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
    );
}
