'use client';

import dynamic from 'next/dynamic';
import SceneContainer from './SceneContainer';
import ConveyorBelt from './ConveyorBelt';
import SeatMesh from './SeatMesh';
import type { StationStatus } from '@/store/useProductionStore';

interface StationInfo {
  id: string;
  name: string;
  positionX: number;
  status: StationStatus;
}

const RoboticArms = dynamic(
  () => import('./RoboticArms').then((mod) => mod.default),
  { ssr: false }
);

export default function DigitalTwinScene({
  onStationSelect,
}: {
  onStationSelect: (info: StationInfo | null) => void;
}) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'auto',
      }}
    >
      <SceneContainer>
        <ConveyorBelt />
        <SeatMesh />
        <RoboticArms onSelect={onStationSelect} />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[50, -2, 0]} receiveShadow>
          <planeGeometry args={[200, 50]} />
          <meshStandardMaterial color="#e2e8f0" roughness={1} />
        </mesh>
      </SceneContainer>
    </div>
  );
}