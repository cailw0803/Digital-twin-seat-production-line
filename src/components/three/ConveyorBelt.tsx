'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ConveyorBelt() {
  const textureRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((_, delta) => {
    if (textureRef.current && textureRef.current.map) {
      textureRef.current.map.offset.x += delta * 0.3;
    }
  });

  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(0, 0, 256, 64);
  ctx.fillStyle = '#cbd5e1';
  for (let i = 0; i < 32; i++) {
    if (i % 2 === 0) ctx.fillRect(i * 8, 0, 4, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(8, 1);

  return (
    <group>
      <mesh position={[50, -0.5, 0]} receiveShadow>
        <boxGeometry args={[140, 0.5, 12]} />
        <meshStandardMaterial
          ref={textureRef}
          map={texture}
          color="#94a3b8"
          roughness={0.6}
        />
      </mesh>

      <mesh position={[50, -0.1, -6.5]}>
        <boxGeometry args={[140, 0.2, 1]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>
      <mesh position={[50, -0.1, 6.5]}>
        <boxGeometry args={[140, 0.2, 1]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
      </mesh>

      {[-10, 10, 30, 50, 70, 90, 110].map((x, i) => (
        <group key={i} position={[x, 0.25, 0]}>
          <mesh>
            <cylinderGeometry args={[0.4, 0.4, 0.5, 16]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.3, 0.3, 0.2, 12]} />
            <meshStandardMaterial
              color="#f59e0b"
              emissive="#f59e0b"
              emissiveIntensity={0.4}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}