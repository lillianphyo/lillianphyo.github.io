export type RegionSource = {
  label: string;
  url: string;
};

export type BrainRegion = {
  id: string;
  meshes: string[];
  color: string;
  sources: RegionSource[];
};

export const brainRegions: BrainRegion[] = [
  {
    id: 'auditory',
    meshes: ['lh_transversetemporal'],
    color: '#f59e0b',
    sources: [
      {
        label: 'Mangold & Das, Neuroanatomy, Cortical Primary Auditory Area, StatPearls (2023)',
        url: 'https://pubmed.ncbi.nlm.nih.gov/32119408/',
      },
    ],
  },
  {
    id: 'wernicke',
    meshes: ['lh_superiortemporal', 'lh_bankssts', 'lh_supramarginal'],
    color: '#ef4444',
    sources: [
      {
        label: 'Javed et al., Neuroanatomy, Wernicke Area, StatPearls (2023)',
        url: 'https://pubmed.ncbi.nlm.nih.gov/30422593/',
      },
      {
        label: "Silva et al., A neural code for generative speech production in human Wernicke's area, Science (2026)",
        url: 'https://doi.org/10.1126/science.aef8963',
      },
    ],
  },
  {
    id: 'broca',
    meshes: ['lh_parsopercularis', 'lh_parstriangularis'],
    color: '#3b82f6',
    sources: [
      {
        label: 'Stinnett et al., Neuroanatomy, Broca Area, StatPearls (2023)',
        url: 'https://pubmed.ncbi.nlm.nih.gov/30252352/',
      },
    ],
  },
  {
    id: 'motor',
    meshes: ['lh_precentral'],
    color: '#10b981',
    sources: [
      {
        label: 'Banker & Tadi, Neuroanatomy, Precentral Gyrus, StatPearls (2023)',
        url: 'https://pubmed.ncbi.nlm.nih.gov/31334938/',
      },
    ],
  },
  {
    id: 'somatosensory',
    meshes: ['lh_postcentral'],
    color: '#8b5cf6',
    sources: [
      {
        label: 'Raju & Tadi, Neuroanatomy, Somatosensory Cortex, StatPearls (2022)',
        url: 'https://pubmed.ncbi.nlm.nih.gov/32310375/',
      },
    ],
  },
];

export const arcuateFasciculus = {
  from: 'lh_bankssts',
  via: 'lh_supramarginal',
  to: 'lh_parsopercularis',
  source: {
    label: 'Sierpowska et al., Comparing human and chimpanzee temporal lobe neuroanatomy, PNAS (2022)',
    url: 'https://doi.org/10.1073/pnas.2118295119',
  },
};

export const brainSources: RegionSource[] = [
  ...brainRegions.flatMap((region) => region.sources),
  arcuateFasciculus.source,
];

export function findRegion(id: string | undefined) {
  return brainRegions.find((region) => region.id === id);
}

export function findRegionByMesh(mesh: string) {
  return brainRegions.find((region) => region.meshes.includes(mesh));
}
