'use client';

import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { BrainRegion } from '@/lib/brain-regions';

export function RegionPanel({ region }: { region?: BrainRegion }) {
  const { t } = useTranslation();

  if (!region) {
    return (
      <Card className="border border-border bg-card">
        <CardContent className="p-6 text-muted-foreground">{t('research.brain.select_prompt')}</CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border bg-card" aria-live="polite">
      <CardHeader className="pb-3">
        <CardDescription className="flex items-center gap-2 text-base font-semibold text-foreground">
          <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: region.color }} />
          {t(`research.brain.regions.${region.id}.role`)}
        </CardDescription>
        <CardTitle className="text-sm font-normal text-muted-foreground">
          {t(`research.brain.regions.${region.id}.name`)}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-base leading-relaxed">{t(`research.brain.regions.${region.id}.note`)}</CardContent>
    </Card>
  );
}
