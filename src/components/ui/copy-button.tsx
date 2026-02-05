'use client';

import { useState } from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Clipboard, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface CopyButtonProps extends ButtonProps {
  content: string;
  copyMessage?: string;
}

export function CopyButton({
  content,
  copyMessage = 'Copied to clipboard!',
  className,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(content);
        setCopied(true);
        toast({
            title: 'Copied!',
            description: copyMessage,
        });
        setTimeout(() => {
        setCopied(false);
        }, 2000);
    }
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={handleCopy}
      className={cn('h-8 w-8', className)}
      aria-label="Copy content to clipboard"
      {...props}
    >
      {copied ? (
        <Check className="h-5 w-5 text-green-400" />
      ) : (
        <Clipboard className="h-5 w-5" />
      )}
    </Button>
  );
}
