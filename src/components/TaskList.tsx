"use client";

import { useTaskContext } from '@/components/TaskProvider';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { faIR } from 'date-fns/locale';
import { Plus, Trash2, CheckSquare, Square } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface TaskListProps {
    selectedTaskId: string | null;
}

export default function TaskList({ selectedTaskId }: TaskListProps) {
    const { tasks, isLoading, addTask, deleteTask, toggleTaskCompletion } = useTaskContext();
    const router = useRouter();

    const handleNewTask = () => {
        const newTask = addTask();
        router.push(`/?taskId=${newTask.id}`);
    };

    const handleDelete = (e: React.MouseEvent, taskId: string) => {
      e.stopPropagation();
      if (selectedTaskId === taskId) {
        router.push('/');
      }
      deleteTask(taskId);
    };

    const handleToggle = (e: React.MouseEvent, taskId: string) => {
        e.stopPropagation();
        toggleTaskCompletion(taskId);
    }

    return (
        <div className="flex flex-col h-full bg-card/50">
            <div className="p-4 flex justify-between items-center border-b">
                <h1 className="text-xl font-bold font-headline">لیست وظایف</h1>
                <Button size="icon" variant="ghost" onClick={handleNewTask} aria-label="ایجاد وظیفه جدید">
                    <Plus className="h-5 w-5" />
                </Button>
            </div>
            <ScrollArea className="flex-1">
                {isLoading ? (
                    <div className="p-4 space-y-2">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                ) : tasks.length > 0 ? (
                    <div className="p-2 space-y-1">
                        {tasks.map((task) => (
                            <div
                                key={task.id}
                                className={cn(
                                    "w-full text-right p-3 rounded-lg transition-colors relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring flex items-center gap-3",
                                    selectedTaskId === task.id ? "bg-primary/20" : "hover:bg-accent/50"
                                )}
                                onClick={() => router.push(`/?taskId=${task.id}`)}
                                role="button"
                                tabIndex={0}
                            >
                                <button onClick={(e) => handleToggle(e, task.id)} aria-label={task.completed ? 'علامت‌گذاری به عنوان انجام نشده' : 'علامت‌گذاری به عنوان انجام شده'}>
                                    {task.completed ? <CheckSquare className="h-5 w-5 text-muted-foreground" /> : <Square className="h-5 w-5 text-muted-foreground" />}
                                </button>
                                <div className="flex-1 cursor-pointer">
                                    <h3 className={cn("font-semibold truncate pr-8", task.completed && "line-through text-muted-foreground")}>{task.title || "بدون عنوان"}</h3>
                                    <p className={cn("text-sm text-muted-foreground truncate pr-8", task.completed && "line-through")}>{task.content || "بدون جزئیات"}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true, locale: faIR })}
                                    </p>
                                </div>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-1/2 -translate-y-1/2 left-1 h-8 w-8 opacity-0 group-hover:opacity-100 focus:opacity-100"
                                        onClick={(e) => e.stopPropagation()}
                                        aria-label={`حذف وظیفه با عنوان ${task.title}`}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>آیا کاملا مطمئن هستید؟</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        این عمل قابل بازگشت نیست. این کار برای همیشه وظیفه با عنوان "{task.title}" را حذف می‌کند.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>لغو</AlertDialogCancel>
                                      <AlertDialogAction onClick={(e) => handleDelete(e, task.id)} className="bg-destructive hover:bg-destructive/90">حذف</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-4 text-center text-muted-foreground h-full flex flex-col items-center justify-center">
                        <p className="mb-2">هنوز هیچ وظیفه‌ای وجود ندارد.</p>
                        <Button variant="link" onClick={handleNewTask}>یکی جدید بسازید</Button>
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}
