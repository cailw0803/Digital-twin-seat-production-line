'use client';

import useProductionStore, { Station } from '@/store/useProductionStore';
import { AlertTriangle, Zap } from 'lucide-react';

interface StationCardProps {
  station: Station;
  onInjectFault: (id: string) => void;
}

function StationCard({ station, onInjectFault }: StationCardProps) {
  const isProcessing = station.status === 'processing';
  const isError = station.status === 'error';

  const statusColor = isProcessing
    ? 'border-emerald-500 ring-2 ring-emerald-100'
    : isError
    ? 'border-rose-500 ring-2 ring-rose-100'
    : 'border-gray-200';

  const bgColor = isProcessing
    ? 'bg-gradient-to-br from-emerald-50 to-white'
    : isError
    ? 'bg-gradient-to-br from-rose-50 to-white'
    : 'bg-white';

  const statusText = isProcessing
    ? '加工中'
    : isError
    ? '故障停机'
    : '等待中';

  const statusTextColor = isProcessing
    ? 'text-emerald-600'
    : isError
    ? 'text-rose-600'
    : 'text-gray-500';

  return (
    <div
      className={`relative overflow-hidden rounded-xl border-2 ${statusColor} ${bgColor} p-4 transition-all duration-300 shadow-sm hover:shadow-md`}
    >
      {isProcessing && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-100/50 to-transparent animate-pulse" />
      )}

      {isError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full bg-rose-50/50 animate-pulse" />
        </div>
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-gray-800 select-none">{station.name}</span>
          <span className={`text-sm font-medium ${statusTextColor} select-none`}>
            {statusText}
          </span>
        </div>

        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>进度</span>
            <span>{station.currentProgress.toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isProcessing
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                  : isError
                  ? 'bg-gradient-to-r from-rose-500 to-rose-400'
                  : 'bg-gray-400'
              }`}
              style={{ width: `${station.currentProgress}%` }}
            />
          </div>
        </div>

        {isError && (
          <div className="flex items-center gap-2 text-rose-600 text-sm mb-3">
            <AlertTriangle className="w-4 h-4" />
            <span>故障码: {station.faultCode}</span>
          </div>
        )}

        <button
          onClick={() => onInjectFault(station.id)}
          disabled={isError}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm ${
            isError
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-rose-500 hover:bg-rose-600 text-white'
          }`}
        >
          <Zap className="w-4 h-4" />
          {isError ? '已故障' : '注入故障'}
        </button>
      </div>
    </div>
  );
}

export default function StationMonitor() {
  const { stations, injectFault } = useProductionStore();

  return (
    <div className="grid grid-cols-5 gap-4 pointer-events-auto">
      {stations.map((station: Station) => (
        <StationCard
          key={station.id}
          station={station}
          onInjectFault={injectFault}
        />
      ))}
    </div>
  );
}