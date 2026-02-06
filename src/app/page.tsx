'use client';

import { useFormStatus } from 'react-dom';
import { useEffect, useActionState, useState, useRef } from 'react';
import { getSummaryAction } from './actions';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Loader2,
  BrainCircuit,
  Lightbulb,
  Clipboard,
  Check,
  Share2,
  Maximize,
  Minimize,
  ChevronDown,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ShareDialog } from '@/components/ShareDialog';
import { ChatWidget } from '@/components/ChatWidget';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const articlePart1 = `
<h2>The Dawn of a New Era</h2>
<p>Machine Learning (ML) and Artificial Intelligence (AI) are no longer concepts confined to science fiction. They are rapidly becoming integral parts of our daily lives, powering everything from recommendation engines on our favorite streaming services to complex medical diagnoses. This post will give you a no-nonsense, brutalist overview of what's what in the world of modern AI.</p>

<p>At its core, AI is about creating systems that can perform tasks that typically require human intelligence. Machine Learning is a subset of AI that focuses on building algorithms that allow computers to learn from data without being explicitly programmed.</p>

<h3>Core Concepts: Learning Types</h3>
<p>ML models learn in several ways, but the most common are:</p>
<ul>
  <li><strong>Supervised Learning:</strong> You provide the model with labeled data. Think of it as learning with a teacher. For example, feeding it thousands of cat pictures labeled "cat" to teach it to recognize cats.</li>
  <li><strong>Unsupervised Learning:</strong> The model works with unlabeled data to find patterns on its own. It's like being thrown into a library and told to "find interesting books" without any genre labels.</li>
  <li><strong>Reinforcement Learning:</strong> The model learns by trial and error, receiving rewards or penalties for its actions. This is how AI learns to play games like Chess or Go at a superhuman level.</li>
</ul>

<h3>A Glimpse into Code</h3>
<p>Let's look at a very simple example of a supervised learning model using Python's popular <code>scikit-learn</code> library. Here, we'll train a model to classify iris flowers.</p>
`;

const codeSnippet = `
# Import necessary libraries
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

# Load the dataset
iris = load_iris()
X, y = iris.data, iris.target

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Create and train the model
model = KNeighborsClassifier(n_neighbors=3)
model.fit(X_train, y_train)

# Make predictions
predictions = model.predict(X_test)

# Check accuracy
accuracy = accuracy_score(y_test, predictions)
print(f"Model Accuracy: {accuracy:.2f}")
`;

const articlePart2 = `
<h3>The Future is Generative</h3>
<p>The latest revolution is Generative AI. These are models, like Large Language Models (LLMs), that can create new content—text, images, music, and code. They are trained on vast amounts of data and learn the underlying patterns to a degree that they can generate novel, coherent, and often surprising outputs. This technology is what powers tools like ChatGPT and is fundamentally changing how we interact with information and create content.</p>
`;

const articleTitle = "The Brutalist's Guide to Modern AI";
const textForSummary =
  articlePart1.replace(/<[^>]*>?/gm, '') +
  articlePart2.replace(/<[^>]*>?/gm, '') +
  codeSnippet;

const initialState: {
  summary: string | null;
  error: string | null;
} = {
  summary: null,
  error: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      aria-disabled={pending}
      className="brutalist-button brutalist-button-accent w-full"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          Summarizing...
        </>
      ) : (
        'Summarize with AI'
      )}
    </Button>
  );
}

