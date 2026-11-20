'use client';

import { OrbitControls, QuadraticBezierLine, useGLTF } from '@react-three/drei';
import { Canvas, useThree, type ThreeEvent } from '@react-three/fiber';
import { Suspense, useEffect, useMemo } from 'react';
import { Box3, Color, MeshStandardMaterial, Vector3, type Mesh, type Object3D } from 'three';
import { arcuateFasciculus, findRegionByMesh } from '@/lib/brain-regions';

export type BrainCanvasProps = {
  activeId?: string;
  hoveredId?: string;
  showArcuate: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | undefined) => void;
};

const MODEL_URL = '/models/brain-dk.glb';
const SHELL_COLOR = new Color('#cbd5e1');
const ARCUATE_COLOR = '#0f172a';
const RESTING_FADE = 0.5;

function centerOf(meshes: Mesh[], name: string) {
  const mesh = meshes.find((candidate) => candidate.name === name) as Object3D;
  return new Box3().setFromObject(mesh).getCenter(new Vector3());
}

function Brain({ activeId, hoveredId, showArcuate, onSelect, onHover }: BrainCanvasProps) {
  const { scene } = useGLTF(MODEL_URL, false, true);
  const invalidate = useThree((state) => state.invalidate);
  const canvas = useThree((state) => state.gl.domElement);

  const meshes = useMemo(() => {
    const found: Mesh[] = [];
    scene.traverse((object) => {
      const mesh = object as Mesh;
      if (mesh.isMesh) {
        mesh.geometry.computeVertexNormals();
        mesh.material = new MeshStandardMaterial({ roughness: 0.8 });
        found.push(mesh);
      }
    });
    scene.updateMatrixWorld(true);
    return found;
  }, [scene]);

  const arcuate = useMemo(
    () => ({
      start: centerOf(meshes, arcuateFasciculus.from),
      mid: centerOf(meshes, arcuateFasciculus.via).add(new Vector3(0, 0.2, 0)),
      end: centerOf(meshes, arcuateFasciculus.to),
    }),
    [meshes],
  );

  useEffect(() => {
    for (const mesh of meshes) {
      const region = findRegionByMesh(mesh.name);
      const material = mesh.material as MeshStandardMaterial;
      const lit = region !== undefined && (region.id === activeId || region.id === hoveredId);
      if (region) {
        material.color.set(region.color).lerp(SHELL_COLOR, lit ? 0 : RESTING_FADE);
        material.emissive.set(lit ? region.color : '#000000');
        material.emissiveIntensity = 0.35;
      } else {
        material.color.copy(SHELL_COLOR);
      }
    }
    canvas.style.cursor = hoveredId ? 'pointer' : 'grab';
    invalidate();
  }, [meshes, activeId, hoveredId, canvas, invalidate]);

  const regionIdOf = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    return findRegionByMesh(event.object.name)?.id;
  };

  return (
    <>
      <primitive
        object={scene}
        onClick={(event: ThreeEvent<MouseEvent>) => {
          const id = regionIdOf(event);
          if (id) onSelect(id);
        }}
        onPointerMove={(event: ThreeEvent<PointerEvent>) => onHover(regionIdOf(event))}
        onPointerOut={() => onHover(undefined)}
      />
      {showArcuate && (
        <QuadraticBezierLine
          start={arcuate.start}
          mid={arcuate.mid}
          end={arcuate.end}
          color={ARCUATE_COLOR}
          lineWidth={4}
          depthTest={false}
        />
      )}
    </>
  );
}

export function BrainCanvas(props: BrainCanvasProps) {
  return (
    <Canvas frameloop="demand" camera={{ position: [-3.4, 0.5, 0], fov: 35 }}>
      <ambientLight intensity={1.1} />
      <directionalLight position={[-3, 3, 2]} intensity={1.8} />
      <directionalLight position={[3, 1, -2]} intensity={0.8} />
      <Suspense fallback={null}>
        <Brain {...props} />
      </Suspense>
      <OrbitControls enablePan={false} minDistance={2} maxDistance={6} />
    </Canvas>
  );
}
