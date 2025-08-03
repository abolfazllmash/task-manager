"use client";

import React, { createContext, useContext } from 'react';
import { useTasks } from '@/hooks/use-tasks';

type TaskContextType = ReturnType<typeof useTasks>;

const TaskContext = createContext<TaskContextType | null>(null);

export function TaskProvider({ children }: { children: React.ReactNode }) {
    const taskValue = useTasks();
    return (
        <TaskContext.Provider value={taskValue}>
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
