import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RegionPanel } from '@/components/brain/region-panel';
import { SpeechTimeline } from '@/components/brain/speech-timeline';
import { findRegion } from '@/lib/brain-regions';

describe('RegionPanel', () => {
  it('asks the visitor to click an area when none is selected', () => {
    render(<RegionPanel />);
    expect(screen.getByText('Click a coloured area to see what it does.')).toBeInTheDocument();
  });

  it('shows the plain role, the anatomical name and the note of a region', () => {
    render(<RegionPanel region={findRegion('broca')} />);
    expect(screen.getByText('Building speech')).toBeInTheDocument();
    expect(screen.getByText("Broca's area")).toBeInTheDocument();
    expect(screen.getByText(/vital for producing language/)).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});

describe('SpeechTimeline', () => {
  const heard = ['How', 'are', 'you'];
  const spoken = ['I', 'am', 'fine'];
  const stateOf = (word: string) => screen.getByText(word).closest('li')?.getAttribute('data-state');

  it('invites the visitor to press play when idle', () => {
    render(<SpeechTimeline heard={heard} spoken={spoken} />);
    expect(screen.getByText(/^Press play/)).toBeInTheDocument();
    expect(screen.queryByText('How')).not.toBeInTheDocument();
  });

  it('marks heard words as done, current and waiting while listening', () => {
    render(<SpeechTimeline beat={{ phase: 'listen', word: 1 }} heard={heard} spoken={spoken} />);
    expect(screen.getByText('Listen')).toBeInTheDocument();
    expect(stateOf('How')).toBe('done');
    expect(stateOf('are')).toBe('current');
    expect(stateOf('you')).toBe('waiting');
    expect(screen.queryByText('fine')).not.toBeInTheDocument();
  });

  it('shows the next spoken word as planned, then as current when spoken', () => {
    const { rerender } = render(<SpeechTimeline beat={{ phase: 'plan', word: 1 }} heard={heard} spoken={spoken} />);
    expect(screen.getByText('Plan')).toBeInTheDocument();
    expect(stateOf('I')).toBe('done');
    expect(stateOf('am')).toBe('planned');
    expect(stateOf('fine')).toBe('waiting');

    rerender(<SpeechTimeline beat={{ phase: 'speak', word: 1 }} heard={heard} spoken={spoken} />);
    expect(screen.getByText('Speak')).toBeInTheDocument();
    expect(stateOf('am')).toBe('current');
  });
});
