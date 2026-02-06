'use client';

import { useActionState, useEffect, useRef } from 'react';
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
import { MessageSquareQuote, Send, Loader2 } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { sendFeedbackAction } from '@/app/actions';

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

const initialFeedbackState: {
  success: boolean;
  error: string | null;
} = {
  success: false,
  error: null,
};

export function FeedbackDialog({
  open,
  onOpenChange,
  onClose,
}: FeedbackDialogProps) {
  const { toast } = useToast();
  const [state, formAction, isPending] = useActionState(
    sendFeedbackAction,
    initialFeedbackState
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      toast({
        title: 'Feedback Sent!',
        description: 'Thank you for your valuable feedback.',
      });
      onClose();
      formRef.current?.reset();
    } else if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: state.error,
      });
    }
  }, [state, toast, onClose]);

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
        </DialogDescription>
        <form ref={formRef} action={formAction}>
          <div className="grid gap-4 py-4">
            <Textarea
              id="feedback"
              name="feedback"
              placeholder="Tell us what you think..."
              className="border-2 border-black focus-visible:ring-accent min-h-[100px]"
              disabled={isPending}
            />
          </div>
          <DialogFooter className="flex-col sm:flex-col sm:space-x-0 gap-2">
            <Button
              type="submit"
              className="brutalist-button brutalist-button-accent w-full"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Submit Feedback
                </>
              )}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              className="brutalist-button bg-primary text-primary-foreground hover:bg-primary/90 w-full"
              disabled={isPending}
            >
              Skip
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
