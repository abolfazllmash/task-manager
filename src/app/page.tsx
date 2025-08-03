"use client"
import { TaskProvider } from '@/components/TaskProvider';
import TaskList from '@/components/TaskList';
import TaskEditor from '@/components/TaskEditor';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

function TasksPageContent() {
  const searchParams = useSearchParams();
  const taskId = searchParams.get('taskId');

  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 border-b">
        <h1 className="text-2xl font-bold font-headline text-center">مدیریت وظایف</h1>
      </header>
      
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-[320px] lg:w-[360px] h-1/3 md:h-full border-l border-border/50 shrink-0">
          <TaskList selectedTaskId={taskId} />
        </div>
        <div className="w-full h-2/3 md:h-full flex-1">
          <TaskEditor key={taskId} selectedTaskId={taskId} />
        </div>
      </main>

      <footer className="p-4 border-t text-center text-muted-foreground">
        <p>© 2024 - ساخته شده با ❤️</p>
      </footer>
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
