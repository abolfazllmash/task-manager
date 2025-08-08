"use client";

import { useEffect, useRef } from 'react';
import type { Task, Stats } from '@/lib/types';
import { achievements } from '@/lib/achievements';
import { useToast } from './use-toast';
import { Star } from 'lucide-react';

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

export function useAchievements(tasks: Task[], stats: Stats) {
    const { toast } = useToast();
    const prevStatsRef = useRef<Stats>(stats);
    
    useEffect(() => {
        // We check for new achievements when the total completed count increases.
        if (stats.totalCompletedCount > prevStatsRef.current.totalCompletedCount) {
            const earnedAchievementIds = getEarnedAchievements();
            const earnedAchievements = new Set(earnedAchievementIds);
            let newAchievementEarned = false;

            achievements.forEach(achievement => {
                if (!earnedAchievements.has(achievement.id) && achievement.check(tasks, stats)) {
                    earnedAchievements.add(achievement.id);
                    newAchievementEarned = true;
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
            
            if (newAchievementEarned) {
                saveEarnedAchievements(Array.from(earnedAchievements));
            }
        }

        prevStatsRef.current = stats;
    }, [stats, tasks, toast]);
}
