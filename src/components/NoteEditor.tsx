"use client";

import { useNoteContext } from "@/components/NoteProvider";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { Note } from "@/lib/types";
import { SummarizeDialog } from "./SummarizeDialog";
import { BookText } from "lucide-react";
import { useDebouncedCallback } from 'use-debounce';


interface NoteEditorProps {
    selectedNoteId: string | null;
}

const noteSchema = z.object({
    title: z.string().max(100),
    content: z.string().optional(),
});

export default function NoteEditor({ selectedNoteId }: NoteEditorProps) {
    const { getNoteById, updateNote } = useNoteContext();
    const [note, setNote] = useState<Note | null>(null);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof noteSchema>>({
        resolver: zodResolver(noteSchema),
        defaultValues: {
            title: "",
            content: "",
        },
    });

    const debouncedUpdate = useDebouncedCallback((noteToUpdate: Note, data: {title: string, content?: string}) => {
        if (noteToUpdate.title !== data.title || noteToUpdate.content !== data.content) {
            updateNote(noteToUpdate.id, data.title, data.content || "");
        }
    }, 500);

    useEffect(() => {
        const currentNote = getNoteById(selectedNoteId);
        setNote(currentNote);
        if (currentNote) {
            form.reset({
                title: currentNote.title,
                content: currentNote.content,
            });
        } else {
            form.reset({
                title: "",
                content: "",
            });
        }
    }, [selectedNoteId, getNoteById, form]);

    useEffect(() => {
        const subscription = form.watch((value) => {
            if (note && value.title !== undefined && value.content !== undefined) {
                debouncedUpdate(note, {title: value.title, content: value.content});
            }
        });
        return () => subscription.unsubscribe();
    }, [form.watch, note, debouncedUpdate]);

    const handleSummary = (summary: string) => {
        form.setValue("content", summary, { shouldDirty: true });
        if(note) {
          updateNote(note.id, form.getValues('title'), summary);
          toast({
              title: "Summary Applied",
              description: "The note content has been updated with the summary.",
          });
        }
    };

    if (!selectedNoteId) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground bg-background p-8">
                <BookText className="h-16 w-16 mb-4" />
                <h2 className="text-2xl font-semibold font-headline">Select a note to view</h2>
                <p>Or create a new one to get started!</p>
            </div>
        );
    }
    
    if (!note) {
        return (
             <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground bg-background p-8">
                <p>Loading note...</p>
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
                                            placeholder="Note Title"
                                            className="text-2xl font-bold border-none shadow-none focus-visible:ring-0 p-0 h-auto bg-transparent"
                                            aria-label="Note Title"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <SummarizeDialog
                            noteContent={form.watch("content") || ""}
                            onSummaryReady={handleSummary}
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
                                            placeholder="Start writing..."
                                            className="h-full min-h-[300px] w-full resize-none border-none shadow-none focus-visible:ring-0 text-base p-4 bg-transparent"
                                            aria-label="Note Content"
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
