
"use client"

import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import Link from 'next/link';
import { TaskProvider } from '@/components/TaskProvider';
import { Suspense } from 'react';
import AchievementsPageContent from '@/components/AchievementsPageContent';

export default function AchievementsPage() {
    return (
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">در حال بارگذاری...</div>}>
            <TaskProvider>
                <div className="flex flex-col items-center min-h-screen bg-background text-foreground p-4 sm:p-8">
                    <div className="w-full max-w-5xl">
                        <header className="flex flex-wrap gap-4 justify-between items-center mb-8">
                            <h1 className="text-3xl sm:text-4xl font-bold text-primary">گالری مدال‌ها و افتخارات</h1>
                            <Button asChild variant="outline">
                                <Link href="/">
                                    <Home className="ml-2 h-4 w-4" />
                                    بازگشت به صفحه اصلی
                                </Link>
                            </Button>
                        </header>
                        <main>
                           <AchievementsPageContent />
                        </main>
                    </div>
                </div>
            </TaskProvider>
        </Suspense>
    );
}
