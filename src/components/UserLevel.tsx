
"use client";

import { Award, Shield, Star, Swords, Zap } from 'lucide-react';

interface UserLevelProps {
    completedTasks: number;
}

const levels = [
    { name: "تازه‌کار", icon: Award, threshold: 0, color: "text-gray-500" },
    { name: "راسخ", icon: Zap, threshold: 21, color: "text-blue-500" },
    { name: "نینجا", icon: Star, threshold: 51, color: "text-purple-500" },
    { name: "سامورایی", icon: Swords, threshold: 101, color: "text-red-500" },
    { name: "شوالیه", icon: Shield, threshold: 221, color: "text-yellow-500" },
];

function getUserLevel(completedTasks: number) {
    let currentLevel = levels[0];
    for (let i = levels.length - 1; i >= 0; i--) {
        if (completedTasks >= levels[i].threshold) {
            currentLevel = levels[i];
            break;
        }
    }
    return currentLevel;
}

export default function UserLevel({ completedTasks }: UserLevelProps) {
    const level = getUserLevel(completedTasks);
    const LevelIcon = level.icon;

    return (
        <div className="flex flex-col items-center gap-2 p-2">
            <LevelIcon className={`h-12 w-12 p-2 rounded-full bg-card shadow-sm ${level.color}`} />
            <div className="text-center">
                <p className="font-semibold text-sm">سطح شما</p>
                <p className="text-xs text-muted-foreground">{level.name}</p>
            </div>
        </div>
    );
}

