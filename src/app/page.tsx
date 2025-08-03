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
    <main className="flex h-screen w-full flex-col md:flex-row">
      <div className="w-full md:w-[320px] lg:w-[360px] h-1/3 md:h-full border-r border-border/50 shrink-0">
        <TaskList selectedTaskId={taskId} />
      </div>
      <div className="w-full h-2/3 md:h-full flex-1">
        <TaskEditor key={taskId} selectedTaskId={taskId} />
      </div>
    </main>
  );
}

export default function Home() {
    return (
      <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Loading Task Manager...</div>}>
        <TaskProvider>
            <TasksPageContent />
        </TaskProvider>
      </Suspense>
    );
}
