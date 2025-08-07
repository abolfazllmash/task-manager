"use client";

import { useEffect, useRef } from 'react';
import type { Task } from '@/lib/types';
import { achievements, type Achievement } from '@/lib/achievements';
import { useToast } from './use-toast';
import { Award, Star } from 'lucide-react';

const ACHIEVEMENTS_STORAGE_KEY = 'offline-task-manager-achievements';

function getEarnedAchievements(): string[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    try {
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        }
    } catch (e) {
        console.error("Failed to parse achievements from localStorage", e);
    }
    return [];
}

function saveEarnedAchievements(earned: string[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(earned));
}

export function useAchievements(tasks: Task[]) {
    const { toast } = useToast();
    const prevTasksRef = useRef<Task[]>(tasks);
    
    useEffect(() => {
        const completedTasks = tasks.filter(t => t.completed);
        const prevCompletedTasks = prevTasksRef.current.filter(t => t.completed);

        if (completedTasks.length > prevCompletedTasks.length) {
            const earnedAchievementIds = getEarnedAchievements();
            const earnedAchievements = new Set(earnedAchievementIds);

            achievements.forEach(achievement => {
                if (!earnedAchievements.has(achievement.id) && achievement.check(tasks)) {
                    earnedAchievements.add(achievement.id);
                    toast({
                        title: (
                            <div className="flex items-center gap-2 font-bold">
                                <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                                <span>مدال جدید کسب شد!</span>
                            </div>
                        ),
                        description: (
                             <div className="flex items-center gap-3 pt-2">
                                <achievement.icon className="h-8 w-8 text-primary"/>
                                <div>
                                    <p className="font-semibold">{achievement.name}</p>
                                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                                </div>
                            </div>
                        )
                    });
                }
            });
            saveEarnedAchievements(Array.from(earnedAchievements));
        }

        prevTasksRef.current = tasks;
    }, [tasks, toast]);
}
