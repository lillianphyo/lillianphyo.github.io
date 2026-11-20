import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { arcuateFasciculus, brainRegions, brainSources, findRegion, findRegionByMesh } from '@/lib/brain-regions';
import { buildStory, storyPhases } from '@/lib/speech-story';
import en from '@/locales/en.json';
import ja from '@/locales/ja.json';
import my from '@/locales/my.json';

function modelMeshNames() {
  const glb = readFileSync('public/models/brain-dk.glb');
  const jsonLength = glb.readUInt32LE(12);
  const gltf = JSON.parse(glb.subarray(20, 20 + jsonLength).toString('utf8'));
  return gltf.nodes.map((node: { name: string }) => node.name) as string[];
}

const locales = { en, ja, my };

describe('brain regions', () => {
  it.each(Object.entries(locales))('has name, role and note for every region in %s', (_, locale) => {
    for (const region of brainRegions) {
      const text = locale.research.brain.regions[region.id as keyof typeof locale.research.brain.regions];
      expect(text.name, region.id).toBeTruthy();
      expect(text.role, region.id).toBeTruthy();
      expect(text.note, region.id).toBeTruthy();
    }
  });

  it('keeps the three locale files on the same research keys', () => {
    const keys = (value: object): string[] =>
      Object.entries(value).flatMap(([key, child]) =>
        typeof child === 'object' && !Array.isArray(child) ? keys(child).map((nested) => `${key}.${nested}`) : [key],
      );
    expect(keys(ja.research)).toEqual(keys(en.research));
    expect(keys(my.research)).toEqual(keys(en.research));
    expect(ja.nav.research).toBeTruthy();
    expect(my.nav.research).toBeTruthy();
  });

  it('points only at meshes that exist in the model', () => {
    const names = modelMeshNames();
    const used = [
      ...brainRegions.flatMap((region) => region.meshes),
      arcuateFasciculus.from,
      arcuateFasciculus.via,
      arcuateFasciculus.to,
    ];
    for (const mesh of used) {
      expect(names, mesh).toContain(mesh);
    }
  });

  it('assigns each mesh to one region only', () => {
    const meshes = brainRegions.flatMap((region) => region.meshes);
    expect(new Set(meshes).size).toBe(meshes.length);
  });

  it('lists an https source for every region and for the tract', () => {
    for (const region of brainRegions) {
      expect(region.sources.length, region.id).toBeGreaterThan(0);
    }
    expect(brainSources).toContain(arcuateFasciculus.source);
    for (const source of brainSources) {
      expect(source.url).toMatch(/^https:\/\//);
    }
  });

  it('finds a region by id and by mesh', () => {
    expect(findRegion('broca')?.meshes).toContain('lh_parsopercularis');
    expect(findRegion(undefined)).toBeUndefined();
    expect(findRegionByMesh('lh_precentral')?.id).toBe('motor');
    expect(findRegionByMesh('rh_precentral')).toBeUndefined();
  });
});

describe('speech story', () => {
  it('hears every word first, then plans each spoken word before speaking it', () => {
    expect(buildStory(2, 2)).toEqual([
      { phase: 'listen', word: 0 },
      { phase: 'listen', word: 1 },
      { phase: 'plan', word: 0 },
      { phase: 'speak', word: 0 },
      { phase: 'plan', word: 1 },
      { phase: 'speak', word: 1 },
    ]);
    expect(buildStory(0, 0)).toEqual([]);
  });

  it('lights only known regions and sends the signal only while planning', () => {
    for (const phase of Object.values(storyPhases)) {
      expect(phase.ms).toBeGreaterThan(0);
      for (const id of phase.regions) {
        expect(findRegion(id), id).toBeDefined();
      }
    }
    expect(Object.entries(storyPhases).filter(([, phase]) => phase.signal).map(([name]) => name)).toEqual(['plan']);
  });

  it.each(Object.entries(locales))('has words, idle text and phase text in %s', (_, locale) => {
    const story = locale.research.brain.story;
    expect(story.heard.length).toBeGreaterThan(0);
    expect(story.spoken.length).toBeGreaterThan(0);
    expect(story.idle).toBeTruthy();
    expect(story.note).toBeTruthy();
    for (const phase of Object.keys(storyPhases)) {
      const text = story.phases[phase as keyof typeof story.phases];
      expect(text.title, phase).toBeTruthy();
      expect(text.text, phase).toBeTruthy();
    }
  });
});
