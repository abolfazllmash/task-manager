
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import Link from 'next/link';

export default function ProgressPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-8">
            <div className="w-full max-w-4xl">
                <header className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-primary">تحلیل پیشرفت</h1>
                     <Button asChild variant="outline">
                        <Link href="/">
                            <Home className="ml-2 h-4 w-4" />
                            بازگشت به صفحه اصلی
                        </Link>
                    </Button>
                </header>
                <main className="bg-card p-8 rounded-lg shadow-sm">
                    <p>اینجا جزئیات و تحلیل پیشرفت شما نمایش داده خواهد شد.</p>
                </main>
            </div>
        </div>
    );
}
