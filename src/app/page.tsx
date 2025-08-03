"use client"
import { TaskProvider, useTaskContext } from '@/components/TaskProvider';
import TodoList from '@/components/TodoList';
import { Suspense, useState, useEffect } from 'react';
import { User } from 'lucide-react';
import ProgressCircle from '@/components/ProgressCircle';

const quotes = [
  {
    text: "چه فکر کنید که می‌توانید، یا فکر کنید که نمی‌توانید - در هر دو صورت حق با شماست.",
    author: "هنری فورد"
  },
  {
    text: "زندگی مانند دوچرخه سواری است. برای حفظ تعادل، باید به حرکت ادامه دهید.",
    author: "آلبرت انیشتین"
  },
  {
    text: "بهترین راه برای شروع، دست از حرف زدن برداشتن و شروع به انجام دادن است.",
    author: "والت دیزنی"
  },
  {
    text: "همیشه تا زمانی که کاری انجام نشده، غیرممکن به نظر می‌رسد.",
    author: "نلسون ماندلا"
  },
  {
    text: "فرقی نمی‌کند چقدر آهسته حرکت می‌کنید، تا زمانی که متوقف نشوید.",
    author: "کنفسیوس"
  },
  {
    text: "من در مسیرم بارها و بارها شکست خورده‌ام و به همین دلیل است که موفق می‌شوم.",
    author: "مایکل جردن"
  },
  {
    text: "کسانی که می‌گویند کاری نمی‌تواند انجام شود، نباید مزاحم کسانی شوند که در حال انجام آن هستند.",
    author: "جرج برنارد شاو"
  }
];

function RandomQuote() {
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(null);

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  if (!quote) {
    return null;
  }

  return (
    <div className="mt-8 p-6 bg-card rounded-lg shadow-sm flex items-center gap-6">
      <div className="w-[100px] h-[100px] bg-muted rounded-full flex-shrink-0" data-ai-hint="motivational figure">
        <img src="https://placehold.co/100x100.png" alt="Placeholder" className="rounded-full object-cover w-full h-full" />
      </div>
      <blockquote className="border-r-4 border-primary pr-4">
        <p className="text-lg italic">{quote.text}</p>
        <cite className="block text-right mt-2 not-italic text-muted-foreground">- {quote.author}</cite>
      </blockquote>
    </div>
  );
}


function TasksPageContent() {
  const { tasks } = useTaskContext();

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="py-8 px-4 text-center relative">
        <div className="absolute top-6 right-1/4 flex flex-col items-center gap-2 p-2">
            <ProgressCircle progress={progressPercentage} size={80} strokeWidth={6} />
            <div className="text-center">
                <p className="font-semibold text-sm">میزان پیشرفت</p>
                <p className="text-xs text-muted-foreground">{completedTasks} از {totalTasks} وظیفه</p>
            </div>
        </div>
        <div className="absolute top-4 left-4 p-4 flex items-center gap-2">
          <User className="h-8 w-8 text-muted-foreground" />
          <p className="font-semibold text-sm">سطح شما</p>
        </div>
        <h1 className="text-5xl font-bold text-primary">کار و بار</h1>
        <p className="text-muted-foreground mt-2">مدیریت کارها و وظایف</p>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <TodoList />
          <RandomQuote />
        </div>
      </main>
    </div>
  );
}

export default function Home() {
    return (
      <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">در حال بارگذاری مدیر وظایف...</div>}>
        <TaskProvider>
            <TasksPageContent />
        </TaskProvider>
      </Suspense>
    );
}
