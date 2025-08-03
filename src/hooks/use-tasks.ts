"use client";
import { useState, useEffect, useCallback } from 'react';
import type { Task } from '@/lib/types';

const TASKS_STORAGE_KEY = 'offline-task-manager-tasks';

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
            if (storedTasks) {
                const parsedTasks: Task[] = JSON.parse(storedTasks);
                setTasks(parsedTasks.sort((a, b) => {
                    if (a.completed !== b.completed) {
                        return a.completed ? 1 : -1;
                    }
                    return b.updatedAt - a.updatedAt;
                }));
            }
        } catch (error) {
            console.error("Failed to load tasks from local storage", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isLoading) {
            try {
                localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
            } catch (error) {
                console.error("Failed to save tasks to local storage", error);
            }
        }
    }, [tasks, isLoading]);

    const addTask = useCallback(() => {
        const newTask: Task = {
            id: crypto.randomUUID(),
            title: "New Task",
            content: "",
            completed: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        setTasks(prevTasks => [newTask, ...prevTasks].sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            return b.updatedAt - a.updatedAt;
        }));
        return newTask;
    }, []);

    const updateTask = useCallback((id: string, title: string, content: string, completed?: boolean) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === id ? { ...task, title, content, completed: completed ?? task.completed, updatedAt: Date.now() } : task
            ).sort((a, b) => {
                if (a.completed !== b.completed) {
                    return a.completed ? 1 : -1;
                }
                return b.updatedAt - a.updatedAt;
            })
        );
    }, []);
    
    const toggleTaskCompletion = useCallback((id: string) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === id ? { ...task, completed: !task.completed, updatedAt: Date.now() } : task
            ).sort((a, b) => {
                if (a.completed !== b.completed) {
                    return a.completed ? 1 : -1;
                }
                return b.updatedAt - a.updatedAt;
            })
        );
    }, []);

    const deleteTask = useCallback((id: string) => {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    }, []);


    const getTaskById = useCallback((id: string | null): Task | null => {
        if (!id) return null;
        return tasks.find(task => task.id === id) || null;
    }, [tasks]);

    return { tasks, isLoading, addTask, updateTask, deleteTask, getTaskById, toggleTaskCompletion };
}
