
"use client"

import { useTaskContext } from './TaskProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { achievements, type Achievement } from '@/lib/achievements';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Check, Lock } from 'lucide-react';

const ACHIEVEMENTS_STORAGE_KEY = 'offline-task-manager-achievements';

function getEarnedAchievementIds(): string[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
        if (stored) return JSON.parse(stored);
    } catch (e) {
        console.error("Failed to parse achievements from localStorage", e);
    }
    return [];
}


export default function AchievementsPageContent() {
    const { tasks } = useTaskContext();
    const [earnedIds, setEarnedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        setEarnedIds(new Set(getEarnedAchievementIds()));
    }, [tasks]); 

    const earnedCount = earnedIds.size;
    const totalCount = achievements.length;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>خلاصه افتخارات</CardTitle>
                    <CardDescription>شما تاکنون {earnedCount} مدال از مجموع {totalCount} مدال ممکن را کسب کرده‌اید.</CardDescription>
                </CardHeader>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {achievements.map((achievement) => {
                    const isEarned = earnedIds.has(achievement.id);
                    return (
                        <TooltipProvider key={achievement.id} delayDuration={100}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Card className={cn(
                                        "flex flex-col items-center justify-center text-center p-4 aspect-square transition-all duration-300",
                                        isEarned ? "border-primary/50 bg-primary/10 shadow-lg" : "bg-muted/50"
                                    )}>
                                        <div className="relative">
                                            <achievement.icon className={cn(
                                                "h-16 w-16 mb-2",
                                                isEarned ? "text-primary" : "text-muted-foreground/50"
                                            )} />
                                            {isEarned && (
                                                <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-background">
                                                    <Check className="h-4 w-4 text-white" />
                                                </div>
                                            )}
                                             {!isEarned && (
                                                <div className="absolute -top-1 -right-1 bg-gray-400 rounded-full p-1 border-2 border-background">
                                                    <Lock className="h-4 w-4 text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <h3 className={cn(
                                            "font-semibold text-sm",
                                            isEarned ? "text-primary-foreground" : "text-muted-foreground"
                                        )}>{achievement.name}</h3>
                                    </Card>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="max-w-xs">{achievement.description}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    );
                })}
            </div>
        </div>
    );
}
