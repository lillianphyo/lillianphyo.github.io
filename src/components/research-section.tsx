'use client';

import { useTranslation } from 'react-i18next';
import { BrainExplorer } from '@/components/brain/brain-explorer';
import { brainSources } from '@/lib/brain-regions';
import { publications } from '@/lib/publications';

const MODEL_CREDIT_URL = 'https://brainder.org/research/brain-for-blender/';

export function ResearchSection() {
  const { t } = useTranslation();

  return (
    <section id="research" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="gradient-text">{t('research.title')}</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{t('research.description')}</p>
          </div>

          <BrainExplorer />

          <details className="mt-6 text-xs text-muted-foreground">
            <summary className="cursor-pointer">{t('research.brain.sources')}</summary>
            <ul className="mt-2 space-y-1">
              {brainSources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                    {source.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={MODEL_CREDIT_URL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                  {t('research.brain.credit')}
                </a>
              </li>
            </ul>
          </details>

          <h3 className="mt-16 mb-6 text-2xl font-bold">{t('research.publications.title')}</h3>
          <ul className="space-y-4">
            {publications.map((publication) => (
              <li key={publication.id} className="rounded-lg border border-border bg-card p-6 shadow-modern">
                <a
                  href={publication.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-medium hover:text-primary transition-colors"
                >
                  {publication.title}
                </a>
                <p className="mt-1 text-sm text-muted-foreground">
                  {publication.venue}, {publication.year}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
