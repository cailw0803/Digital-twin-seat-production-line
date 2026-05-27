'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import useProductionStore, { StationStatus } from '@/store/useProductionStore';
import * as THREE from 'three';

interface StationInfo {
  id: string;
  name: string;
  positionX: number;
  status: StationStatus;
}

interface RoboticArmProps {
  station: StationInfo;
  onSelect: (info: StationInfo) => void;
}

function RoboticArm({ station, onSelect }: RoboticArmProps) {
  const armRef = useRef<THREE.Group>(null);
  const forearmRef = useRef<THREE.Group>(null);
  const isProcessing = station.status === 'processing';
  const isError = station.status === 'error';
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    if (isProcessing) {
      timeRef.current += delta * 8;
      if (armRef.current) {
        armRef.current.rotation.z = Math.sin(timeRef.current) * 0.4;
      }
      if (forearmRef.current) {
        forearmRef.current.rotation.z = Math.sin(timeRef.current * 1.5 + 1) * 0.6;
        forearmRef.current.position.y = 6 + Math.sin(timeRef.current * 2) * 0.8;
      }
    } else {
      if (armRef.current) {
        armRef.current.rotation.z = THREE.MathUtils.lerp(armRef.current.rotation.z, 0, 0.1);
      }
      if (forearmRef.current) {
        forearmRef.current.rotation.z = THREE.MathUtils.lerp(forearmRef.current.rotation.z, -0.5, 0.1);
        forearmRef.current.position.y = THREE.MathUtils.lerp(forearmRef.current.position.y, 5.5, 0.1);
      }
    }
  });

  const baseColor = isError ? '#dc2626' : isProcessing ? '#10b981' : '#475569';
  const armColor = isError ? '#ef4444' : isProcessing ? '#34d399' : '#64748b';

  return (
    <group position={[station.positionX, 0, 6]} onClick={() => onSelect(station)}>
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[6, 2, 6]} />
        <meshStandardMaterial color="#334155" roughness={0.7} />
      </mesh>

      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[1.5, 2, 1.5, 16]} />
        <meshStandardMaterial color={baseColor} metalness={0.6} roughness={0.4} />
      </mesh>

      <group ref={armRef} position={[0, 3.5, 0]}>
        <mesh position={[0, 1.5, 0]} castShadow>
          <boxGeometry args={[1.2, 3, 1.2]} />
          <meshStandardMaterial color={armColor} metalness={0.7} roughness={0.3} />
        </mesh>

        <group ref={forearmRef} position={[0, 3, 0]}>
          <mesh position={[0, 1.2, 0]} castShadow>
            <boxGeometry args={[1, 2.5, 1]} />
            <meshStandardMaterial color={armColor} metalness={0.7} roughness={0.3} />
          </mesh>

          <mesh position={[0, 2.6, 0]}>
            <boxGeometry args={[1.5, 0.8, 2]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      </group>

      <pointLight
        position={[0, 8, 0]}
        intensity={isProcessing ? 2 : 0}
        color={isError ? '#ef4444' : '#10b981'}
        distance={10}
      />
    </group>
  );
}

export default function RoboticArms({ onSelect }: { onSelect: (info: StationInfo) => void }) {
  const stations = useProductionStore((state) => state.stations);

  const stationInfos: StationInfo[] = stations.map((s: { id: string; name: string; positionX: number; status: StationStatus }) => ({
    id: s.id,
    name: s.name,
    positionX: s.positionX,
    status: s.status,
  }));

  return (
    <group>
      {stationInfos.map((station: StationInfo) => (
        <RoboticArm key={station.id} station={station} onSelect={onSelect} />
      ))}
    </group>
  );
}