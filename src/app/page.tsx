"use client"
import { TaskProvider } from '@/components/TaskProvider';
import TodoList from '@/components/TodoList';
import { Suspense } from 'react';
import { User } from 'lucide-react';

function TasksPageContent() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="py-12 px-4 text-center relative">
        <div className="absolute top-4 right-4">
            <User className="h-6 w-6 text-muted-foreground" />
        </div>
        <h1 className="text-5xl font-bold text-primary">کار و بار</h1>
        <p className="text-muted-foreground mt-2">مدیریت کارها و وظایف</p>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <TodoList />

          <div className="mt-8 p-6 bg-card rounded-lg shadow-sm flex items-center gap-6">
            <div className="w-[100px] h-[100px] bg-muted rounded-full flex-shrink-0" data-ai-hint="placeholder image">
              <img src="https://placehold.co/100x100.png" alt="Placeholder" className="rounded-full object-cover w-full h-full" />
            </div>
            <blockquote className="border-r-4 border-primary pr-4">
              <p className="text-lg italic">چه فکر کنید که می‌توانید، یا فکر کنید که نمی‌توانید - در هر دو صورت حق با شماست.</p>
              <cite className="block text-right mt-2 not-italic text-muted-foreground">- هنری فورد</cite>
            </blockquote>
          </div>

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
