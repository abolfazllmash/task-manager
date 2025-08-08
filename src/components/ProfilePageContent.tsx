
"use client"

import { useTaskContext } from './TaskProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Button } from './ui/button';
import { Award, Medal, PieChart as PieChartIcon, User, Shield, Star, Swords, Zap } from 'lucide-react';
import { achievements } from '@/lib/achievements';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import type { TaskType } from '@/lib/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';

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

const COLORS: Record<TaskType, string> = {
    personal: '#3b82f6',
    work: '#ef4444',
    home: '#22c55e',
    study: '#f97316',
    club: '#8b5cf6',
    couple: '#ec4899',
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent * 100 < 5) return null;

    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

export default function ProfilePageContent() {
    const { tasks, stats } = useTaskContext();
    const [earnedIds, setEarnedIds] = useState<Set<string>>(new Set());
    
    useEffect(() => {
        setEarnedIds(new Set(getEarnedAchievementIds()));
    }, [tasks]); // It's okay for this to depend on tasks to re-check on new achievements

    const completedTasks = tasks.filter(t => t.completed);
    const completedTasksCount = stats.totalCompletedCount;
    const currentLevel = getUserLevel(completedTasksCount);
    
    const earnedCount = earnedIds.size;
    const totalCount = achievements.length;
    const lastThreeEarned = achievements.filter(a => earnedIds.has(a.id)).slice(-3);
    
    const taskTypeCounts = completedTasks.reduce((acc, task) => {
        acc[task.type] = (acc[task.type] || 0) + 1;
        return acc;
    }, {} as Record<TaskType, number>);

    const chartData = Object.entries(taskTypeCounts).map(([name, value]) => ({
        name: name as TaskType,
        value,
        fill: COLORS[name as TaskType],
    }));


    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-1 space-y-8">
                 <Card>
                    <CardHeader className="flex flex-row items-center gap-3">
                         <User className="h-8 w-8 text-primary" />
                        <CardTitle>اطلاعات کاربری</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">نام</Label>
                            <Input id="name" placeholder="نام خود را وارد کنید" />
                        </div>
                        <div className="space-y-2">
                            <Label>جنسیت</Label>
                            <RadioGroup defaultValue="none" className="flex gap-4 pt-2">
                                <div className="flex items-center space-x-2 space-x-reverse">
                                    <RadioGroupItem value="male" id="male" />
                                    <Label htmlFor="male">مرد</Label>
                                </div>
                                <div className="flex items-center space-x-2 space-x-reverse">
                                    <RadioGroupItem value="female" id="female" />
                                    <Label htmlFor="female">زن</Label>
                                </div>
                                <div className="flex items-center space-x-2 space-x-reverse">
                                    <RadioGroupItem value="none" id="none" />
                                    <Label htmlFor="none">نامشخص</Label>
                                </div>
                            </RadioGroup>
                        </div>
                         <Button className="w-full">ذخیره تغییرات</Button>
                    </CardContent>
                </Card>

            </div>
            <div className="md:col-span-2 space-y-8">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader className="items-center text-center">
                            <currentLevel.icon className="h-20 w-20 p-3 rounded-full bg-card shadow-lg text-primary" />
                            <CardTitle className="text-2xl pt-2">{currentLevel.name}</CardTitle>
                            <CardDescription>{completedTasksCount} وظیفه انجام شده</CardDescription>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader className="items-center text-center">
                            <Medal className="h-20 w-20 p-3 rounded-full bg-card shadow-lg text-primary" />
                            <CardTitle className="text-2xl pt-2">
                                {earnedCount} / {totalCount} مدال
                            </CardTitle>
                            <CardDescription>آخرین مدال‌های شما</CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center items-center gap-4">
                            {lastThreeEarned.map(ach => (
                                <div key={ach.id} className="flex flex-col items-center gap-1">
                                    <ach.icon className="h-8 w-8 text-primary/80" />
                                    <span className="text-xs text-muted-foreground">{ach.name}</span>
                                </div>
                            ))}
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/achievements">همه مدال‌ها</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <PieChartIcon className="h-6 w-6" />
                           تفکیک وظایف انجام شده
                        </CardTitle>
                        <CardDescription>نگاهی به حوزه‌هایی که روی آن‌ها تمرکز داشته‌اید.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {chartData.length > 0 ? (
                            <ChartContainer config={{}} className="mx-auto aspect-square h-[250px]">
                                <PieChart>
                                    <Tooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel />}
                                    />
                                    <Pie
                                        data={chartData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        labelLine={false}
                                        label={renderCustomizedLabel}
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                        ) : (
                            <div className="flex items-center justify-center h-[250px] text-muted-foreground">
                                هنوز وظیفه انجام شده‌ای برای نمایش وجود ندارد.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
