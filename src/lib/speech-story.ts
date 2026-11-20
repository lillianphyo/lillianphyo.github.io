export type StoryPhase = 'listen' | 'plan' | 'speak';

export type StoryBeat = {
  phase: StoryPhase;
  word: number;
};

export const storyPhases: Record<StoryPhase, { color: string; regions: string[]; ms: number; signal: boolean }> = {
  listen: { color: '#60a5fa', regions: ['auditory', 'wernicke'], ms: 800, signal: false },
  plan: { color: '#f472b6', regions: ['wernicke'], ms: 900, signal: true },
  speak: { color: '#fbbf24', regions: ['broca', 'motor'], ms: 800, signal: false },
};

export function buildStory(heardCount: number, spokenCount: number): StoryBeat[] {
  const listen = Array.from({ length: heardCount }, (_, word): StoryBeat => ({ phase: 'listen', word }));
  const answer = Array.from({ length: spokenCount }, (_, word): StoryBeat[] => [
    { phase: 'plan', word },
    { phase: 'speak', word },
  ]);
  return [...listen, ...answer.flat()];
}
