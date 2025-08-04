
"use client"

import { useTaskContext } from './TaskProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Award, Shield, Star, Swords, Zap, Briefcase, Home, User, Heart, BookOpen, Dumbbell } from 'lucide-react';
import type { Task, TaskType } from '@/lib/types';
import { Progress } from './ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import React from 'react';

const levels = [
    { name: "تازه‌کار", icon: Award, threshold: 0, color: "text-gray-500" },
    { name: "راسخ", icon: Zap, threshold: 21, color: "text-blue-500" },
    { name: "نینجا", icon: Star, threshold: 51, color: "text-purple-500" },
    { name: "سامورایی", icon: Swords, threshold: 101, color: "text-red-500" },
    { name: "شوالیه", icon: Shield, threshold: 221, color: "text-yellow-500" },
];

function getUserLevel(completedTasks: number) {
    for (let i = levels.length - 1; i >= 0; i--) {
        if (completedTasks >= levels[i].threshold) {
            return levels[i];
        }
    }
    return levels[0];
}

const taskTypeDetails: Record<TaskType, { label: string, icon: React.FC<any>, color: string }> = {
    personal: { label: 'شخصی', icon: User, color: '#3b82f6' },
    home: { label: 'خونه', icon: Home, color: '#22c55e' },
    work: { label: 'کاری', icon: Briefcase, color: '#f59e0b' },
    couple: { label: 'دوتایی', icon: Heart, color: '#ef4444' },
    study: { label: 'درسی', icon: BookOpen, color: '#8b5cf6' },
    club: { label: 'باشگاه', icon: Dumbbell, color: '#f97316' },
};


const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, payload }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const Icon = taskTypeDetails[payload.name as TaskType]?.icon;

    return (
        <g>
            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="12">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
            {Icon && (
                 <foreignObject x={x - 10} y={y - 28} width="20" height="20">
                    <Icon className="text-white w-5 h-5" />
                </foreignObject>
            )}
        </g>
    );
};


export default function StatsPageContent() {
    const { tasks } = useTaskContext();
    const completedTasksCount = tasks.filter(task => task.completed).length;
    const currentLevel = getUserLevel(completedTasksCount);
    const nextLevelIndex = levels.findIndex(l => l.name === currentLevel.name) + 1;
    const nextLevel = nextLevelIndex < levels.length ? levels[nextLevelIndex] : null;

    const progressToNextLevel = nextLevel
        ? ((completedTasksCount - currentLevel.threshold) / (nextLevel.threshold - currentLevel.threshold)) * 100
        : 100;

    const taskTypeCounts = tasks.reduce((acc, task) => {
        if (task.completed) {
            acc[task.type] = (acc[task.type] || 0) + 1;
        }
        return acc;
    }, {} as Record<TaskType, number>);

    const chartData = Object.entries(taskTypeCounts).map(([key, value]) => ({
        name: key as TaskType,
        value,
        color: taskTypeDetails[key as TaskType]?.color || '#ccc'
    }));
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
                <Card>
                    <CardHeader className="items-center text-center">
                        <currentLevel.icon className={`h-20 w-20 p-3 rounded-full bg-card shadow-lg ${currentLevel.color}`} />
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
                 <Card>
                    <CardHeader>
                        <CardTitle>تمام سطوح</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {levels.map(level => (
                                <li key={level.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <level.icon className={`h-6 w-6 ${level.color}`} />
                                        <span className="font-semibold">{level.name}</span>
                                    </div>
                                    <span className="text-sm text-muted-foreground">{level.threshold}+ وظیفه</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
            <Card className="lg:col-span-2">
                 <CardHeader>
                    <CardTitle>تفکیک وظایف انجام شده</CardTitle>
                    <CardDescription>نمودار توزیع وظایف تکمیل‌شده بر اساس نوع.</CardDescription>
                </CardHeader>
                <CardContent>
                   {chartData.length > 0 ? (
                        <ChartContainer config={{}} className="mx-auto aspect-square h-[350px]">
                            <PieChart>
                                <Tooltip
                                    cursor={false}
                                    content={<ChartTooltipContent 
                                        formatter={(value, name) => (
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{backgroundColor: taskTypeDetails[name as TaskType].color}}></div>
                                                <span className="font-semibold">{taskTypeDetails[name as TaskType].label}:</span>
                                                <span>{value}</span>
                                            </div>
                                        )}
                                    />}
                                />
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={140}
                                    fill="#8884d8"
                                    labelLine={false}
                                    label={renderCustomizedLabel}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ChartContainer>
                   ) : (
                       <div className="flex items-center justify-center h-[350px] text-muted-foreground">
                            هنوز وظیفه انجام‌شده‌ای برای نمایش وجود ندارد.
                       </div>
                   )}
                </CardContent>
            </Card>
        </div>
    );
}
