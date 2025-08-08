
"use client";
import { useState, useEffect, useCallback } from 'react';
import type { Task, TaskType } from '@/lib/types';

const TASKS_STORAGE_KEY = 'offline-task-manager-tasks';
const TASKS_LAST_CLEANUP_KEY = 'offline-task-manager-last-cleanup';

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const lastCleanupStr = localStorage.getItem(TASKS_LAST_CLEANUP_KEY);
            const now = Date.now();
            const oneMonthInMs = 30 * 24 * 60 * 60 * 1000;

            if (lastCleanupStr) {
                const lastCleanup = parseInt(lastCleanupStr, 10);
                if (now - lastCleanup > oneMonthInMs) {
                    localStorage.removeItem(TASKS_STORAGE_KEY);
                    localStorage.setItem(TASKS_LAST_CLEANUP_KEY, now.toString());
                    setTasks([]);
                } else {
                    const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
                     if (storedTasks) {
                        const parsedTasks: Task[] = JSON.parse(storedTasks);
                        setTasks(parsedTasks);
                    }
                }
            } else {
                localStorage.setItem(TASKS_LAST_CLEANUP_KEY, now.toString());
                const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
                if (storedTasks) {
                    const parsedTasks: Task[] = JSON.parse(storedTasks);
                    setTasks(parsedTasks);
                }
            }
        } catch (error) {
            console.error("Failed to load or clean up tasks from local storage", error);
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

    const addTask = useCallback((title: string, dueDate?: Date, type: TaskType = 'personal', parentId?: string) => {
        if (!title.trim()) return;
        const newTask: Task = {
            id: crypto.randomUUID(),
            title: title.trim(),
            content: "",
            completed: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            dueDate: dueDate?.toISOString(),
            type,
            parentId: parentId,
        };
        setTasks(prevTasks => [...prevTasks, newTask]);
        return newTask;
    }, []);

    const updateTask = useCallback((id: string, data: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === id ? { ...task, ...data, updatedAt: Date.now() } : task
            )
        );
    }, []);
    
    const toggleTaskCompletion = useCallback((id: string) => {
        setTasks(prevTasks => {
            const tasksCopy = prevTasks.map(t => ({...t})); // Deep copy for mutation
            const task = tasksCopy.find(t => t.id === id);
            if (!task) return prevTasks;
    
            const newCompletedState = !task.completed;
            task.completed = newCompletedState;
            task.updatedAt = Date.now();
    
            // If it's a parent task, update all its children
            if (!task.parentId) {
                tasksCopy.forEach(child => {
                    if (child.parentId === id) {
                        child.completed = newCompletedState;
                        child.updatedAt = Date.now();
                    }
                });
            }
            // If it's a sub-task, check if the parent needs updating
            else {
                const parent = tasksCopy.find(p => p.id === task.parentId);
                if (parent) {
                    const siblings = tasksCopy.filter(s => s.parentId === parent.id);
                    const allSiblingsCompleted = siblings.every(s => s.completed);
                    
                    if (parent.completed !== allSiblingsCompleted) {
                       parent.completed = allSiblingsCompleted;
                       parent.updatedAt = Date.now();
                    }
                }
            }
    
            return tasksCopy;
        });
    }, []);

    const deleteTask = useCallback((id: string) => {
        setTasks(prevTasks => {
            const taskToDelete = prevTasks.find(t => t.id === id);
            if (!taskToDelete) return prevTasks;

            const idsToDelete = [id];
            // If it's a parent task, also mark its children for deletion
            if (!taskToDelete.parentId) {
                const childrenIds = prevTasks.filter(t => t.parentId === id).map(t => t.id);
                idsToDelete.push(...childrenIds);
            }

            return prevTasks.filter(task => !idsToDelete.includes(task.id));
        });
    }, []);


    const getTaskById = useCallback((id: string | null): Task | null => {
        if (!id) return null;
        return tasks.find(task => task.id === id) || null;
    }, [tasks]);

    return { tasks, isLoading, addTask, updateTask, deleteTask, getTaskById, toggleTaskCompletion };
}
