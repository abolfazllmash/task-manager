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
    Rocket,
    Home
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
    // --- User's custom list ---
    {
        id: 'willpower',
        name: 'اراده',
        description: 'اولین وظیفه‌تان را با موفقیت انجام دادید.',
        icon: Footprints,
        check: (tasks) => completedTasks(tasks).length >= 1,
    },
    {
        id: 'consistency',
        name: 'ثبات',
        description: 'در ۳ روز مختلف حداقل یک وظیفه را تکمیل کرده‌اید.',
        icon: TrendingUp,
        check: (tasks) => {
            const dates = new Set(completedTasks(tasks).map(t => new Date(t.updatedAt).toDateString()));
            return dates.size >= 3;
        }
    },
    {
        id: 'home-person',
        name: 'اهل خونه و زندگی',
        description: '۱۰ وظیفه "خونه" را با موفقیت انجام دادید.',
        icon: Home,
        check: (tasks) => completedTasks(tasks).filter(t => t.type === 'home').length >= 10,
    },
    {
        id: 'gym-buddy',
        name: 'رفیق باشگاه',
        description: '۱۰ وظیفه "باشگاه" را تکمیل کردید.',
        icon: Dumbbell,
        check: (tasks) => completedTasks(tasks).filter(t => t.type === 'club').length >= 10,
    },
    {
        id: 'constant-companion',
        name: 'یار همیشگی',
        description: 'اولین وظیفه "دوتایی" خود را انجام دادید.',
        icon: Heart,
        check: (tasks) => completedTasks(tasks).filter(t => t.type === 'couple').length >= 1,
    },
    {
        id: 'saturday-morning',
        name: 'صبح شنبه',
        description: 'اولین وظیفه "کاری" خود را با موفقیت انجام دادید.',
        icon: Sunrise,
        check: (tasks) => completedTasks(tasks).filter(t => t.type === 'work').length >= 1,
    },
    {
        id: 'top-student',
        name: 'شاگرد اول',
        description: '۳ وظیفه "درسی" را تکمیل کردید.',
        icon: User,
        check: (tasks) => completedTasks(tasks).filter(t => t.type === 'study').length >= 3,
    },
    {
        id: 'tesla',
        name: 'تسلا',
        description: '۱۰ وظیفه "درسی" را تکمیل کردید.',
        icon: Rocket,
        check: (tasks) => completedTasks(tasks).filter(t => t.type === 'study').length >= 10,
    },
    {
        id: 'engagement',
        name: 'نامزدی',
        description: 'دهمین وظیفه "دوتایی" را به پایان رساندید.',
        icon: Gem,
        check: (tasks) => completedTasks(tasks).filter(t => t.type === 'couple').length >= 10,
    },
    {
        id: 'ronnie-coleman',
        name: 'رونی کولمن',
        description: '۱۵ وظیفه "باشگاه" را تکمیل کردید.',
        icon: Crown,
        check: (tasks) => completedTasks(tasks).filter(t => t.type === 'club').length >= 15,
    },
    {
        id: 'elon-musk',
        name: 'ایلان ماسک',
        description: '۱۰ وظیفه "کاری" را تکمیل کردید.',
        icon: Briefcase,
        check: (tasks) => completedTasks(tasks).filter(t => t.type === 'work').length >= 10,
    },
     {
        id: 'strategist',
        name: 'استراتژیست',
        description: 'یک وظیفه را به زیرمجموعه‌های کوچک‌تر تقسیم کردید.',
        icon: Goal,
        check: (tasks) => tasks.some(t => t.parentId) && tasks.some(t => !t.parentId && tasks.some(sub => sub.parentId === t.id)),
    },
    {
        id: 'night-owl',
        name: 'شب‌زنده‌دار',
        description: 'یک وظیفه را بعد از ساعت ۱۰ شب تکمیل کردید.',
        icon: Moon,
        check: (tasks) => completedTasks(tasks).some(t => new Date(t.updatedAt).getHours() >= 22),
    },
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
];