function CodeSnippet({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="relative">
      <pre>
        <code>{code.trim()}</code>
      </pre>
      <Button
        size="icon"
        variant="ghost"
        onClick={handleCopy}
        className="absolute top-2 right-2 h-8 w-8 bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
        aria-label="Copy code to clipboard"
      >
        {copied ? (
          <Check className="h-5 w-5 text-green-400" />
        ) : (
          <Clipboard className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
}

export default function Home() {
  const [state, formAction] = useActionState(getSummaryAction, initialState);
  const { toast } = useToast();
  const [isShareDialogOpen, setShareDialogOpen] = useState(false);
  const articleRef = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showScroll, setShowScroll] = useState(true);

  const articleImage = PlaceHolderImages.find(
    (img) => img.id === 'ai-ml-abstract'
  );

  const handleFullScreenToggle = () => {
    if (!articleRef.current) return;

    if (!document.fullscreenElement) {
      articleRef.current.requestFullscreen().catch((err) => {
        alert(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  useEffect(() => {
    if (state?.error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: state.error,
      });
    }
  }, [state, toast]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowScroll(false);
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <main className="min-h-screen bg-background text-foreground font-body flex flex-col items-center p-4 sm:p-8">
        <div className="w-full max-w-4xl">
          <div className="brutalist-card" ref={articleRef}>
            <header className="brutalist-header justify-between items-start sm:items-center">
              <div className="flex items-center gap-4">
                <div className="brutalist-icon">
                  <BrainCircuit stroke="white" fill="white" />
                </div>
                <h1 className="brutalist-title">{articleTitle}</h1>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <ThemeToggle />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleFullScreenToggle}
                  className="brutalist-button !w-auto !h-auto !p-3 !bg-white !border-2 !shadow-[4px_4px_0_#000] hover:!shadow-[6px_6px_0_#000] active:!shadow-none"
                  aria-label="Toggle fullscreen"
                >
                  <span className="sr-only">Toggle Fullscreen</span>
                  {isFullScreen ? (
                    <Minimize className="h-6 w-6 text-black" />
                  ) : (
                    <Maximize className="h-6 w-6 text-black" />
                  )}
                </Button>
              </div>
            </header>

            {articleImage && (
              <div className="relative w-full h-48 sm:h-80 border-4 border-black my-6 shadow-[8px_8px_0_#000]">
                <Image
                  src={articleImage.imageUrl}
                  alt={articleImage.description}
                  fill
                  className="object-cover"
                  data-ai-hint={articleImage.imageHint}
                />
                {showScroll && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-black/50 animate-bounce">
                      <ChevronDown className="h-8 w-8 text-white" />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="brutalist-content">
              <div dangerouslySetInnerHTML={{ __html: articlePart1 }} />
              <CodeSnippet code={codeSnippet} />
              <div dangerouslySetInnerHTML={{ __html: articlePart2 }} />
            </div>

            <footer className="mt-6 pt-6 border-t-4 border-black">
              <div className="flex flex-col sm:flex-row gap-4">
                <form action={formAction} className="flex-1">
                  <input
                    type="hidden"
                    name="articleContent"
                    value={textForSummary}
                  />
                  <SubmitButton />
                </form>
                <Button
                  onClick={() => setShareDialogOpen(true)}
                  className="brutalist-button bg-primary text-primary-foreground hover:bg-primary/90 flex-1"
                >
                  <Share2 className="mr-2 h-6 w-6" />
                  Share Article
                </Button>
              </div>
            </footer>
          </div>

          {state?.summary && (
            <div className="brutalist-card mt-12" role="alert">
              <header className="brutalist-header">
                <div className="brutalist-icon">
                  <Lightbulb stroke="white" fill="white" />
                </div>
                <h2 className="brutalist-title">AI Summary</h2>
              </header>
              <p className="brutalist-content text-lg">{state.summary}</p>
            </div>
          )}

          <div className="brutalist-card mt-12">
            <header className="brutalist-header">
              <div className="brutalist-icon">
                <HelpCircle stroke="white" fill="white" />
              </div>
              <h2 className="brutalist-title">FAQs</h2>
            </header>
            <Accordion type="single" collapsible className="w-full mt-2">
              <AccordionItem value="item-1" className="border-b-4 border-black">
                <AccordionTrigger className="py-4 text-left font-black text-xl hover:no-underline uppercase">
                  How can I contact the author?
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4 text-lg">
                  Simply via email:{' '}
                  <a
                    href="mailto:louatimahdi390@gmail.com"
                    className="font-bold underline text-primary hover:text-accent"
                  >
                    louatimahdi390@gmail.com
                  </a>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-none">
                <AccordionTrigger className="py-4 text-left font-black text-xl hover:no-underline uppercase">
                  Do you offer a free online consultation?
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4 text-lg">
                  Yes, sure!
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <footer className="w-full max-w-4xl mt-12 text-center text-sm text-black/60">
          <div className="brutalist-card !shadow-[6px_6px_0_#999] !p-4">
            <p>Created by Louati Mahdi</p>
          </div>
        </footer>
      </main>
      <ShareDialog
        open={isShareDialogOpen}
        onOpenChange={setShareDialogOpen}
        articleTitle={articleTitle}
        articleContent={textForSummary}
      />
      <ChatWidget articleContent={textForSummary} />
    </>
  );
}
