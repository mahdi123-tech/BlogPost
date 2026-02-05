'use client';

import { useFormStatus } from 'react-dom';
import { useEffect, useActionState, useState } from 'react';
import { getSummaryAction } from './actions';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Loader2, BrainCircuit, Lightbulb, Clipboard, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

const textForSummary = ((articlePart1 + articlePart2).replace(/<[^>]*>?/gm, '')) + codeSnippet;


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
    <Button type="submit" aria-disabled={pending} className="brutalist-button brutalist-button-accent">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          Summarizing...
        </>
      ) : 'Summarize with AI'}
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
        {copied ? <Check className="h-5 w-5 text-green-400" /> : <Clipboard className="h-5 w-5" />}
      </Button>
    </div>
  );
}

export default function Home() {
  const [state, formAction] = useActionState(getSummaryAction, initialState);
  const { toast } = useToast();
  
  const articleImage = PlaceHolderImages.find(img => img.id === 'ai-ml-abstract');

  useEffect(() => {
    if (state?.error) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: state.error,
      });
    }
  }, [state, toast]);

  return (
    <main className="min-h-screen bg-background text-foreground font-body flex flex-col items-center p-4 sm:p-8">
      <div className="w-full max-w-4xl">
        <div className="brutalist-card">
          <header className="brutalist-header">
            <div className="brutalist-icon">
              <BrainCircuit stroke="white" fill="white" />
            </div>
            <h1 className="brutalist-title">The Brutalist's Guide to Modern AI</h1>
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
             </div>
          )}

          <div className="brutalist-content">
            <div dangerouslySetInnerHTML={{ __html: articlePart1 }} />
            <CodeSnippet code={codeSnippet} />
            <div dangerouslySetInnerHTML={{ __html: articlePart2 }} />
          </div>

          <footer className="mt-6 pt-6 border-t-4 border-black">
            <form action={formAction}>
              <input type="hidden" name="articleContent" value={textForSummary} />
              <SubmitButton />
            </form>
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
      </div>

       <footer className="w-full max-w-4xl mt-12 text-center text-sm text-black/60">
        <div className="brutalist-card !shadow-[6px_6px_0_#999] !p-4">
          <p>
            Created by Louati Mahdi
          </p>
        </div>
      </footer>

    </main>
  );
}
