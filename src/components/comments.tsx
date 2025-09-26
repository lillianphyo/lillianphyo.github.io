'use client';

import { useEffect, useRef, useState } from 'react';

export function Comments() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  // Use hardcoded values from your script configuration
  const repo = 'lillianphyo/lillianphyo.github.io';
  const repoId = 'R_kgDOP2uDpQ';
  const category = 'General';
  const categoryId = 'DIC_kwDOP2uDpc4Cv4dB';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;
    
    console.log('Giscus config:', { repo, repoId, category, categoryId });

    // Prevent double mounts on Fast Refresh
    if (containerRef.current.querySelector('iframe')) return;

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';

    script.setAttribute('data-repo', repo);
    script.setAttribute('data-repo-id', repoId);
    script.setAttribute('data-category', category);
    script.setAttribute('data-category-id', categoryId);
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', 'preferred_color_scheme');
    script.setAttribute('data-lang', 'en');

    script.onload = () => console.log('Giscus script loaded');
    script.onerror = () => console.error('Giscus script failed to load');

    containerRef.current.appendChild(script);
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="rounded-md border border-border p-4 text-sm text-muted-foreground">
        Loading comments...
      </div>
    );
  }


  return <div ref={containerRef} className="giscus" />;
}


