'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/dashboard/Header';
import MetricCards from '@/components/dashboard/MetricCards';
import StationMonitor from '@/components/dashboard/StationMonitor';
import { X, Activity, Thermometer, Zap, Gauge, Timer } from 'lucide-react';
import type { StationStatus } from '@/store/useProductionStore';

interface StationInfo {
  id: string;
  name: string;
  positionX: number;
  status: StationStatus;
}

const DigitalTwinScene = dynamic(
  () => import('@/components/three/DigitalTwinScene'),
  { ssr: false }
);

function StationDetailPanel({
  station,
  onClose,
}: {
  station: StationInfo;
  onClose: () => void;
}) {
  const seed = station.id.charCodeAt(station.id.length - 1);
  const data = {
    cycleTime: (20 + (seed % 10)).toFixed(1),
    temp: (35 + (seed % 15)).toFixed(1),
    vibration: (0.5 + (seed % 20) / 10).toFixed(2),
    frequency: (50 + (seed % 20)).toFixed(1),
  };

  return (
    <div className="absolute right-6 top-1/2 -translate-y-1/2 w-80 bg-white border border-gray-200 rounded-xl p-5 z-20 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">{station.name}</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between py-2 border-b border-gray-200">
          <div className="flex items-center gap-2 text-gray-500">
            <Activity className="w-4 h-4" />
            <span className="text-sm">设备状态</span>
          </div>
          <span
            className={`text-sm font-medium ${
              station.status === 'processing'
                ? 'text-emerald-600'
                : station.status === 'error'
                ? 'text-rose-600'
                : 'text-gray-500'
            }`}
          >
            {station.status === 'processing'
              ? '加工中'
              : station.status === 'error'
              ? '故障停机'
              : '等待中'}
          </span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-gray-200">
          <div className="flex items-center gap-2 text-gray-500">
            <Timer className="w-4 h-4" />
            <span className="text-sm">节拍时间</span>
          </div>
          <span className="text-sm font-mono text-gray-700">{data.cycleTime}s</span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-gray-200">
          <div className="flex items-center gap-2 text-gray-500">
            <Thermometer className="w-4 h-4" />
            <span className="text-sm">电机温度</span>
          </div>
          <span className="text-sm font-mono text-gray-700">{data.temp}°C</span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-gray-200">
          <div className="flex items-center gap-2 text-gray-500">
            <Zap className="w-4 h-4" />
            <span className="text-sm">振动频率</span>
          </div>
          <span className="text-sm font-mono text-gray-700">{data.vibration}Hz</span>
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2 text-gray-500">
            <Gauge className="w-4 h-4" />
            <span className="text-sm">运行频率</span>
          </div>
          <span className="text-sm font-mono text-gray-700">{data.frequency}Hz</span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [selectedStation, setSelectedStation] = useState<StationInfo | null>(null);

  return (
    <div className="relative min-h-screen bg-gray-50 overflow-hidden">
      <div className="fixed inset-0 z-0">
        <DigitalTwinScene onStationSelect={setSelectedStation} />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6 space-y-6">
          <MetricCards />
          <StationMonitor />
        </main>
      </div>

      {selectedStation && (
        <StationDetailPanel
          station={selectedStation}
          onClose={() => setSelectedStation(null)}
        />
      )}
    </div>
  );
}