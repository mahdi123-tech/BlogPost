'use client';

import { useActionState, useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Loader2,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { chatAction, type ChatMessage } from '@/app/actions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { CopyButton } from '@/components/ui/copy-button';
import { FeedbackDialog } from '@/components/FeedbackDialog';

const initialChatState: {
  messages: ChatMessage[];
  error: string | null;
} = {
  messages: [
    {
      role: 'model',
      content: 'Hello! How can I help you with this article?',
    },
  ],
  error: null,
};

export function ChatWidget({ articleContent }: { articleContent: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(
    chatAction,
    initialChatState
  );
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedback, setFeedback] = useState<Record<number, 'like' | 'dislike'>>(
    {}
  );

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Chat Error',
        description: state.error,
      });
    }
  }, [state.error, toast]);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [state.messages, isPending]);

  useEffect(() => {
    if (!isPending && formRef.current) {
      const input = formRef.current.querySelector(
        'input[name="userQuestion"]'
      ) as HTMLInputElement;
      if (input && input.value !== '') {
        formRef.current.reset();
      }
    }
  }, [isPending]);

  const handleOpenChange = (open: boolean) => {
    if (!open && state.messages.length > 1 && !showFeedbackDialog) {
      setShowFeedbackDialog(true);
    } else {
      setIsOpen(open);
    }
  };

  const handleFeedback = (index: number, sentiment: 'like' | 'dislike') => {
    setFeedback((prev) => ({ ...prev, [index]: sentiment }));
    toast({
      title: 'Feedback received!',
      description: 'Thanks for helping us improve.',
    });
  };

  const closeEverything = () => {
    setShowFeedbackDialog(false);
    setIsOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="brutalist-button brutalist-button-accent fixed bottom-8 right-8 z-50 !w-auto !p-4"
      >
        <MessageSquare className="h-6 w-6" />
        <span className="sr-only">Open Chat</span>
      </Button>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-lg brutalist-card !shadow-[10px_10px_0_#000] flex flex-col h-[80vh] max-h-[700px]">
          <DialogHeader className="brutalist-header">
            <div className="brutalist-icon">
              <Bot stroke="white" fill="white" />
            </div>
            <DialogTitle className="brutalist-title">
              Article Assistant
            </DialogTitle>
          </DialogHeader>
          <ScrollArea
            className="flex-1 -mx-6 px-6 py-4"
            viewportRef={viewportRef}
          >
            <div className="flex flex-col gap-4">
              {state.messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-start gap-3 group',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'model' && (
                    <div className="bg-black text-white rounded-full p-2 shrink-0">
                      <Bot className="h-5 w-5" />
                    </div>
                  )}
                  <div
                    className={cn(
                      'max-w-[80%] rounded-lg p-3',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground border border-black/10'
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                  {message.role === 'user' && (
                    <div className="bg-primary text-white rounded-full p-2 shrink-0">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                  {message.role === 'model' && (
                    <div className="flex items-center gap-1 self-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <CopyButton
                        content={message.content}
                        copyMessage="AI response copied to clipboard."
                        className="h-7 w-7"
                      />
                      {index > 0 && (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            disabled={!!feedback[index]}
                            onClick={() => handleFeedback(index, 'like')}
                          >
                            <ThumbsUp
                              className={cn(
                                'h-4 w-4',
                                feedback[index] === 'like' &&
                                  'text-primary fill-primary'
                              )}
                            />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            disabled={!!feedback[index]}
                            onClick={() => handleFeedback(index, 'dislike')}
                          >
                            <ThumbsDown
                              className={cn(
                                'h-4 w-4',
                                feedback[index] === 'dislike' && 'text-destructive'
                              )}
                            />
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {isPending && (
                <div className="flex items-start gap-3 justify-start">
                  <div className="bg-black text-white rounded-full p-2 shrink-0">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="max-w-[80%] rounded-lg p-3 bg-muted text-foreground border border-black/10 flex items-center">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          <form
            ref={formRef}
            action={formAction}
            className="flex items-center gap-2 pt-4 border-t-4 border-black"
          >
            <Input
              name="userQuestion"
              placeholder="Ask a question..."
              autoComplete="off"
              disabled={isPending}
              className="flex-1 border-2 border-black focus-visible:ring-accent"
            />
            <input type="hidden" name="articleContent" value={articleContent} />
            <input
              type="hidden"
              name="messages"
              value={JSON.stringify(state.messages)}
            />
            <Button
              type="submit"
              size="icon"
              className="h-10 w-10 shrink-0 border-2 border-black"
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <FeedbackDialog
        open={showFeedbackDialog}
        onOpenChange={setShowFeedbackDialog}
        onClose={closeEverything}
      />
    </>
  );
}
