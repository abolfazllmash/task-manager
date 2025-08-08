
"use client"

import { useTaskContext } from './TaskProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Award, Shield, Star, Swords, Zap } from 'lucide-react';
import { Progress } from './ui/progress';

const levels = [
    { name: "تازه‌کار", icon: Award, threshold: 0 },
    { name: "راسخ", icon: Zap, threshold: 21 },
    { name: "نینجا", icon: Star, threshold: 51 },
    { name: "سامورایی", icon: Swords, threshold: 101 },
    { name: "شوالیه", icon: Shield, threshold: 221 },
];

function getUserLevel(completedTasks: number) {
    for (let i = levels.length - 1; i >= 0; i--) {
        if (completedTasks >= levels[i].threshold) {
            return levels[i];
        }
    }
    return levels[0];
}

export default function StatsPageContent() {
    const { stats } = useTaskContext();
    const completedTasksCount = stats.totalCompletedCount;
    const currentLevel = getUserLevel(completedTasksCount);
    const nextLevelIndex = levels.findIndex(l => l.name === currentLevel.name) + 1;
    const nextLevel = nextLevelIndex < levels.length ? levels[nextLevelIndex] : null;

    const progressToNextLevel = nextLevel
        ? ((completedTasksCount - currentLevel.threshold) / (nextLevel.threshold - currentLevel.threshold)) * 100
        : 100;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
                <Card>
                    <CardHeader className="items-center text-center">
                        <currentLevel.icon className="h-20 w-20 p-3 rounded-full bg-card shadow-lg text-primary" />
                        <CardTitle className="text-2xl pt-2">{currentLevel.name}</CardTitle>
                        <CardDescription>شما {completedTasksCount} وظیفه را با موفقیت انجام داده‌اید</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {nextLevel ? (
                            <div>
                                <div className="flex justify-between text-sm text-muted-foreground mb-1">
                                    <span>سطح فعلی: {currentLevel.name}</span>
                                    <span>سطح بعدی: {nextLevel.name}</span>
                                </div>
                                <Progress value={progressToNextLevel} />
                                <p className="text-center text-xs text-muted-foreground mt-2">
                                     {nextLevel.threshold - completedTasksCount} وظیفه تا سطح بعدی
                                </p>
                            </div>
                        ) : (
                             <p className="text-center font-semibold text-primary">شما به بالاترین سطح رسیده‌اید!</p>
                        )}
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>تمام سطوح</CardTitle>
                    <CardDescription>نقشه راه پیشرفت شما در کار و بار.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {levels.map(level => (
                            <li key={level.name} className="flex items-center justify-between p-3 rounded-lg bg-card-foreground/5">
                                <div className="flex items-center gap-3">
                                    <level.icon className="h-8 w-8 text-primary" />
                                    <span className="font-semibold text-lg">{level.name}</span>
                                </div>
                                <span className="text-sm font-bold text-muted-foreground">{level.threshold}+</span>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
