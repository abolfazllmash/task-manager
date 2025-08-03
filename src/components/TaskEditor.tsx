"use client";

import { useTaskContext } from "@/components/TaskProvider";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Task } from "@/lib/types";
import { CheckSquare } from "lucide-react";
import { useDebouncedCallback } from 'use-debounce';

interface TaskEditorProps {
    selectedTaskId: string | null;
}

const taskSchema = z.object({
    title: z.string().max(100),
    content: z.string().optional(),
});

export default function TaskEditor({ selectedTaskId }: TaskEditorProps) {
    const { getTaskById, updateTask } = useTaskContext();
    const [task, setTask] = useState<Task | null>(null);

    const form = useForm<z.infer<typeof taskSchema>>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: "",
            content: "",
        },
    });

    const debouncedUpdate = useDebouncedCallback((taskToUpdate: Task, data: {title: string, content?: string}) => {
        if (taskToUpdate.title !== data.title || taskToUpdate.content !== data.content) {
            updateTask(taskToUpdate.id, data.title, data.content || "");
        }
    }, 500);

    useEffect(() => {
        const currentTask = getTaskById(selectedTaskId);
        setTask(currentTask);
        if (currentTask) {
            form.reset({
                title: currentTask.title,
                content: currentTask.content,
            });
        } else {
            form.reset({
                title: "",
                content: "",
            });
        }
    }, [selectedTaskId, getTaskById, form]);

    useEffect(() => {
        const subscription = form.watch((value) => {
            if (task && value.title !== undefined && value.content !== undefined) {
                debouncedUpdate(task, {title: value.title, content: value.content});
            }
        });
        return () => subscription.unsubscribe();
    }, [form.watch, task, debouncedUpdate]);

    if (!selectedTaskId) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground bg-background p-8">
                <CheckSquare className="h-16 w-16 mb-4" />
                <h2 className="text-2xl font-semibold font-headline">یک وظیفه را برای مشاهده انتخاب کنید</h2>
                <p>یا برای شروع یک وظیفه جدید ایجاد کنید!</p>
            </div>
        );
    }
    
    if (!task) {
        return (
             <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground bg-background p-8">
                <p>در حال بارگذاری وظیفه...</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full bg-background">
            <Form {...form}>
                <form className="flex flex-col h-full" onSubmit={(e) => e.preventDefault()}>
                    <div className="p-4 border-b flex items-center justify-between gap-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="عنوان وظیفه"
                                            className="text-2xl font-bold border-none shadow-none focus-visible:ring-0 p-0 h-auto bg-transparent"
                                            aria-label="عنوان وظیفه"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem className="h-full">
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="جزئیات وظیفه را اضافه کنید..."
                                            className="h-full min-h-[300px] w-full resize-none border-none shadow-none focus-visible:ring-0 text-base p-4 bg-transparent"
                                            aria-label="جزئیات وظیفه"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </form>
            </Form>
        </div>
    );
}
