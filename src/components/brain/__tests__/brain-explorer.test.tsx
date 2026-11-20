import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { BrainCanvasProps } from '@/components/brain/brain-canvas';
import { BrainExplorer, PATHWAY_STEP_MS } from '@/components/brain/brain-explorer';
import { ResearchSection } from '@/components/research-section';
import { publications } from '@/lib/publications';

vi.mock('next/dynamic', () => ({
  default: () =>
    function CanvasStub({ activeId, hoveredId, showArcuate, onSelect, onHover }: BrainCanvasProps) {
      return (
        <div data-testid="canvas" data-active={activeId} data-hovered={hoveredId} data-arcuate={String(showArcuate)}>
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

const step = () => act(() => vi.advanceTimersByTime(PATHWAY_STEP_MS));

describe('BrainExplorer', () => {
  it('loads the 3D canvas only after the viewer scrolls into view', () => {
    render(<BrainExplorer />);
    expect(screen.queryByTestId('canvas')).not.toBeInTheDocument();
    reveal(false);
    expect(screen.queryByTestId('canvas')).not.toBeInTheDocument();
    reveal(true);
    expect(screen.getByTestId('canvas')).toBeInTheDocument();
    expect(disconnect).toHaveBeenCalled();
  });

  it('selects a region from the button list', () => {
    render(<BrainExplorer />);
    expect(screen.getByText('Select a region to see what it does.')).toBeInTheDocument();
    const button = screen.getByRole('button', { name: "Broca's area" });
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('Language production')).toBeInTheDocument();
  });

  it('selects and labels a region from the 3D canvas', () => {
    render(<BrainExplorer />);
    reveal(true);
    fireEvent.click(screen.getByText('mesh-motor'));
    expect(screen.getByTestId('canvas')).toHaveAttribute('data-active', 'motor');
    expect(screen.getByText('Voluntary movement')).toBeInTheDocument();
    fireEvent.click(screen.getByText('hover-wernicke'));
    expect(screen.getByTestId('canvas')).toHaveAttribute('data-hovered', 'wernicke');
    expect(screen.getAllByText("Wernicke's area (approximate)")).toHaveLength(2);
  });

  it('plays the speech pathway in order, shows the tract from the Broca step, then ends', () => {
    render(<BrainExplorer />);
    reveal(true);
    const canvas = screen.getByTestId('canvas');
    fireEvent.click(screen.getByRole('button', { name: 'Play speech pathway' }));
    expect(canvas).toHaveAttribute('data-active', 'auditory');
    expect(canvas).toHaveAttribute('data-arcuate', 'false');
    expect(screen.getByText(/^1\. Sound signals/)).toBeInTheDocument();
    step();
    expect(canvas).toHaveAttribute('data-active', 'wernicke');
    expect(canvas).toHaveAttribute('data-arcuate', 'false');
    step();
    expect(canvas).toHaveAttribute('data-active', 'broca');
    expect(canvas).toHaveAttribute('data-arcuate', 'true');
    step();
    expect(canvas).toHaveAttribute('data-active', 'motor');
    expect(canvas).toHaveAttribute('data-arcuate', 'true');
    step();
    expect(canvas).not.toHaveAttribute('data-active');
    expect(screen.getByRole('button', { name: 'Play speech pathway' })).toBeInTheDocument();
  });

  it('stops the pathway on Stop and when a region is selected', () => {
    render(<BrainExplorer />);
    reveal(true);
    fireEvent.click(screen.getByRole('button', { name: 'Play speech pathway' }));
    fireEvent.click(screen.getByRole('button', { name: 'Stop' }));
    expect(screen.getByTestId('canvas')).not.toHaveAttribute('data-active');

    fireEvent.click(screen.getByRole('button', { name: 'Play speech pathway' }));
    fireEvent.click(screen.getByRole('button', { name: 'Primary somatosensory cortex' }));
    step();
    expect(screen.getByTestId('canvas')).toHaveAttribute('data-active', 'somatosensory');
    expect(screen.queryByText(/^1\. Sound signals/)).not.toBeInTheDocument();
  });
});

describe('ResearchSection', () => {
  it('shows the heading, the explorer, the model credit and each publication', () => {
    const { container } = render(<ResearchSection />);
    expect(container.querySelector('section#research')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Research' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Play speech pathway' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Anderson Winkler, CC BY-SA 3\.0/ })).toHaveAttribute(
      'href',
      'https://brainder.org/research/brain-for-blender/',
    );
    for (const publication of publications) {
      expect(screen.getByRole('link', { name: publication.title })).toHaveAttribute('href', publication.url);
    }
  });
});
