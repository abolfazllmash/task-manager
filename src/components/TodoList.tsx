
"use client";

import { useTaskContext } from '@/components/TaskProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Calendar as CalendarIcon, Plus, Trash2, CheckSquare, Square, Home, User, Briefcase, Heart, BookOpen, Dumbbell, CornerDownLeft, GitMerge } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Form, FormControl, FormField, FormItem } from './ui/form';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useState, useMemo } from 'react';
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
    { value: 'club', label: 'باشگاه', icon: Dumbbell, animationClass: 'animate-lift-dumbbell' },
];

const taskSchema = z.object({
  title: z.string().min(1, "عنوان وظیفه نمی‌تواند خالی باشد").max(100, "عنوان بیش از حد طولانی است"),
  type: z.enum(['personal', 'home', 'work', 'couple', 'study', 'club']),
});


function AddTaskForm({ parentId }: { parentId?: string }) {
    const { addTask } = useTaskContext();
    const form = useForm<z.infer<typeof taskSchema>>({
        resolver: zodResolver(taskSchema),
        defaultValues: { title: "", type: 'personal' }
    });

    const handleAddTask = (data: z.infer<typeof taskSchema>) => {
        addTask(data.title, undefined, data.type, parentId);
        form.reset({ title: "", type: 'personal' });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddTask)} className="flex items-start gap-2">
                <CornerDownLeft className={cn("h-8 w-8 mt-1 text-muted-foreground", !parentId && "invisible")} />
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormControl>
                                <Input {...field} placeholder={parentId ? "افزودن زیرمجموعه..." : "افزودن وظیفه اصلی..."} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem className="w-32">
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="نوع" />
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
                <Button type="submit" size="icon" aria-label="Add task">
                    <Plus className="h-5 w-5" />
                </Button>
            </form>
        </Form>
    );
}

function TaskItem({ task, subTasks, onToggle, onDelete, onUpdate }: { task: Task, subTasks: Task[], onToggle: (id:string) => void, onDelete: (id:string) => void, onUpdate: (id:string, data: Partial<Omit<Task, 'id'>>) => void }) {
    const [isDatePickerOpen, setDatePickerOpen] = useState(false);
    const taskTypeInfo = taskTypeOptions.find(opt => opt.value === task.type) || { icon: Square, animationClass: '' };
    const TaskIcon = taskTypeInfo.icon;

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const handleTimeChange = (hour: string, minute: string) => {
        const newDate = task.dueDate ? new Date(task.dueDate) : new Date();
        newDate.setHours(parseInt(hour, 10), parseInt(minute, 10));
        onUpdate(task.id, { dueDate: newDate.toISOString() });
    };
    
    const taskDate = task.dueDate ? new Date(task.dueDate) : null;
    
    const allSubTasksCompleted = subTasks.length > 0 && subTasks.every(st => st.completed);

    return (
        <div className={cn(
            "flex flex-col p-3 rounded-lg shadow-sm transition-all has-[:focus-within]:ring-2 has-[:focus-within]:ring-primary has-[:focus-within]:ring-offset-2 has-[:focus-within]:ring-offset-background",
            task.completed ? 'bg-card' : 'bg-card'
        )}>
            <div className="flex items-center gap-3">
                 <button onClick={() => onToggle(task.id)} className="p-1.5 z-10">
                    {task.completed || allSubTasksCompleted ? <CheckSquare className="h-6 w-6 text-primary" /> : <Square className="h-6 w-6 text-muted-foreground" />}
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
                                "text-xs bg-card/50 hover:bg-card w-40 justify-start",
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
                        <div className="p-2 border-t flex gap-2">
                            <Input 
                                type="number"
                                placeholder="دقیقه"
                                min="0"
                                max="59"
                                step="30"
                                className="w-full"
                                defaultValue={taskDate?.getMinutes().toString().padStart(2, '0')}
                                onBlur={(e) => handleTimeChange(taskDate?.getHours().toString().padStart(2, '0') || '00', e.target.value)}
                            />
                            <Input 
                                type="number"
                                placeholder="ساعت"
                                min="0"
                                max="23"
                                className="w-full"
                                defaultValue={taskDate?.getHours().toString().padStart(2, '0')}
                                onBlur={(e) => handleTimeChange(e.target.value, taskDate?.getMinutes().toString().padStart(2, '0') || '00')}
                            />
                        </div>
                    </PopoverContent>
                </Popover>

                <button onClick={() => onDelete(task.id)} className="p-1.5 text-destructive opacity-50 hover:opacity-100">
                    <Trash2 className="h-5 w-5" />
                </button>
            </div>
            
             {subTasks.length > 0 && (
                <div className="pl-12 mt-2 space-y-2">
                    {subTasks.map(sub => (
                        <TaskItem key={sub.id} task={sub} subTasks={[]} onToggle={onToggle} onDelete={onDelete} onUpdate={onUpdate} />
                    ))}
                </div>
            )}
            
            {!task.completed && (
                <div className="pl-6 pt-2">
                    <AddTaskForm parentId={task.id} />
                </div>
            )}

        </div>
    )
}

export default function TodoList() {
    const { tasks, toggleTaskCompletion, deleteTask, updateTask } = useTaskContext();

    const { parentTasks, subTasksMap } = useMemo(() => {
        const parentTasks: Task[] = [];
        const subTasksMap = new Map<string, Task[]>();

        tasks.forEach(task => {
            if (task.parentId) {
                if (!subTasksMap.has(task.parentId)) {
                    subTasksMap.set(task.parentId, []);
                }
                subTasksMap.get(task.parentId)!.push(task);
            } else {
                parentTasks.push(task);
            }
        });
        
        parentTasks.sort((a,b) => b.createdAt - a.createdAt);
        subTasksMap.forEach(subTasks => subTasks.sort((a,b) => a.createdAt - b.createdAt));

        return { parentTasks, subTasksMap };
    }, [tasks]);

    const handleUpdateTask = (taskId: string, data: Partial<Omit<Task, 'id'>>) => {
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            updateTask(taskId, data);
        }
    };
    
    const uncompletedParentTasks = parentTasks.filter(task => !task.completed);
    const completedParentTasks = parentTasks.filter(task => task.completed);
    
    const renderTaskList = (tasksToRender: Task[]) => (
        <div className="space-y-3">
            {tasksToRender.map(task => (
                <TaskItem 
                    key={task.id} 
                    task={task} 
                    subTasks={subTasksMap.get(task.id) || []}
                    onToggle={toggleTaskCompletion} 
                    onDelete={deleteTask} 
                    onUpdate={handleUpdateTask} 
                />
            ))}
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="bg-card p-4 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold mb-3">افزودن وظیفه اصلی</h2>
                <AddTaskForm />
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <GitMerge />
                    <span>لیست وظایف</span>
                </h2>
                {uncompletedParentTasks.length > 0 ? (
                    renderTaskList(uncompletedParentTasks)
                ) : (
                    <p className="text-muted-foreground">هیچ وظیفه فعالی وجود ندارد.</p>
                )}
            </div>

            {completedParentTasks.length > 0 && (
                 <Accordion type="single" collapsible className="w-full bg-green-500/10 rounded-lg shadow-sm">
                    <AccordionItem value="item-1">
                         <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:no-underline">
                            <div className="flex items-center gap-3">
                                <span>انجام شده ({completedParentTasks.length})</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4 space-y-2">
                            {renderTaskList(completedParentTasks)}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            )}
        </div>
    );
}

    

    