'use client';

import { BrainCircuit, Ear, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { storyPhases, type StoryBeat, type StoryPhase } from '@/lib/speech-story';

type SpeechTimelineProps = {
  beat?: StoryBeat;
  heard: string[];
  spoken: string[];
};

const phaseIcons: Record<StoryPhase, typeof Ear> = {
  listen: Ear,
  plan: BrainCircuit,
  speak: MessageCircle,
};

const WAVE_HEIGHTS = [35, 80, 55, 100, 60, 85, 40];

export function SpeechTimeline({ beat, heard, spoken }: SpeechTimelineProps) {
  const { t } = useTranslation();

  if (!beat) {
    return <p className="text-sm text-slate-300">{t('research.brain.story.idle')}</p>;
  }

  const { color } = storyPhases[beat.phase];
  const Icon = phaseIcons[beat.phase];
  const words = beat.phase === 'listen' ? heard : spoken;

  return (
    <div className="flex items-center gap-4" style={{ color }}>
      <div className="flex w-20 shrink-0 flex-col items-center gap-1">
        <Icon className="h-7 w-7" />
        <span className="text-xs font-semibold">{t(`research.brain.story.phases.${beat.phase}.title`)}</span>
      </div>
      <ol className="flex flex-1 items-end gap-3 border-b border-current/40 pb-1">
        {words.map((word, index) => {
          const state = index < beat.word ? 'done' : index > beat.word ? 'waiting' : beat.phase === 'plan' ? 'planned' : 'current';
          return (
            <li
              key={index}
              data-state={state}
              className="flex flex-1 flex-col items-center gap-1 transition-opacity duration-300 data-[state=waiting]:opacity-25 data-[state=done]:opacity-60"
            >
              <span className="flex h-6 items-end gap-0.5" aria-hidden>
                {WAVE_HEIGHTS.map((_, bar) => (
                  <span
                    key={bar}
                    className="w-0.5 rounded-full bg-current"
                    style={{ height: state === 'planned' ? '10%' : `${WAVE_HEIGHTS[(bar + index) % WAVE_HEIGHTS.length]}%` }}
                  />
                ))}
              </span>
              <span className={`text-sm font-semibold ${state === 'current' ? 'text-white' : ''}`}>{word}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
