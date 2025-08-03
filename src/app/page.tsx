"use client"
import { NoteProvider } from '@/components/NoteProvider';
import NoteList from '@/components/NoteList';
import NoteEditor from '@/components/NoteEditor';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function NotesPageContent() {
  const searchParams = useSearchParams();
  const noteId = searchParams.get('noteId');

  return (
    <main className="flex h-screen w-full flex-col md:flex-row">
      <div className="w-full md:w-[320px] lg:w-[360px] h-1/3 md:h-full border-r border-border/50 shrink-0">
        <NoteList selectedNoteId={noteId} />
      </div>
      <div className="w-full h-2/3 md:h-full flex-1">
        <NoteEditor key={noteId} selectedNoteId={noteId} />
      </div>
    </main>
  );
}

export default function Home() {
    return (
      <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Loading Noter...</div>}>
        <NoteProvider>
            <NotesPageContent />
        </NoteProvider>
      </Suspense>
    );
}
