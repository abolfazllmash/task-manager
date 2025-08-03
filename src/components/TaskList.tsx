"use client";

import { useTaskContext } from '@/components/TaskProvider';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
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
                <h1 className="text-xl font-bold font-headline">Task Manager</h1>
                <Button size="icon" variant="ghost" onClick={handleNewTask} aria-label="Create new task">
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
                                    "w-full text-left p-3 rounded-lg transition-colors relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring flex items-center gap-3",
                                    selectedTaskId === task.id ? "bg-primary/20" : "hover:bg-accent/50"
                                )}
                                onClick={() => router.push(`/?taskId=${task.id}`)}
                                role="button"
                                tabIndex={0}
                            >
                                <button onClick={(e) => handleToggle(e, task.id)} aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}>
                                    {task.completed ? <CheckSquare className="h-5 w-5 text-muted-foreground" /> : <Square className="h-5 w-5 text-muted-foreground" />}
                                </button>
                                <div className="flex-1 cursor-pointer">
                                    <h3 className={cn("font-semibold truncate pr-8", task.completed && "line-through text-muted-foreground")}>{task.title || "Untitled"}</h3>
                                    <p className={cn("text-sm text-muted-foreground truncate pr-8", task.completed && "line-through")}>{task.content || "No details"}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}
                                    </p>
                                </div>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-1/2 -translate-y-1/2 right-1 h-8 w-8 opacity-0 group-hover:opacity-100 focus:opacity-100"
                                        onClick={(e) => e.stopPropagation()}
                                        aria-label={`Delete task titled ${task.title}`}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the task titled "{task.title}".
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={(e) => handleDelete(e, task.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-4 text-center text-muted-foreground h-full flex flex-col items-center justify-center">
                        <p className="mb-2">No tasks yet.</p>
                        <Button variant="link" onClick={handleNewTask}>Create one now</Button>
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}
