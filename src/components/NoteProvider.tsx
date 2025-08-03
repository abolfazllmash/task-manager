"use client";
import { createContext, useContext, ReactNode } from 'react';
import { useNotes } from '@/hooks/use-notes';
import type { Note } from '@/lib/types';

type NoteContextType = ReturnType<typeof useNotes>;

const NoteContext = createContext<NoteContextType | undefined>(undefined);

export function NoteProvider({ children }: { children: ReactNode }) {
    const notesData = useNotes();
    return (
        <NoteContext.Provider value={notesData}>
            {children}
        </NoteContext.Provider>
    );
}

export function useNoteContext() {
    const context = useContext(NoteContext);
    if (context === undefined) {
        throw new Error('useNoteContext must be used within a NoteProvider');
    }
    return context;
}
