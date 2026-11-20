'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { arcuateFasciculus, brainRegions, findRegion, speechPathway } from '@/lib/brain-regions';
import { RegionPanel } from './region-panel';

const BrainCanvas = dynamic(() => import('./brain-canvas').then((module) => module.BrainCanvas), { ssr: false });

export const PATHWAY_STEP_MS = 3500;

export function BrainExplorer() {
  const { t } = useTranslation();
  const viewportRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [selectedId, setSelectedId] = useState<string>();
  const [hoveredId, setHoveredId] = useState<string>();
  const [pathwayStep, setPathwayStep] = useState<number>();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' },
    );
    observer.observe(viewportRef.current as Element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (pathwayStep === undefined) return;
    const next = pathwayStep + 1;
    const timer = setTimeout(() => setPathwayStep(next < speechPathway.length ? next : undefined), PATHWAY_STEP_MS);
    return () => clearTimeout(timer);
  }, [pathwayStep]);

  const playing = pathwayStep !== undefined;
  const activeId = playing ? speechPathway[pathwayStep] : selectedId;
  const showArcuate = playing && pathwayStep >= speechPathway.indexOf(arcuateFasciculus.visibleFromStep);

  const select = (id: string) => {
    setPathwayStep(undefined);
    setSelectedId(id);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div className="lg:col-span-3">
        <div
          ref={viewportRef}
          className="relative h-[360px] md:h-[460px] rounded-lg border border-border bg-card shadow-modern-lg overflow-hidden"
        >
          {inView && (
            <BrainCanvas
              activeId={activeId}
              hoveredId={hoveredId}
              showArcuate={showArcuate}
              onSelect={select}
              onHover={setHoveredId}
            />
          )}
          {hoveredId && (
            <span className="pointer-events-none absolute left-4 top-4 rounded-md bg-background/90 px-3 py-1 text-sm font-medium shadow-modern">
              {t(`research.brain.regions.${hoveredId}.name`)}
            </span>
          )}
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{t('research.brain.hint')}</p>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <div className="flex flex-wrap gap-2">
          {brainRegions.map((region) => (
            <Button
              key={region.id}
              variant={region.id === activeId ? 'default' : 'outline'}
              size="sm"
              aria-pressed={region.id === activeId}
              onClick={() => select(region.id)}
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: region.color }} />
              {t(`research.brain.regions.${region.id}.name`)}
            </Button>
          ))}
        </div>
        <div>
          <Button onClick={() => setPathwayStep(playing ? undefined : 0)}>
            {t(playing ? 'research.brain.stop' : 'research.brain.play')}
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            {t('research.brain.pathway_note')}{' '}
            <a
              href={arcuateFasciculus.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              {arcuateFasciculus.source.label}
            </a>
          </p>
        </div>
        <RegionPanel
          region={findRegion(activeId)}
          caption={playing ? t(`research.brain.pathway.${speechPathway[pathwayStep]}`) : undefined}
        />
      </div>
    </div>
  );
}
