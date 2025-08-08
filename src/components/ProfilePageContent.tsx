
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useTaskContext } from './TaskProvider';
import { achievements } from '@/lib/achievements';
import { Award, Shield, Star, Swords, Zap, Medal } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const ACHIEVEMENTS_STORAGE_KEY = 'offline-task-manager-achievements';

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


export default function ProfilePageContent() {
    const { toast } = useToast();
    const { tasks } = useTaskContext();
    const [earnedIds, setEarnedIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        setEarnedIds(new Set(getEarnedAchievementIds()));
    }, [tasks]);

    const completedTasksCount = tasks.filter(task => task.completed).length;
    const currentLevel = getUserLevel(completedTasksCount);
    const LevelIcon = currentLevel.icon;
    
    const earnedCount = earnedIds.size;
    const totalCount = achievements.length;
    const recentEarnedAchievements = achievements
        .filter(ach => earnedIds.has(ach.id))
        .slice(-4);


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        toast({
            title: "پروفایل ذخیره شد",
            description: "اطلاعات شما (به صورت نمایشی) ذخیره شد.",
        });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle>اطلاعات کاربری</CardTitle>
                        <CardDescription>این اطلاعات برای شخصی‌سازی تجربه شما استفاده خواهد شد.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">نام</Label>
                                <Input id="name" placeholder="نام خود را وارد کنید" />
                            </div>

                            <div className="space-y-2">
                                <Label>جنسیت</Label>
                                <RadioGroup defaultValue="not-specified" className="flex items-center gap-4 pt-2">
                                    <div className="flex items-center space-x-2 space-x-reverse">
                                        <RadioGroupItem value="male" id="male" />
                                        <Label htmlFor="male">مرد</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 space-x-reverse">
                                        <RadioGroupItem value="female" id="female" />
                                        <Label htmlFor="female">زن</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 space-x-reverse">
                                        <RadioGroupItem value="not-specified" id="not-specified" />
                                        <Label htmlFor="not-specified">ترجیح می‌دهم نگویم</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            
                            <Button type="submit" className="w-full">ذخیره تغییرات</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
            
            <div className="md:col-span-1 space-y-8">
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LevelIcon className="h-6 w-6 text-primary" />
                            <span>سطح شما</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{currentLevel.name}</p>
                        <p className="text-muted-foreground text-sm">با انجام {completedTasksCount} وظیفه</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                         <CardTitle className="flex items-center gap-2">
                            <Medal className="h-6 w-6 text-primary" />
                            <span>مدال‌ها</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{earnedCount} / {totalCount}</p>
                        <p className="text-muted-foreground text-sm">مدال کسب کرده‌اید</p>
                        <div className="flex items-center space-x-2 space-x-reverse mt-4">
                            {recentEarnedAchievements.map(ach => (
                                <ach.icon key={ach.id} className="h-8 w-8 text-yellow-400" />
                            ))}
                        </div>
                         <Button asChild variant="outline" size="sm" className="mt-4 w-full">
                            <Link href="/achievements">
                                مشاهده همه مدال‌ها
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
