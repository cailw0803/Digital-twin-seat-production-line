'use client';

import useProductionStore from '@/store/useProductionStore';
import type { Seat } from '@/store/useProductionStore';

interface SeatProps {
  id: string;
  x: number;
}

function Seat({ x }: SeatProps) {
  return (
    <group position={[x, 1.5, 0]}>
      <mesh castShadow>
        <boxGeometry args={[2.5, 1.2, 2]} />
        <meshStandardMaterial color="#1e40af" metalness={0.4} roughness={0.6} />
      </mesh>

      <mesh position={[0, 1, 0]} castShadow>
        <boxGeometry args={[2.2, 0.8, 1.8]} />
        <meshStandardMaterial color="#1e3a8a" metalness={0.5} roughness={0.5} />
      </mesh>

      <mesh position={[0, 2, -0.6]} castShadow>
        <boxGeometry args={[1.8, 1.5, 0.3]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      <mesh position={[1.4, 0.3, 0]} castShadow>
        <boxGeometry args={[0.3, 0.6, 1.8]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[-1.4, 0.3, 0]} castShadow>
        <boxGeometry args={[0.3, 0.6, 1.8]} />
        <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

export default function SeatMesh() {
  const activeSeats = useProductionStore((state) => state.activeSeats);

  return (
    <group>
      {activeSeats.map((seat: Seat) => (
        <Seat key={seat.id} id={seat.id} x={seat.positionX} />
      ))}
    </group>
  );
}