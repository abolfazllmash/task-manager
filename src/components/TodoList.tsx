"use client";

import { useTaskContext } from '@/components/TaskProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Calendar as CalendarIcon, Plus, Trash2, CheckSquare, Square } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Form, FormControl, FormField, FormItem } from './ui/form';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';
import { format as formatDate } from 'date-fns-jalali';
import { faIR } from 'date-fns/locale';
import type { Task } from '@/lib/types';


const taskSchema = z.object({
  title: z.string().min(1, "عنوان وظیفه نمی‌تواند خالی باشد").max(100, "عنوان بیش از حد طولانی است"),
  dueDate: z.date().optional(),
});

export default function TodoList() {
    const { tasks, addTask, deleteTask, toggleTaskCompletion, updateTask } = useTaskContext();
    const form = useForm<z.infer<typeof taskSchema>>({
        resolver: zodResolver(taskSchema),
        defaultValues: { title: "" }
    });

    const handleAddTask = (data: z.infer<typeof taskSchema>) => {
        addTask(data.title, data.dueDate);
        form.reset();
        form.setValue('dueDate', undefined);
    };
    
    const uncompletedTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);

    const handleUpdateTask = (taskId: string, data: Partial<Omit<Task, 'id'>>) => {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            updateTask(taskId, data);
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
                            <form onSubmit={form.handleSubmit(handleAddTask)} className="flex flex-col sm:flex-row gap-2">
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
                                <FormField
                                    control={form.control}
                                    name="dueDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-[240px] pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                formatDate(field.value, 'PPP', { locale: faIR })
                                                            ) : (
                                                                <span>انتخاب تاریخ</span>
                                                            )}
                                                            <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        locale={faIR}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="hover:no-underline">افزودن</Button>
                            </form>
                        </Form>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            
            <div className="space-y-2">
                {uncompletedTasks.map(task => (
                    <TaskItem key={task.id} task={task} onToggle={toggleTaskCompletion} onDelete={deleteTask} onUpdate={handleUpdateTask} />
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
                                 <TaskItem key={task.id} task={task} onToggle={toggleTaskCompletion} onDelete={deleteTask} onUpdate={handleUpdateTask} />
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            )}
        </div>
    );
}

function TaskItem({ task, onToggle, onDelete, onUpdate }: { task: Task, onToggle: (id:string) => void, onDelete: (id:string) => void, onUpdate: (id:string, data: Partial<Omit<Task, 'id'>>) => void }) {
    const [isDatePickerOpen, setDatePickerOpen] = useState(false);
    return (
        <div className={cn("flex items-center gap-3 p-1.5 bg-card rounded-lg shadow-sm transition-all has-[:focus-within]:ring-2 has-[:focus-within]:ring-primary has-[:focus-within]:ring-offset-2 has-[:focus-within]:ring-offset-background")}>
            <button onClick={() => onToggle(task.id)} className="p-1.5">
                {task.completed ? <CheckSquare className="h-6 w-6 text-primary" /> : <Square className="h-6 w-6 text-muted-foreground" />}
            </button>
            <input 
                type="text"
                defaultValue={task.title}
                onBlur={(e) => onUpdate(task.id, { title: e.target.value })}
                onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }}
                className={cn(
                    "flex-1 bg-transparent focus:outline-none", 
                    task.completed && "line-through text-muted-foreground"
                )}
            />
            
            <Popover open={isDatePickerOpen} onOpenChange={setDatePickerOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        size="sm"
                        className={cn(
                            "text-xs",
                            !task.dueDate && "text-muted-foreground"
                        )}
                    >
                         <CalendarIcon className="ml-1 h-4 w-4" />
                        {task.dueDate ? formatDate(new Date(task.dueDate), 'd MMMM', { locale: faIR }) : "بی تاریخ"}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={task.dueDate ? new Date(task.dueDate) : undefined}
                        onSelect={(date) => {
                            onUpdate(task.id, { dueDate: date?.toISOString() });
                            setDatePickerOpen(false);
                        }}
                        locale={faIR}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>

            <button onClick={() => onDelete(task.id)} className="p-1.5 text-destructive opacity-50 hover:opacity-100">
                <Trash2 className="h-5 w-5" />
            </button>
        </div>
    )
}
