"use client"
import { TaskProvider } from '@/components/TaskProvider';
import TaskList from '@/components/TaskList';
import TaskEditor from '@/components/TaskEditor';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function TasksPageContent() {
  const searchParams = useSearchParams();
  const taskId = searchParams.get('taskId');

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="py-8 px-4 border-b shadow-sm">
        <h1 className="text-3xl font-bold font-headline text-center text-foreground">مدیریت وظایف</h1>
      </header>
      
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden p-4 gap-4">
        <div className="w-full md:w-1/3 h-full">
          <TaskList selectedTaskId={taskId} />
        </div>
        <div className="w-full md:w-2/3 h-full">
          <TaskEditor key={taskId} selectedTaskId={taskId} />
        </div>
      </main>

      <footer className="py-6 px-4 border-t text-center text-muted-foreground">
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
