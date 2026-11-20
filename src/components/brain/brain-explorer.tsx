'use client';

import dynamic from 'next/dynamic';
import { Play, Square } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { brainRegions, findRegion } from '@/lib/brain-regions';
import { buildStory, storyPhases } from '@/lib/speech-story';
import { RegionPanel } from './region-panel';
import { SpeechTimeline } from './speech-timeline';

const BrainCanvas = dynamic(() => import('./brain-canvas').then((module) => module.BrainCanvas), { ssr: false });

export function BrainExplorer() {
  const { t } = useTranslation();
  const stageRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [selectedId, setSelectedId] = useState<string>();
  const [hoveredId, setHoveredId] = useState<string>();
  const [beatIndex, setBeatIndex] = useState<number>();

  const heard = t('research.brain.story.heard', { returnObjects: true }) as string[];
  const spoken = t('research.brain.story.spoken', { returnObjects: true }) as string[];
  const story = useMemo(() => buildStory(heard.length, spoken.length), [heard.length, spoken.length]);
  const beat = beatIndex === undefined ? undefined : story[beatIndex];
  const phase = beat && storyPhases[beat.phase];

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
    observer.observe(stageRef.current as Element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (beatIndex === undefined || !phase) return;
    const next = beatIndex + 1;
    const timer = setTimeout(() => setBeatIndex(next < story.length ? next : undefined), phase.ms);
    return () => clearTimeout(timer);
  }, [beatIndex, phase, story.length]);

  const activeIds = useMemo(() => phase?.regions ?? (selectedId ? [selectedId] : []), [phase, selectedId]);
  const pulse = useMemo(
    () => phase && beatIndex !== undefined && { key: beatIndex, color: phase.color, ms: phase.ms, signal: phase.signal },
    [phase, beatIndex],
  );

  const select = (id: string) => {
    setBeatIndex(undefined);
    setSelectedId(id);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div
          ref={stageRef}
          className="relative h-[420px] md:h-[520px] overflow-hidden rounded-xl bg-gradient-to-b from-[#0b1f4a] to-[#07122b] shadow-modern-lg"
        >
          {inView && (
            <BrainCanvas
              activeIds={activeIds}
              hoveredId={hoveredId}
              pulse={pulse || undefined}
              onSelect={select}
              onHover={setHoveredId}
            />
          )}
          <div className="pointer-events-none absolute inset-x-0 top-0 p-5">
            <SpeechTimeline beat={beat} heard={heard} spoken={spoken} />
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
            <p className="max-w-xl text-base font-medium leading-snug text-white md:text-lg">
              {beat
                ? t(`research.brain.story.phases.${beat.phase}.text`)
                : hoveredId && t(`research.brain.regions.${hoveredId}.role`)}
            </p>
            <Button
              className="pointer-events-auto shrink-0 bg-white text-slate-900 hover:bg-white/90"
              onClick={() => setBeatIndex(beat ? undefined : 0)}
            >
              {beat ? <Square /> : <Play />}
              {t(beat ? 'research.brain.stop' : 'research.brain.play')}
            </Button>
          </div>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          {t('research.brain.hint')} {t('research.brain.story.note')}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {brainRegions.map((region) => {
            const pressed = !beat && region.id === selectedId;
            return (
              <Button
                key={region.id}
                variant={pressed ? 'default' : 'outline'}
                size="sm"
                aria-pressed={pressed}
                onClick={() => select(region.id)}
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: region.color }} />
                {t(`research.brain.regions.${region.id}.role`)}
              </Button>
            );
          })}
        </div>
        <RegionPanel region={beat ? undefined : findRegion(selectedId)} />
      </div>
    </div>
  );
}
