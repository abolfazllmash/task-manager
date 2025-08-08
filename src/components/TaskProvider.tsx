"use client";

import React, { createContext, useContext, useMemo } from 'react';
import { useTasks, type UseTasksReturnType } from '@/hooks/use-tasks';
import { useAchievements } from '@/hooks/use-achievements';

type TaskContextType = UseTasksReturnType;

const TaskContext = createContext<TaskContextType | null>(null);

function AchievementsManager() {
    const { tasks, stats } = useTaskContext();
    useAchievements(tasks, stats);
    return null;
}

export function TaskProvider({ children }: { children: React.ReactNode }) {
    const taskValue = useTasks();
    
    const contextValue = useMemo(() => {
        return taskValue;
    }, [taskValue]);

    return (
        <TaskContext.Provider value={contextValue}>
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
