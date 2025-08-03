"use client";
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from 'lucide-react';
import { summarizeNote } from '@/ai/flows/summarize-note';
import { useToast } from "@/hooks/use-toast";

interface SummarizeDialogProps {
  noteContent: string;
  onSummaryReady: (summary: string) => void;
}

export function SummarizeDialog({ noteContent, onSummaryReady }: SummarizeDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSummarize = async () => {
        if (!prompt.trim()) {
            toast({
                title: "Prompt is required",
                description: "Please tell the AI how to summarize your note.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            const result = await summarizeNote({
                noteContent,
                userPrompt: prompt,
            });
            onSummaryReady(result.summary);
            setIsOpen(false);
            setPrompt("");
        } catch (error) {
            console.error("Summarization failed", error);
            toast({
                title: "Summarization Error",
                description: "Failed to summarize the note. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" disabled={!noteContent.trim()}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Summarize
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Summarize Note with AI</DialogTitle>
                    <DialogDescription>
                        Tell the AI how you'd like to summarize this note. For example: "summarize in 3 bullet points" or "extract key takeaways".
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 items-center gap-2">
                        <Label htmlFor="prompt" className="text-left">
                            Your prompt
                        </Label>
                        <Textarea
                            id="prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., Turn this into a haiku"
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="ghost">Cancel</Button>
                    </DialogClose>
                    <Button type="button" onClick={handleSummarize} disabled={isLoading}>
                        {isLoading ? "Thinking..." : "Generate Summary"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
