import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Document, NodeIO } from '@gltf-transform/core';
import { EXTMeshoptCompression, KHRMeshQuantization } from '@gltf-transform/extensions';
import { meshopt, simplify } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer';

const [inputDir, outputFile = 'public/models/brain-dk.glb'] = process.argv.slice(2);
if (!inputDir) {
  console.error('usage: node scripts/build-brain-model.mjs <pial_DK_obj dir> [output.glb]');
  process.exit(1);
}

const FILE_PATTERN = /^([lr]h)\.pial\.DK\.(\w+)\.obj$/;
const KEEP_RATIO = 0.12;

function parseObj(text) {
  const positions = [];
  const indices = [];
  for (const line of text.split('\n')) {
    const parts = line.trim().split(/\s+/);
    if (parts[0] === 'v') {
      const [x, y, z] = parts.slice(1, 4).map(Number);
      positions.push(x, z, -y);
    } else if (parts[0] === 'f') {
      indices.push(...parts.slice(1, 4).map((p) => parseInt(p, 10) - 1));
    }
  }
  return { positions, indices };
}

const regions = readdirSync(inputDir)
  .map((file) => ({ file, match: FILE_PATTERN.exec(file) }))
  .filter(({ match }) => match && match[2] !== 'unknown')
  .sort((a, b) => a.file.localeCompare(b.file))
  .map(({ file, match }) => ({
    name: `${match[1]}_${match[2]}`,
    ...parseObj(readFileSync(join(inputDir, file), 'utf8')),
  }));

const min = [Infinity, Infinity, Infinity];
const max = [-Infinity, -Infinity, -Infinity];
for (const { positions } of regions) {
  for (let i = 0; i < positions.length; i++) {
    min[i % 3] = Math.min(min[i % 3], positions[i]);
    max[i % 3] = Math.max(max[i % 3], positions[i]);
  }
}
const center = min.map((value, axis) => (value + max[axis]) / 2);
const scale = 2 / Math.max(...max.map((value, axis) => value - min[axis]));

const document = new Document();
const buffer = document.createBuffer();
const scene = document.createScene('brain');
for (const { name, positions, indices } of regions) {
  const scaled = Float32Array.from(positions, (value, i) => (value - center[i % 3]) * scale);
  const primitive = document
    .createPrimitive()
    .setAttribute('POSITION', document.createAccessor().setType('VEC3').setArray(scaled).setBuffer(buffer))
    .setIndices(document.createAccessor().setType('SCALAR').setArray(Uint32Array.from(indices)).setBuffer(buffer));
  scene.addChild(document.createNode(name).setMesh(document.createMesh(name).addPrimitive(primitive)));
}

await MeshoptEncoder.ready;
await MeshoptSimplifier.ready;
await document.transform(
  simplify({ simplifier: MeshoptSimplifier, ratio: KEEP_RATIO, error: 0.01, lockBorder: true }),
  meshopt({ encoder: MeshoptEncoder, level: 'medium' }),
);

const io = new NodeIO()
  .registerExtensions([EXTMeshoptCompression, KHRMeshQuantization])
  .registerDependencies({ 'meshopt.encoder': MeshoptEncoder });
await io.write(outputFile, document);
console.log(`${regions.length} regions -> ${outputFile}`);
