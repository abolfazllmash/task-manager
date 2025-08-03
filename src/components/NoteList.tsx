"use client";

import { useNoteContext } from '@/components/NoteProvider';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Plus, Trash2 } from 'lucide-react';
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

interface NoteListProps {
    selectedNoteId: string | null;
}

export default function NoteList({ selectedNoteId }: NoteListProps) {
    const { notes, isLoading, addNote, deleteNote } = useNoteContext();
    const router = useRouter();

    const handleNewNote = () => {
        const newNote = addNote();
        router.push(`/?noteId=${newNote.id}`);
    };

    const handleDelete = (e: React.MouseEvent, noteId: string) => {
      e.stopPropagation();
      if (selectedNoteId === noteId) {
        router.push('/');
      }
      deleteNote(noteId);
    };

    return (
        <div className="flex flex-col h-full bg-card/50">
            <div className="p-4 flex justify-between items-center border-b">
                <h1 className="text-xl font-bold font-headline">Offline Noter</h1>
                <Button size="icon" variant="ghost" onClick={handleNewNote} aria-label="Create new note">
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
                ) : notes.length > 0 ? (
                    <div className="p-2 space-y-1">
                        {notes.map((note) => (
                            <button
                                key={note.id}
                                className={cn(
                                    "w-full text-left p-3 rounded-lg transition-colors relative group focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                    selectedNoteId === note.id ? "bg-primary/20" : "hover:bg-accent/50"
                                )}
                                onClick={() => router.push(`/?noteId=${note.id}`)}
                            >
                                <h3 className="font-semibold truncate pr-8">{note.title || "Untitled"}</h3>
                                <p className="text-sm text-muted-foreground truncate pr-8">{note.content || "No content"}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
                                </p>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-1/2 -translate-y-1/2 right-1 h-8 w-8 opacity-0 group-hover:opacity-100 focus:opacity-100"
                                        onClick={(e) => e.stopPropagation()}
                                        aria-label={`Delete note titled ${note.title}`}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the note titled "{note.title}".
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={(e) => handleDelete(e, note.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="p-4 text-center text-muted-foreground h-full flex flex-col items-center justify-center">
                        <p className="mb-2">No notes yet.</p>
                        <Button variant="link" onClick={handleNewNote}>Create one now</Button>
                    </div>
                )}
            </ScrollArea>
        </div>
    );
}
