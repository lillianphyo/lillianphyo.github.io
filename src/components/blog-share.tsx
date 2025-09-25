'use client';

import { Button } from '@/components/ui/button';
import { Twitter, Linkedin, Share2, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

interface BlogShareProps {
  title: string;
  url: string;
}

export function BlogShare({ title, url }: BlogShareProps) {
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const pageUrl = mounted ? window.location.href : url;
  const text = `${title}`;

  const twitterHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(pageUrl)}`;
  const linkedinHref = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(`${title} ${pageUrl}`)}`;
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = pageUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button asChild variant="outline" size="sm" className="gap-2">
        <a href={twitterHref} target="_blank" rel="noopener noreferrer" aria-label="Share on X/Twitter">
          <Twitter className="h-4 w-4" /> X/Twitter
        </a>
      </Button>
      <Button asChild variant="outline" size="sm" className="gap-2">
        <a href={linkedinHref} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
          <Linkedin className="h-4 w-4" /> LinkedIn
        </a>
      </Button>
      <Button asChild variant="outline" size="sm" className="gap-2">
        <a href={facebookHref} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.2l-.4 3h-1.8v7A10 10 0 0 0 22 12"/></svg>
          Facebook
        </a>
      </Button>
      <Button onClick={handleShare} variant="default" size="sm" className="gap-2">
        {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
        {copied ? 'Copied!' : 'Share'}
      </Button>
    </div>
  );
}


