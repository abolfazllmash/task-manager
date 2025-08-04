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
    const { tasks } = useTaskContext();
    const completedTasks = tasks.filter(t => t.completed).length;

    useEffect(() => {
        const themeName = getThemeName(completedTasks);
        const classList = document.documentElement.classList;
        for (let i = classList.length - 1; i >= 0; i--) {
            if (classList[i].startsWith('theme-')) {
                classList.remove(classList[i]);
            }
        }
        classList.add(themeName);
    }, [completedTasks]);

    return null;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <TaskProvider>
            <ThemeUpdater />
            {children}
        </TaskProvider>
    );
}
