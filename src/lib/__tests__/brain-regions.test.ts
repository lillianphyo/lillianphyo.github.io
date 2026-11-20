import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  arcuateFasciculus,
  brainRegions,
  findRegion,
  findRegionByMesh,
  speechPathway,
} from '@/lib/brain-regions';
import { publications } from '@/lib/publications';
import en from '@/locales/en.json';
import ja from '@/locales/ja.json';
import my from '@/locales/my.json';

function modelMeshNames() {
  const glb = readFileSync('public/models/brain-dk.glb');
  const jsonLength = glb.readUInt32LE(12);
  const gltf = JSON.parse(glb.subarray(20, 20 + jsonLength).toString('utf8'));
  return gltf.nodes.map((node: { name: string }) => node.name) as string[];
}

describe('brain regions', () => {
  const locales = { en, ja, my };

  it.each(Object.entries(locales))('has name, role and note for every region in %s', (_, locale) => {
    for (const region of brainRegions) {
      const text = locale.research.brain.regions[region.id as keyof typeof locale.research.brain.regions];
      expect(text.name, region.id).toBeTruthy();
      expect(text.role, region.id).toBeTruthy();
      expect(text.note, region.id).toBeTruthy();
    }
  });

  it.each(Object.entries(locales))('has a caption for every pathway step in %s', (_, locale) => {
    for (const step of speechPathway) {
      expect(locale.research.brain.pathway[step as keyof typeof locale.research.brain.pathway], step).toBeTruthy();
    }
  });

  it('keeps the three locale files on the same research keys', () => {
    const keys = (value: object): string[] =>
      Object.entries(value).flatMap(([key, child]) =>
        typeof child === 'object' ? keys(child).map((nested) => `${key}.${nested}`) : [key],
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

  it('runs the pathway from hearing to movement through known regions', () => {
    expect(speechPathway).toEqual(['auditory', 'wernicke', 'broca', 'motor']);
    for (const step of speechPathway) {
      expect(findRegion(step), step).toBeDefined();
    }
    expect(speechPathway).toContain(arcuateFasciculus.visibleFromStep);
  });

  it('links only to publications that exist', () => {
    const ids = publications.map((publication) => publication.id);
    for (const region of brainRegions) {
      for (const id of region.publicationIds) {
        expect(ids, region.id).toContain(id);
      }
    }
  });

  it('gives every region at least one https source', () => {
    for (const region of brainRegions) {
      expect(region.sources.length, region.id).toBeGreaterThan(0);
      for (const source of region.sources) {
        expect(source.url).toMatch(/^https:\/\//);
      }
    }
  });

  it('finds a region by id and by mesh', () => {
    expect(findRegion('broca')?.meshes).toContain('lh_parsopercularis');
    expect(findRegion(undefined)).toBeUndefined();
    expect(findRegionByMesh('lh_precentral')?.id).toBe('motor');
    expect(findRegionByMesh('rh_precentral')).toBeUndefined();
  });
});
