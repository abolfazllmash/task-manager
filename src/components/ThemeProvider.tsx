"use client";

import React, { useEffect } from 'react';
import { TaskProvider, useTaskContext } from '@/components/TaskProvider';

const levels = [
    { name: "novice", threshold: 0 },
    { name: "steadfast", threshold: 21 },
    { name: "ninja", threshold: 51 },
    { name: "samurai", threshold: 101 },
    { name: "knight", threshold: 221 },
];

function getThemeName(completedTasks: number): string {
    for (let i = levels.length - 1; i >= 0; i--) {
        if (completedTasks >= levels[i].threshold) {
            return `theme-${levels[i].name}`;
        }
    }
    return 'theme-novice';
}


function ThemeUpdater() {
    const { stats } = useTaskContext();
    const completedTasksCount = stats.totalCompletedCount;

    useEffect(() => {
        const themeName = getThemeName(completedTasksCount);
        const classList = document.documentElement.classList;
        
        const themeClasses = Array.from(classList).filter(c => c.startsWith('theme-'));
        if (themeClasses.length > 0) {
            classList.remove(...themeClasses);
        }
        
        classList.add(themeName);
    }, [completedTasksCount]);

    return null;
}

// This is the main ThemeProvider that should wrap the application in layout.tsx
export function ThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <TaskProvider>
            <ThemeUpdater />
            {children}
        </TaskProvider>
    );
}
