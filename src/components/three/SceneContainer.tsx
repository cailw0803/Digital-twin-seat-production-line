'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { ReactNode } from 'react';

interface SceneContainerProps {
  children: ReactNode;
}

export default function SceneContainer({ children }: SceneContainerProps) {
  return (
    <Canvas
      shadows
      camera={{ position: [50, 40, 80], fov: 50 }}
      gl={{ antialias: true }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'auto',
      }}
    >
      <color attach="background" args={['#f8fafc']} />
      <fog attach="fog" args={['#f8fafc', 80, 250]} />

      <ambientLight intensity={0.6} />
      <directionalLight
        position={[30, 50, 20]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <pointLight position={[-20, 30, -20]} intensity={0.3} color="#3b82f6" />

      <Grid
        position={[50, -2, 0]}
        args={[200, 50]}
        cellSize={5}
        cellThickness={0.5}
        cellColor="#94a3b8"
        sectionSize={20}
        sectionThickness={1}
        sectionColor="#64748b"
        fadeDistance={150}
        fadeStrength={1}
        followCamera={false}
      />

      <OrbitControls
        enablePan={false}
        enableDamping
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.1}
        minDistance={40}
        maxDistance={120}
      />

      {children}
    </Canvas>
  );
}