'use client';

import useProductionStore from '@/store/useProductionStore';
import { Gauge, Package, Target, Percent } from 'lucide-react';

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  isActive: boolean;
  color: string;
}

function MetricCard({ icon, label, value, unit, isActive, color }: MetricCardProps) {
  const displayValue = value;

  return (
    <div className={`relative overflow-hidden bg-white border border-gray-200 rounded-xl p-5 transition-all duration-300 shadow-sm hover:shadow-md ${isActive ? 'ring-2 ring-emerald-400' : ''}`}>
      {isActive && (
        <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-5`} />
      )}

      <div className="relative z-10 flex items-start justify-between">
        <div>
          <div className="text-gray-500 text-sm font-medium mb-1 select-none">{label}</div>
          <div className={`text-3xl font-bold font-mono select-none ${color.replace('from-', 'text-').replace('-400', '-600')}`}>
            {typeof displayValue === 'number' ? displayValue.toFixed(1) : displayValue}
            {unit && <span className="text-lg ml-1 text-gray-500">{unit}</span>}
          </div>
        </div>
        <div className={`p-2 rounded-lg bg-gray-100 ${color.replace('from-', 'text-').replace('-400', '-600')}`}>
          {icon}
        </div>
      </div>

      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-400" />
      )}
    </div>
  );
}

export default function MetricCards() {
  const metrics = useProductionStore((state) => state.metrics);
  const lineStatus = useProductionStore((state) => state.lineStatus);
  const isRunning = lineStatus === 'running';

  return (
    <div className="grid grid-cols-4 gap-4 pointer-events-auto">
      <MetricCard
        icon={<Gauge className="w-5 h-5" />}
        label="设备综合效率 OEE"
        value={metrics.oee}
        unit="%"
        isActive={isRunning}
        color="from-emerald-500"
      />
      <MetricCard
        icon={<Package className="w-5 h-5" />}
        label="当前总产量"
        value={metrics.output}
        unit="台"
        isActive={isRunning}
        color="from-blue-500"
      />
      <MetricCard
        icon={<Target className="w-5 h-5" />}
        label="目标产量"
        value={metrics.target}
        unit="台"
        isActive={false}
        color="from-amber-500"
      />
      <MetricCard
        icon={<Percent className="w-5 h-5" />}
        label="合格率"
        value={metrics.yieldRate}
        unit="%"
        isActive={isRunning}
        color="from-purple-500"
      />
    </div>
  );
}