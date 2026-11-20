'use client';

import { Line, OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import {
  Box3,
  Color,
  MeshStandardMaterial,
  QuadraticBezierCurve3,
  Vector3,
  type Mesh,
  type Object3D,
} from 'three';
import { arcuateFasciculus, findRegionByMesh } from '@/lib/brain-regions';

export type BrainPulse = {
  key: number;
  color: string;
  ms: number;
  signal: boolean;
};

export type BrainCanvasProps = {
  activeIds: string[];
  hoveredId?: string;
  pulse?: BrainPulse;
  onSelect: (id: string) => void;
  onHover: (id: string | undefined) => void;
};

const MODEL_URL = '/models/brain-dk.glb';
const SHELL_COLOR = new Color('#475569');
const TRACT_COLOR = '#e2e8f0';
const RESTING_FADE = 0.55;
const STEADY_GLOW = 0.2;
const PULSE_GLOW = 0.6;
const PULSE_DECAY = 4;

function centerOf(meshes: Mesh[], name: string) {
  const mesh = meshes.find((candidate) => candidate.name === name) as Object3D;
  return new Box3().setFromObject(mesh).getCenter(new Vector3());
}

function Brain({ activeIds, hoveredId, pulse, onSelect, onHover }: BrainCanvasProps) {
  const { scene } = useGLTF(MODEL_URL, false, true);
  const invalidate = useThree((state) => state.invalidate);
  const canvas = useThree((state) => state.gl.domElement);
  const litMaterials = useRef<MeshStandardMaterial[]>([]);
  const pulseStart = useRef(0);
  const signalRef = useRef<Mesh>(null);

  const meshes = useMemo(() => {
    const found: Mesh[] = [];
    scene.traverse((object) => {
      const mesh = object as Mesh;
      if (mesh.isMesh) {
        mesh.geometry.computeVertexNormals();
        mesh.material = new MeshStandardMaterial({ roughness: 0.85 });
        found.push(mesh);
      }
    });
    scene.updateMatrixWorld(true);
    return found;
  }, [scene]);

  const tract = useMemo(
    () =>
      new QuadraticBezierCurve3(
        centerOf(meshes, arcuateFasciculus.from),
        centerOf(meshes, arcuateFasciculus.via).add(new Vector3(0, 0.2, 0)),
        centerOf(meshes, arcuateFasciculus.to),
      ),
    [meshes],
  );
  const tractPoints = useMemo(() => tract.getPoints(32), [tract]);

  useEffect(() => {
    litMaterials.current = [];
    for (const mesh of meshes) {
      const region = findRegionByMesh(mesh.name);
      const material = mesh.material as MeshStandardMaterial;
      const active = region !== undefined && activeIds.includes(region.id);
      const lit = active || (region !== undefined && region.id === hoveredId);
      if (region && lit) {
        material.color.set(active && pulse ? pulse.color : region.color);
        material.emissive.copy(material.color);
        material.emissiveIntensity = STEADY_GLOW;
        litMaterials.current.push(material);
      } else {
        material.emissive.set('#000000');
        if (region && !pulse) {
          material.color.set(region.color).lerp(SHELL_COLOR, RESTING_FADE);
        } else {
          material.color.copy(SHELL_COLOR);
        }
      }
    }
    pulseStart.current = performance.now();
    canvas.style.cursor = hoveredId ? 'pointer' : 'grab';
    invalidate();
  }, [meshes, activeIds, hoveredId, pulse, canvas, invalidate]);

  useFrame(() => {
    if (!pulse) return;
    const elapsed = performance.now() - pulseStart.current;
    const glow = STEADY_GLOW + PULSE_GLOW * Math.exp((-PULSE_DECAY * elapsed) / 1000);
    for (const material of litMaterials.current) {
      material.emissiveIntensity = glow;
    }
    signalRef.current?.position.copy(tract.getPoint(Math.min(elapsed / pulse.ms, 1)));
  });

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
      {pulse && (
        <Line points={tractPoints} color={TRACT_COLOR} lineWidth={2} transparent opacity={0.5} depthTest={false} />
      )}
      {pulse?.signal && (
        <mesh ref={signalRef} renderOrder={1}>
          <sphereGeometry args={[0.035, 16, 16]} />
          <meshBasicMaterial color={pulse.color} depthTest={false} />
        </mesh>
      )}
    </>
  );
}

export function BrainCanvas(props: BrainCanvasProps) {
  return (
    <Canvas frameloop={props.pulse ? 'always' : 'demand'} camera={{ position: [-3.2, 0.4, 0], fov: 35 }}>
      <ambientLight intensity={0.9} />
      <directionalLight position={[-3, 3, 2]} intensity={1.8} />
      <directionalLight position={[3, 1, -2]} intensity={0.6} />
      <Suspense fallback={null}>
        <Brain {...props} />
      </Suspense>
      <OrbitControls enablePan={false} minDistance={2} maxDistance={6} />
    </Canvas>
  );
}
