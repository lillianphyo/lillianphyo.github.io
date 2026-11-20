import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { BrainCanvasProps } from '@/components/brain/brain-canvas';
import { BrainExplorer } from '@/components/brain/brain-explorer';
import { ResearchSection } from '@/components/research-section';
import { brainSources } from '@/lib/brain-regions';
import { publications } from '@/lib/publications';
import { storyPhases } from '@/lib/speech-story';
import en from '@/locales/en.json';

vi.mock('next/dynamic', () => ({
  default: () =>
    function CanvasStub({ activeIds, hoveredId, pulse, onSelect, onHover }: BrainCanvasProps) {
      return (
        <div
          data-testid="canvas"
          data-active={activeIds.join(',')}
          data-hovered={hoveredId}
          data-color={pulse?.color}
          data-signal={pulse && String(pulse.signal)}
        >
          <button onClick={() => onSelect('motor')}>mesh-motor</button>
          <button onClick={() => onHover('wernicke')}>hover-wernicke</button>
        </div>
      );
    },
}));

let reveal: (isIntersecting: boolean) => void;
const disconnect = vi.fn();

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback: (entries: { isIntersecting: boolean }[]) => void) {
        reveal = (isIntersecting) => act(() => callback([{ isIntersecting }]));
      }
      observe() {}
      disconnect = disconnect;
    },
  );
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  disconnect.mockClear();
});

const { heard, spoken, phases } = en.research.brain.story;
const advance = (phase: keyof typeof storyPhases) => act(() => vi.advanceTimersByTime(storyPhases[phase].ms));
const play = () => fireEvent.click(screen.getByRole('button', { name: 'Play: hear and speak' }));

describe('BrainExplorer', () => {
  it('loads the 3D canvas only after the stage scrolls into view', () => {
    render(<BrainExplorer />);
    expect(screen.queryByTestId('canvas')).not.toBeInTheDocument();
    reveal(false);
    expect(screen.queryByTestId('canvas')).not.toBeInTheDocument();
    reveal(true);
    expect(screen.getByTestId('canvas')).toHaveAttribute('data-active', '');
    expect(disconnect).toHaveBeenCalled();
  });

  it('selects an area from the button list', () => {
    render(<BrainExplorer />);
    expect(screen.getByText('Click a coloured area to see what it does.')).toBeInTheDocument();
    const button = screen.getByRole('button', { name: 'Building speech' });
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText("Broca's area")).toBeInTheDocument();
  });

  it('selects an area from the 3D canvas and names the hovered one on the stage', () => {
    render(<BrainExplorer />);
    reveal(true);
    fireEvent.click(screen.getByText('mesh-motor'));
    expect(screen.getByTestId('canvas')).toHaveAttribute('data-active', 'motor');
    expect(screen.getByText('Primary motor cortex')).toBeInTheDocument();
    fireEvent.click(screen.getByText('hover-wernicke'));
    expect(screen.getByTestId('canvas')).toHaveAttribute('data-hovered', 'wernicke');
    expect(screen.getAllByText('Understanding words')).toHaveLength(2);
  });

  it('plays the story: listen to each word, then plan and speak each answer word, then stop', () => {
    render(<BrainExplorer />);
    reveal(true);
    const canvas = screen.getByTestId('canvas');
    expect(screen.getByText(/^Press play/)).toBeInTheDocument();
    play();

    for (const word of heard) {
      expect(canvas).toHaveAttribute('data-active', 'auditory,wernicke');
      expect(canvas).toHaveAttribute('data-color', storyPhases.listen.color);
      expect(canvas).toHaveAttribute('data-signal', 'false');
      expect(screen.getByText(word).closest('li')).toHaveAttribute('data-state', 'current');
      expect(screen.getByText(phases.listen.text)).toBeInTheDocument();
      advance('listen');
    }
    for (const word of spoken) {
      expect(canvas).toHaveAttribute('data-active', 'wernicke');
      expect(canvas).toHaveAttribute('data-signal', 'true');
      expect(screen.getByText(word).closest('li')).toHaveAttribute('data-state', 'planned');
      expect(screen.getByText(phases.plan.text)).toBeInTheDocument();
      advance('plan');
      expect(canvas).toHaveAttribute('data-active', 'broca,motor');
      expect(canvas).toHaveAttribute('data-color', storyPhases.speak.color);
      expect(screen.getByText(word).closest('li')).toHaveAttribute('data-state', 'current');
      advance('speak');
    }

    expect(canvas).toHaveAttribute('data-active', '');
    expect(canvas).not.toHaveAttribute('data-color');
    expect(screen.getByRole('button', { name: 'Play: hear and speak' })).toBeInTheDocument();
  });

  it('hides the selected area while playing and stops on Stop or on a new selection', () => {
    render(<BrainExplorer />);
    reveal(true);
    fireEvent.click(screen.getByRole('button', { name: 'Feeling' }));
    play();
    expect(screen.queryByText('Primary somatosensory cortex')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Feeling' })).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(screen.getByRole('button', { name: 'Stop' }));
    expect(screen.getByTestId('canvas')).toHaveAttribute('data-active', 'somatosensory');

    play();
    fireEvent.click(screen.getByRole('button', { name: 'Hearing' }));
    advance('listen');
    expect(screen.getByTestId('canvas')).toHaveAttribute('data-active', 'auditory');
    expect(screen.getByText(/^Press play/)).toBeInTheDocument();
  });
});

describe('ResearchSection', () => {
  it('shows the heading, the explorer, the folded sources with the model credit, and each publication', () => {
    const { container } = render(<ResearchSection />);
    expect(container.querySelector('section#research')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Research' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Play: hear and speak' })).toBeInTheDocument();

    const sources = container.querySelector('details');
    expect(sources).not.toHaveAttribute('open');
    for (const source of brainSources) {
      expect(sources?.querySelector(`a[href="${source.url}"]`)).toHaveTextContent(source.label);
    }
    expect(sources?.querySelector('a[href="https://brainder.org/research/brain-for-blender/"]')).toHaveTextContent(
      /Anderson Winkler, CC BY-SA 3\.0/,
    );
    for (const publication of publications) {
      expect(screen.getByRole('link', { name: publication.title })).toHaveAttribute('href', publication.url);
    }
  });
});
