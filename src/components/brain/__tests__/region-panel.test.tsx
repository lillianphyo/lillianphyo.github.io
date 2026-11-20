import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { RegionPanel } from '@/components/brain/region-panel';
import { findRegion } from '@/lib/brain-regions';
import { publications } from '@/lib/publications';

describe('RegionPanel', () => {
  it('asks the visitor to select a region when none is selected', () => {
    render(<RegionPanel />);
    expect(screen.getByText('Select a region to see what it does.')).toBeInTheDocument();
  });

  it('shows name, role, note, sources and related work for a region with publications', () => {
    render(<RegionPanel region={findRegion('broca')} />);
    expect(screen.getByText("Broca's area")).toBeInTheDocument();
    expect(screen.getByText('Language production')).toBeInTheDocument();
    expect(screen.getByText(/inferior frontal gyrus/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Broca Area, StatPearls/ })).toHaveAttribute(
      'href',
      'https://pubmed.ncbi.nlm.nih.gov/30252352/',
    );
    expect(screen.getByText('Related work')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: publications[0].title })).toHaveAttribute('href', publications[0].url);
  });

  it('hides related work for a region without publications', () => {
    render(<RegionPanel region={findRegion('auditory')} />);
    expect(screen.getByText('Primary auditory cortex')).toBeInTheDocument();
    expect(screen.queryByText('Related work')).not.toBeInTheDocument();
  });

  it('shows the pathway caption when one is given', () => {
    render(<RegionPanel region={findRegion('motor')} caption="4. step caption" />);
    expect(screen.getByText('4. step caption')).toBeInTheDocument();
  });
});
