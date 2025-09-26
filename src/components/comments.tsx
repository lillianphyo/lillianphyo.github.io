'use client';

import { useEffect, useRef, useState } from 'react';

export function Comments() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [configured, setConfigured] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY;
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const isConfigured = Boolean(repo && repoId && category && categoryId);
    setConfigured(isConfigured);
    
    console.log('Giscus config:', { repo, repoId, category, categoryId, isConfigured });
    
    if (!isConfigured || !containerRef.current) return;

    // Prevent double mounts on Fast Refresh
    if (containerRef.current.querySelector('iframe')) return;

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';

    script.setAttribute('data-repo', repo as string);
    script.setAttribute('data-repo-id', repoId as string);
    script.setAttribute('data-category', category as string);
    script.setAttribute('data-category-id', categoryId as string);
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
  }, [mounted, repo, repoId, category, categoryId]);

  if (!mounted) {
    return (
      <div className="rounded-md border border-border p-4 text-sm text-muted-foreground">
        Loading comments...
      </div>
    );
  }

  if (!configured) {
    return (
      <div className="rounded-md border border-border p-4 text-sm text-muted-foreground">
        Comments are not configured. Add NEXT_PUBLIC_GISCUS_REPO, NEXT_PUBLIC_GISCUS_REPO_ID,
        NEXT_PUBLIC_GISCUS_CATEGORY, and NEXT_PUBLIC_GISCUS_CATEGORY_ID to enable comments.
        <br />
        <br />
        Current config: {JSON.stringify({ repo, repoId, category, categoryId })}
      </div>
    );
  }

  return <div ref={containerRef} className="giscus" />;
}


