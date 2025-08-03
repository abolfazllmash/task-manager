"use client";

import { useTaskContext } from '@/components/TaskProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Calendar as CalendarIcon, Plus, Trash2, CheckSquare, Square, Home, User, Briefcase, Heart, BookOpen } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Form, FormControl, FormField, FormItem } from './ui/form';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';
import { format as formatDate } from 'date-fns-jalali';
import { faIR } from 'date-fns/locale';
import type { Task, TaskType } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const taskTypeOptions: { value: TaskType, label: string, icon: React.FC<React.SVGProps<SVGSVGElement>>, animationClass: string }[] = [
    { value: 'personal', label: 'شخصی', icon: User, animationClass: 'animate-nod-head' },
    { value: 'home', label: 'خونه', icon: Home, animationClass: 'animate-gentle-rock' },
    { value: 'work', label: 'کاری', icon: Briefcase, animationClass: 'animate-wiggle-briefcase' },
    { value: 'couple', label: 'دوتایی', icon: Heart, animationClass: 'animate-pulse-heart' },
    { value: 'study', label: 'درسی', icon: BookOpen, animationClass: 'animate-page-turn' },
];

const taskSchema = z.object({
  title: z.string().min(1, "عنوان وظیفه نمی‌تواند خالی باشد").max(100, "عنوان بیش از حد طولانی است"),
  dueDate: z.date().optional(),
  dueTime: z.string().optional(),
  type: z.enum(['personal', 'home', 'work', 'couple', 'study']),
});

export default function TodoList() {
    const { tasks, addTask, deleteTask, toggleTaskCompletion, updateTask } = useTaskContext();
    const form = useForm<z.infer<typeof taskSchema>>({
        resolver: zodResolver(taskSchema),
        defaultValues: { title: "", type: 'personal' }
    });

    const handleAddTask = (data: z.infer<typeof taskSchema>) => {
        let finalDueDate: Date | undefined = data.dueDate;
        if (data.dueDate && data.dueTime) {
            const [hours, minutes] = data.dueTime.split(':').map(Number);
            finalDueDate = new Date(data.dueDate);
            finalDueDate.setHours(hours, minutes);
        }
        addTask(data.title, finalDueDate, data.type);
        form.reset({ title: "", type: 'personal', dueDate: undefined, dueTime: undefined});
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
                            <form onSubmit={form.handleSubmit(handleAddTask)} className="space-y-4">
                               <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input {...field} placeholder="مثلاً: خرید شیر" />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem className="w-full sm:w-40">
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="نوع وظیفه" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {taskTypeOptions.map(opt => (
                                                            <SelectItem key={opt.value} value={opt.value}>
                                                                <div className="flex items-center gap-2">
                                                                    <opt.icon className="h-4 w-4" />
                                                                    <span>{opt.label}</span>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="dueDate"
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={cn(
                                                                    "w-full justify-start text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                )}
                                                            >
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                {field.value ? (
                                                                    formatDate(field.value, 'PPP', { locale: faIR })
                                                                ) : (
                                                                    <span>انتخاب تاریخ</span>
                                                                )}
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
                                    <FormField
                                        control={form.control}
                                        name="dueTime"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input type="time" {...field} className="w-full sm:w-auto" />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <Button type="submit" className="w-full sm:w-auto hover:no-underline">افزودن</Button>
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

const typeColorMap: Record<TaskType, string> = {
    personal: 'bg-blue-500/10',
    home: 'bg-green-500/10',
    work: 'bg-yellow-500/10',
    couple: 'bg-red-500/10',
    study: 'bg-purple-500/10',
};


function TaskItem({ task, onToggle, onDelete, onUpdate }: { task: Task, onToggle: (id:string) => void, onDelete: (id:string) => void, onUpdate: (id:string, data: Partial<Omit<Task, 'id'>>) => void }) {
    const [isDatePickerOpen, setDatePickerOpen] = useState(false);
    const taskTypeInfo = taskTypeOptions.find(opt => opt.value === task.type) || { icon: Square, animationClass: '' };
    const TaskIcon = taskTypeInfo.icon;

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', hour12: false });
    };
    
    return (
        <div className={cn(
            "flex items-center gap-3 p-3 rounded-lg shadow-sm transition-all has-[:focus-within]:ring-2 has-[:focus-within]:ring-primary has-[:focus-within]:ring-offset-2 has-[:focus-within]:ring-offset-background",
            typeColorMap[task.type]
        )}>
            <button onClick={() => onToggle(task.id)} className="p-1.5 z-10">
                {task.completed ? <CheckSquare className="h-6 w-6 text-primary" /> : <Square className="h-6 w-6 text-muted-foreground" />}
            </button>
            <TaskIcon className={cn("h-5 w-5 text-muted-foreground", taskTypeInfo.animationClass)} />
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
                            "text-xs bg-card/50 hover:bg-card",
                            !task.dueDate && "text-muted-foreground"
                        )}
                    >
                         <CalendarIcon className="ml-1 h-4 w-4" />
                        {task.dueDate ? 
                            `${formatDate(new Date(task.dueDate), 'd MMMM', { locale: faIR })} - ${formatTime(new Date(task.dueDate))}`
                            : "بی تاریخ"}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                     <Calendar
                        mode="single"
                        selected={task.dueDate ? new Date(task.dueDate) : undefined}
                        onSelect={(date) => {
                           if (date) {
                               const currentTime = task.dueDate ? new Date(task.dueDate) : new Date();
                               date.setHours(currentTime.getHours(), currentTime.getMinutes());
                               onUpdate(task.id, { dueDate: date.toISOString() });
                           } else {
                               onUpdate(task.id, { dueDate: undefined });
                           }
                           setDatePickerOpen(false);
                        }}
                        locale={faIR}
                        initialFocus
                    />
                    <div className="p-2 border-t">
                        <input
                            type="time"
                            defaultValue={task.dueDate ? formatTime(new Date(task.dueDate)) : ''}
                            onChange={(e) => {
                                const newTime = e.target.value;
                                const [hours, minutes] = newTime.split(':').map(Number);
                                const newDate = task.dueDate ? new Date(task.dueDate) : new Date();
                                newDate.setHours(hours, minutes);
                                onUpdate(task.id, { dueDate: newDate.toISOString() });
                            }}
                            className="w-full bg-transparent p-1 border rounded-md"
                        />
                    </div>
                </PopoverContent>
            </Popover>

            <button onClick={() => onDelete(task.id)} className="p-1.5 text-destructive opacity-50 hover:opacity-100">
                <Trash2 className="h-5 w-5" />
            </button>
        </div>
    )
}
