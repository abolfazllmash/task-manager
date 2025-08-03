"use client";
import { useState, useEffect, useCallback } from 'react';
import type { Note } from '@/lib/types';

const NOTES_STORAGE_KEY = 'offline-noter-notes';

export function useNotes() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const storedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
            if (storedNotes) {
                const parsedNotes: Note[] = JSON.parse(storedNotes);
                setNotes(parsedNotes.sort((a, b) => b.updatedAt - a.updatedAt));
            }
        } catch (error) {
            console.error("Failed to load notes from local storage", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isLoading) {
            try {
                localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
            } catch (error) {
                console.error("Failed to save notes to local storage", error);
            }
        }
    }, [notes, isLoading]);

    const addNote = useCallback(() => {
        const newNote: Note = {
            id: crypto.randomUUID(),
            title: "New Note",
            content: "",
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
        setNotes(prevNotes => [newNote, ...prevNotes]);
        return newNote;
    }, []);

    const updateNote = useCallback((id: string, title: string, content: string) => {
        setNotes(prevNotes =>
            prevNotes.map(note =>
                note.id === id ? { ...note, title, content, updatedAt: Date.now() } : note
            ).sort((a, b) => b.updatedAt - a.updatedAt)
        );
    }, []);

    const deleteNote = useCallback((id: string) => {
        setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    }, []);


    const getNoteById = useCallback((id: string | null): Note | null => {
        if (!id) return null;
        return notes.find(note => note.id === id) || null;
    }, [notes]);

    return { notes, isLoading, addNote, updateNote, deleteNote, getNoteById };
}
