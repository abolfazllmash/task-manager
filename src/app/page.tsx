
"use client"
import { TaskProvider, useTaskContext } from '@/components/TaskProvider';
import TodoList from '@/components/TodoList';
import { Suspense, useState, useEffect } from 'react';
import ProgressCircle from '@/components/ProgressCircle';
import UserLevel from '@/components/UserLevel';
import Link from 'next/link';
import { Medal, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const quotes = [
  {
    text: "چه فکر کنید که می‌توانید، یا فکر کنید که نمی‌توانید - در هر دو صورت حق با شماست.",
    author: "هنری فورد",
    image: "هنری-فورد.png"
  },
  {
    text: "زندگی مانند دوچرخه سواری است. برای حفظ تعادل، باید به حرکت ادامه دهید.",
    author: "آلبرت انیشتین",
    image: "آلبرت-انیشتین.png"
  },
  {
    text: "بهترین راه برای شروع، دست از حرف زدن برداشتن و شروع به انجام دادن است.",
    author: "والت دیزنی",
    image: "والت-دیزنی.png"
  },
  {
    text: "همیشه تا زمانی که کاری انجام نشده، غیرممکن به نظر می‌رسد.",
    author: "نلسون ماندلا",
    image: "نلسون-ماندلا.png"
  },
  {
    text: "فرقی نمی‌کند چقدر آهسته حرکت می‌کنید، تا زمانی که متوقف نشوید.",
    author: "کنفسیوس",
    image: "کنفسیوس.png"
  },
  {
    text: "من در مسیرم بارها و بارها شکست خورده‌ام و به همین دلیل است که موفق می‌شوم.",
    author: "مایکل جردن",
    image: "مایکل-جردن.png"
  },
  {
    text: "کسانی که می‌گویند کاری نمی‌تواند انجام شود، نباید مزاحم کسانی شوند که در حال انجام آن هستند.",
    author: "جرج برنارد شاو",
    image: "جرج-برنارد-شاو.png"
  }
];

function RandomQuote() {
  const [quote, setQuote] = useState<(typeof quotes)[number] | null>(null);

  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  if (!quote) {
    return null;
  }

  return (
    <div className="mt-8 p-6 bg-card rounded-lg shadow-sm flex items-center gap-6">
       <div className="relative w-[100px] h-[100px] flex-shrink-0">
         <img 
            src={`/authors/${quote.image}`}
            alt={quote.author} 
            className="rounded-lg object-cover w-full h-full"
            data-ai-hint={quote.author.split(' ').join(' ').toLowerCase()}
         />
       </div>
      <blockquote className="border-r-4 border-primary pr-4">
        <p className="text-lg italic">"{quote.text}"</p>
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
      <header className="py-8 px-4">
        <div className="container mx-auto flex items-center justify-between">
            <div className="w-1/3 flex justify-start items-center gap-4">
                 <Link href="/stats" className="cursor-pointer flex flex-col items-center text-center gap-1">
                    <UserLevel completedTasks={completedTasks} />
                 </Link>
                  <Button asChild variant="ghost" size="icon" className="h-auto w-auto group flex-col">
                     <Link href="/achievements" className="flex flex-col items-center gap-1">
                        <div className="h-12 w-12 flex items-center justify-center">
                            <Medal className="h-10 w-10 text-primary group-hover:animate-pulse" />
                        </div>
                        <span className="text-xs text-muted-foreground">مدال‌ها</span>
                     </Link>
                  </Button>
                   <Link href="/progress" className="cursor-pointer flex flex-col items-center text-center gap-1">
                    <div className="flex flex-col items-center gap-2">
                        <ProgressCircle progress={progressPercentage} size={48} strokeWidth={4} />
                    </div>
                     <span className="text-xs text-muted-foreground">پیشرفت</span>
                  </Link>
            </div>
            
            <div className="w-1/3 text-center">
                <h1 className="text-5xl font-bold text-primary">کار و بار</h1>
                <p className="text-muted-foreground mt-2">مدیریت کارها و وظایف</p>
            </div>

            <div className="w-1/3 flex justify-end">
                <Button asChild variant="ghost" size="icon" className="h-auto w-auto group flex-col">
                     <Link href="/profile" className="flex flex-col items-center gap-1">
                        <div className="h-12 w-12 flex items-center justify-center">
                           <User className="h-8 w-8 text-primary group-hover:animate-pulse" />
                        </div>
                        <span className="text-xs text-muted-foreground">پروفایل</span>
                     </Link>
                </Button>
            </div>
        </div>
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
