"use client";

import React, { createContext, useContext } from 'react';
import { useTasks } from '@/hooks/use-tasks';
import { useAchievements } from '@/hooks/use-achievements';

type TaskContextType = ReturnType<typeof useTasks>;

const TaskContext = createContext<TaskContextType | null>(null);

function AchievementsManager() {
    const tasks = useTasks();
    useAchievements(tasks.tasks);
    return null;
}

export function TaskProvider({ children }: { children: React.ReactNode }) {
    const taskValue = useTasks();
    return (
        <TaskContext.Provider value={taskValue}>
            <AchievementsManager />
            {children}
        </TaskContext.Provider>
    );
}

export function useTaskContext() {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTaskContext must be used within a TaskProvider');
    }
    return context;
}
