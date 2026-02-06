'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { MessageSquareQuote, Send } from 'lucide-react';
import { Textarea } from './ui/textarea';

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

export function FeedbackDialog({
  open,
  onOpenChange,
  onClose,
}: FeedbackDialogProps) {
  const [feedback, setFeedback] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!feedback.trim()) {
      toast({
        variant: 'destructive',
        title: 'Feedback Empty',
        description: 'Please write your feedback before submitting.',
      });
      return;
    }

    const recipientEmail = 'louatimahdi390@gmail.com';
    const subject = encodeURIComponent('New Feedback for AI Insights Hub');
    const body = encodeURIComponent(feedback);

    window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;

    toast({
      title: 'Feedback Ready',
      description: "Your email client is opening to send the feedback.",
    });

    onClose();
    setFeedback('');
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] brutalist-card !shadow-[10px_10px_0_#000]">
        <DialogHeader className="brutalist-header">
          <div className="brutalist-icon">
            <MessageSquareQuote stroke="white" fill="white" />
          </div>
          <DialogTitle className="brutalist-title">Provide Feedback</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-black/80 -mt-4 mb-4">
          Your feedback is valuable to us. Let us know about your experience.
          Submitting will open your default email client.
        </DialogDescription>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us what you think..."
              className="border-2 border-black focus-visible:ring-accent min-h-[100px]"
            />
          </div>
          <DialogFooter className="flex-col sm:flex-col sm:space-x-0 gap-2">
            <Button
              type="submit"
              className="brutalist-button brutalist-button-accent w-full"
            >
              <Send className="mr-2 h-5 w-5" />
              Submit Feedback
            </Button>
            <Button
              type="button"
              onClick={onClose}
              className="brutalist-button bg-primary text-primary-foreground hover:bg-primary/90 w-full"
            >
              Skip
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
