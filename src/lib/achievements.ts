import type { Task, TaskType } from './types';
import {
    Footprints,
    CalendarCheck,
    Goal,
    TrendingUp,
    Crown,
    Gem,
    Dumbbell,
    Briefcase,
    Heart,
    BookOpen,
    User,
    Sunrise,
    Moon,
    Zap,
    Rocket
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: LucideIcon;
    check: (tasks: Task[]) => boolean;
}

const completedTasks = (tasks: Task[]) => tasks.filter(t => t.completed);

export const achievements: Achievement[] = [
    // --- Onboarding / First Steps ---
    {
        id: 'first-step',
        name: 'آغازگر',
        description: 'اولین وظیفه‌تان را با موفقیت انجام دادید.',
        icon: Footprints,
        check: (tasks) => completedTasks(tasks).length >= 1,
    },
    {
        id: 'planner',
        name: 'آینده‌نگر',
        description: 'یک وظیفه با تاریخ سررسید مشخص ایجاد کردید.',
        icon: CalendarCheck,
        check: (tasks) => tasks.some(t => !!t.dueDate),
    },
    {
        id: 'strategist',
        name: 'استراتژیست',
        description: 'یک وظیفه را به زیرمجموعه‌های کوچک‌تر تقسیم کردید.',
        icon: Goal,
        check: (tasks) => tasks.some(t => t.parentId) && tasks.some(t => !t.parentId && tasks.some(sub => sub.parentId === t.id)),
    },

    // --- Consistency / Habit Building ---
    {
        id: 'unstoppable-3',
        name: 'پایدار',
        description: 'در ۳ روز مختلف حداقل یک وظیفه را تکمیل کرده‌اید.',
        icon: TrendingUp,
        check: (tasks) => {
            const dates = new Set(completedTasks(tasks).map(t => new Date(t.updatedAt).toDateString()));
            return dates.size >= 3;
        }
    },
    {
        id: 'unstoppable-7',
        name: 'مصمم',
        description: 'در ۷ روز مختلف حداقل یک وظیفه را تکمیل کرده‌اید.',
        icon: Rocket,
        check: (tasks) => {
            const dates = new Set(completedTasks(tasks).map(t => new Date(t.updatedAt).toDateString()));
            return dates.size >= 7;
        }
    },

    // --- Mastery / Volume ---
    {
        id: 'task-crusher-10',
        name: 'وظیفه‌شکن',
        description: '۱۰ وظیفه را با موفقیت به پایان رساندید.',
        icon: Zap,
        check: (tasks) => completedTasks(tasks).length >= 10,
    },
    {
        id: 'task-champion-50',
        name: 'قهرمان وظایف',
        description: '۵۰ وظیفه را با موفقیت به پایان رساندید.',
        icon: Crown,
        check: (tasks) => completedTasks(tasks).length >= 50,
    },
    {
        id: 'task-legend-100',
        name: 'افسانه وظایف',
        description: '۱۰۰ وظیفه را با موفقیت به پایان رساندید!',
        icon: Gem,
        check: (tasks) => completedTasks(tasks).length >= 100,
    },
    
    // --- Specialization / Focus ---
    {
        id: 'work-whiz',
        name: 'نابغه کاری',
        description: '۱۰ وظیفه از نوع "کاری" را تکمیل کردید.',
        icon: Briefcase,
        check: (tasks) => completedTasks(tasks).filter(t => t.type === 'work').length >= 10,
    },
    {
        id: 'athlete',
        name: 'ورزشکار',
        description: '۱۰ وظیفه از نوع "باشگاه" را تکمیل کردید.',
        icon: Dumbbell,
        check: (tasks) => completedTasks(tasks).filter(t => t.type === 'club').length >= 10,
    },
    {
        id: 'scholar',
        name: 'دانشجو',
        description: '۱۰ وظیفه از نوع "درسی" را تکمیل کردید.',
        icon: BookOpen,
        check: (tasks) => completedTasks(tasks).filter(t => t.type === 'study').length >= 10,
    },
    {
        id: 'self-improver',
        name: 'خودساخته',
        description: '۱۰ وظیفه از نوع "شخصی" را تکمیل کردید.',
        icon: User,
        check: (tasks) => completedTasks(tasks).filter(t => t.type === 'personal').length >= 10,
    },
     {
        id: 'couple-goals',
        name: 'هم‌مسیر',
        description: '۱۰ وظیفه "دوتایی" را تکمیل کردید.',
        icon: Heart,
        check: (tasks) => completedTasks(tasks).filter(t => t.type === 'couple').length >= 10,
    },

    // --- Special Challenges ---
    {
        id: 'early-bird',
        name: 'سحرخیز',
        description: 'یک وظیفه را قبل از ساعت ۸ صبح تکمیل کردید.',
        icon: Sunrise,
        check: (tasks) => completedTasks(tasks).some(t => new Date(t.updatedAt).getHours() < 8),
    },
    {
        id: 'night-owl',
        name: 'شب‌زنده‌دار',
        description: 'یک وظیفه را بعد از ساعت ۱۰ شب تکمیل کردید.',
        icon: Moon,
        check: (tasks) => completedTasks(tasks).some(t => new Date(t.updatedAt).getHours() >= 22),
    },
];
