"use client";

import { useTaskContext } from '@/components/TaskProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Plus, Trash2, CheckSquare, Square } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Form, FormControl, FormField, FormItem } from './ui/form';

const taskSchema = z.object({
  title: z.string().min(1, "عنوان وظیفه نمی‌تواند خالی باشد").max(100, "عنوان بیش از حد طولانی است"),
});

export default function TodoList() {
    const { tasks, addTask, deleteTask, toggleTaskCompletion, updateTask } = useTaskContext();
    const form = useForm({
        resolver: zodResolver(taskSchema),
        defaultValues: { title: "" }
    });

    const handleAddTask = (data: { title: string }) => {
        addTask(data.title);
        form.reset();
    };
    
    const uncompletedTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);

    const handleTitleChange = (taskId: string, newTitle: string) => {
        const task = tasks.find(t => t.id === taskId);
        if (task && newTitle) {
            updateTask(taskId, newTitle, task.content);
        }
    };

    return (
        <div className="space-y-4">
            <Accordion type="single" collapsible defaultValue="item-1" className="w-full bg-card rounded-lg shadow-sm">
                <AccordionItem value="item-1">
                    <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:no-underline">
                       <div className="flex items-center gap-3">
                         <Plus className="h-6 w-6" />
                         <span>افزودن وظیفه جدید</span>
                       </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleAddTask)} className="flex gap-2">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <Input {...field} placeholder="مثلاً: خرید شیر" />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">افزودن</Button>
                            </form>
                        </Form>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            
            <div className="space-y-2">
                {uncompletedTasks.map(task => (
                    <TaskItem key={task.id} task={task} onToggle={toggleTaskCompletion} onDelete={deleteTask} onTitleChange={handleTitleChange} />
                ))}
            </div>

            {completedTasks.length > 0 && (
                <Accordion type="single" collapsible className="w-full bg-card rounded-lg shadow-sm">
                    <AccordionItem value="item-1">
                         <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:no-underline">
                            <div className="flex items-center gap-3">
                                <span>انجام شده ({completedTasks.length})</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4 space-y-2">
                            {completedTasks.map(task => (
                                 <TaskItem key={task.id} task={task} onToggle={toggleTaskCompletion} onDelete={deleteTask} onTitleChange={handleTitleChange} />
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            )}
        </div>
    );
}

function TaskItem({ task, onToggle, onDelete, onTitleChange }: { task: any, onToggle: (id:string) => void, onDelete: (id:string) => void, onTitleChange: (id:string, title:string) => void }) {
    return (
        <div className={cn("flex items-center gap-3 p-1.5 bg-card rounded-lg shadow-sm transition-all has-[:focus]:ring-2 has-[:focus]:ring-primary has-[:focus]:ring-offset-2 has-[:focus]:ring-offset-background")}>
            <button onClick={() => onToggle(task.id)} className="p-1.5">
                {task.completed ? <CheckSquare className="h-6 w-6 text-primary" /> : <Square className="h-6 w-6 text-muted-foreground" />}
            </button>
            <input 
                type="text"
                defaultValue={task.title}
                onBlur={(e) => onTitleChange(task.id, e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
                className={cn(
                    "flex-1 bg-transparent focus:outline-none", 
                    task.completed && "line-through text-muted-foreground"
                )}
            />
            <button onClick={() => onDelete(task.id)} className="p-1.5 text-destructive opacity-50 hover:opacity-100">
                <Trash2 className="h-5 w-5" />
            </button>
        </div>
    )
}