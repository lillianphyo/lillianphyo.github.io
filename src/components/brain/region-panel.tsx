'use client';

import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { BrainRegion } from '@/lib/brain-regions';
import { publications } from '@/lib/publications';

type RegionPanelProps = {
  region?: BrainRegion;
  caption?: string;
};

const linkClass = 'text-primary underline-offset-4 hover:underline';

export function RegionPanel({ region, caption }: RegionPanelProps) {
  const { t } = useTranslation();

  if (!region) {
    return (
      <Card className="border border-border bg-card">
        <CardContent className="p-6 text-muted-foreground">{t('research.brain.select_prompt')}</CardContent>
      </Card>
    );
  }

  const related = publications.filter((publication) => region.publicationIds.includes(publication.id));

  return (
    <Card className="border border-border bg-card" aria-live="polite">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: region.color }} />
          {t(`research.brain.regions.${region.id}.name`)}
        </CardTitle>
        <CardDescription>{t(`research.brain.regions.${region.id}.role`)}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm leading-relaxed">
        {caption && <p className="font-medium text-foreground">{caption}</p>}
        <p className="text-muted-foreground">{t(`research.brain.regions.${region.id}.note`)}</p>
        <div>
          <h4 className="mb-1 font-semibold">{t('research.brain.sources')}</h4>
          <ul className="space-y-1">
            {region.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        {related.length > 0 && (
          <div>
            <h4 className="mb-1 font-semibold">{t('research.brain.related')}</h4>
            <ul className="space-y-1">
              {related.map((publication) => (
                <li key={publication.id}>
                  <a href={publication.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {publication.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
