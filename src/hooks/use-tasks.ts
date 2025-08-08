
"use client";
import { useState, useEffect, useCallback } from 'react';
import type { Task, TaskType, Stats } from '@/lib/types';

const TASKS_STORAGE_KEY = 'offline-task-manager-tasks';
const STATS_STORAGE_KEY = 'offline-task-manager-stats';
const LAST_CLEANUP_STORAGE_KEY = 'offline-task-manager-last-cleanup';

const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000;

export type UseTasksReturnType = ReturnType<typeof useTasks>;

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [stats, setStats] = useState<Stats>({ totalCompletedCount: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            // Load tasks
            const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
            if (storedTasks) {
                setTasks(JSON.parse(storedTasks));
            }

            // Load stats
            const storedStats = localStorage.getItem(STATS_STORAGE_KEY);
            if (storedStats) {
                setStats(JSON.parse(storedStats));
            }

            // Cleanup old tasks
            const lastCleanup = localStorage.getItem(LAST_CLEANUP_STORAGE_KEY);
            const now = Date.now();
            if (!lastCleanup || (now - parseInt(lastCleanup, 10)) > THIRTY_DAYS_IN_MS) {
                 setTasks(prevTasks => prevTasks.filter(task => {
                    if (task.completed && task.completedAt) {
                        return (now - task.completedAt) < THIRTY_DAYS_IN_MS;
                    }
                    return true;
                }));
                localStorage.setItem(LAST_CLEANUP_STORAGE_KEY, now.toString());
            }

        } catch (error) {
            console.error("Failed to load data from local storage", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isLoading) {
            try {
                localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
                localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
            } catch (error) {
                console.error("Failed to save tasks to local storage", error);
            }
        }
    }, [tasks, stats, isLoading]);

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
            parentId,
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
        let wasJustCompleted = false;

        setTasks(prevTasks => {
            const tasksCopy = prevTasks.map(t => ({...t}));
            const task = tasksCopy.find(t => t.id === id);
            if (!task) return prevTasks;
    
            const newCompletedState = !task.completed;
            
            if (newCompletedState && !task.completed) {
                wasJustCompleted = true;
            }

            task.completed = newCompletedState;
            task.updatedAt = Date.now();
            if (newCompletedState) {
                task.completedAt = Date.now();
            } else {
                task.completedAt = undefined;
            }
    
            if (!task.parentId) {
                tasksCopy.forEach(child => {
                    if (child.parentId === id) {
                        child.completed = newCompletedState;
                        child.updatedAt = Date.now();
                        if (newCompletedState) child.completedAt = Date.now();
                        else child.completedAt = undefined;
                    }
                });
            } else {
                const parent = tasksCopy.find(p => p.id === task.parentId);
                if (parent) {
                    const siblings = tasksCopy.filter(s => s.parentId === parent.id);
                    const allSiblingsCompleted = siblings.every(s => s.completed);
                    
                    if (parent.completed !== allSiblingsCompleted) {
                       parent.completed = allSiblingsCompleted;
                       parent.updatedAt = Date.now();
                       if (allSiblingsCompleted) parent.completedAt = Date.now();
                       else parent.completedAt = undefined;
                    }
                }
            }

            if (wasJustCompleted) {
                 setStats(prevStats => ({
                    ...prevStats,
                    totalCompletedCount: prevStats.totalCompletedCount + 1,
                }));
            } else if (!newCompletedState) {
                // If a task is un-completed, decrement the count.
                // This is a simplification; a more complex system might prevent this.
                setStats(prevStats => ({
                    ...prevStats,
                    totalCompletedCount: Math.max(0, prevStats.totalCompletedCount - 1),
                }));
            }
    
            return tasksCopy;
        });
    }, []);

    const deleteTask = useCallback((id: string) => {
        setTasks(prevTasks => {
            const taskToDelete = prevTasks.find(t => t.id === id);
            if (!taskToDelete) return prevTasks;

            const idsToDelete = new Set([id]);
            const tasksToKeep = [];

            if (!taskToDelete.parentId) {
                 prevTasks.forEach(t => {
                    if (t.parentId === id) {
                        idsToDelete.add(t.id);
                    }
                });
            }

            let completedTasksDeletedCount = 0;
            for (const task of prevTasks) {
                if (idsToDelete.has(task.id)) {
                    if (task.completed) {
                        completedTasksDeletedCount++;
                    }
                } else {
                    tasksToKeep.push(task);
                }
            }

            if (completedTasksDeletedCount > 0) {
                 setStats(prevStats => ({
                    ...prevStats,
                    totalCompletedCount: Math.max(0, prevStats.totalCompletedCount - completedTasksDeletedCount)
                }));
            }

            return tasksToKeep;
        });
    }, []);


    const getTaskById = useCallback((id: string | null): Task | null => {
        if (!id) return null;
        return tasks.find(task => task.id === id) || null;
    }, [tasks]);

    return { tasks, stats, isLoading, addTask, updateTask, deleteTask, getTaskById, toggleTaskCompletion };
}
