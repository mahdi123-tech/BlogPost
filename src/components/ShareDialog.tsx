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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Send } from 'lucide-react';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  articleTitle: string;
  articleContent: string;
}

export function ShareDialog({
  open,
  onOpenChange,
  articleTitle,
  articleContent,
}: ShareDialogProps) {
  const [recipientEmail, setRecipientEmail] = useState('');
  const { toast } = useToast();

  const handleShare = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail) {
      toast({
        variant: 'destructive',
        title: 'Email required',
        description: "Please enter a recipient's email address.",
      });
      return;
    }

    const subject = encodeURIComponent(articleTitle);
    const body = encodeURIComponent(
      `Check out this article: ${articleTitle}\n\n${window.location.href}\n\n---\n\n${articleContent}`
    );
    
    window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
    onOpenChange(false);
    setRecipientEmail('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] brutalist-card !shadow-[10px_10px_0_#000]">
        <DialogHeader className="brutalist-header">
          <div className="brutalist-icon">
            <Send stroke="white" fill="white" />
          </div>
          <DialogTitle className="brutalist-title">Share via Email</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-black/80 -mt-4 mb-4">
          Enter the recipient's email address to share this article.
        </DialogDescription>
        <form onSubmit={handleShare}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right text-lg font-bold">
                To:
              </Label>
              <Input
                id="email"
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="recipient@example.com"
                className="col-span-3 border-2 border-black focus-visible:ring-accent"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" className="brutalist-button brutalist-button-accent w-full">
              <Send className="mr-2 h-5 w-5" />
              Send Email
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
