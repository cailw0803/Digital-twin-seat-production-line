'use client';

import { useEffect, useState } from 'react';
import useProductionStore, { Station } from '@/store/useProductionStore';
import { Play, Pause, RotateCcw } from 'lucide-react';

export default function Header() {
  const [currentTime, setCurrentTime] = useState('');
  const { lineStatus, startLine, pauseLine, stations, resolveFault } = useProductionStore();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRecovery = () => {
    stations.forEach((station: Station) => {
      if (station.status === 'error') {
        resolveFault(station.id);
      }
    });
    if (lineStatus !== 'running') {
      startLine();
    }
  };

  return (
    <header className="relative z-10 flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200 shadow-sm">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-wide">
          座椅生产线数字孪生控制中心
        </h1>
        <p className="text-sm text-gray-500 mt-1">Digital Twin Production Control System</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <div className="text-2xl font-mono text-emerald-600">{currentTime}</div>
          <div className="text-xs text-gray-400">SYSTEM TIME</div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={startLine}
            disabled={lineStatus === 'running'}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 shadow-sm"
          >
            <Play className="w-4 h-4" />
            启动
          </button>

          <button
            onClick={pauseLine}
            disabled={lineStatus !== 'running' && lineStatus !== 'fault'}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 shadow-sm"
          >
            <Pause className="w-4 h-4" />
            暂停
          </button>

          <button
            onClick={handleRecovery}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-all duration-200 shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            一键恢复
          </button>
        </div>
      </div>
    </header>
  );
}