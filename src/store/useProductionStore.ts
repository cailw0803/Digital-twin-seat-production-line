import { create } from 'zustand';

export type LineStatus = 'running' | 'paused' | 'fault';
export type StationStatus = 'idle' | 'processing' | 'error';

export interface Station {
  id: string;
  name: string;
  status: StationStatus;
  currentProgress: number;
  faultCode?: string;
  positionX: number;
}

export interface Seat {
  id: string;
  positionX: number;
  stageIndex: number;
}

export interface Metrics {
  oee: number;
  output: number;
  target: number;
  yieldRate: number;
  availability: number;
  performance: number;
  quality: number;
}

interface ProductionState {
  lineStatus: LineStatus;
  stations: Station[];
  metrics: Metrics;
  activeSeats: Seat[];
  seatIdCounter: number;
  timer: NodeJS.Timeout | null;

  startLine: () => void;
  pauseLine: () => void;
  injectFault: (stationId: string) => void;
  resolveFault: (stationId: string) => void;
}

const STATION_POSITIONS = [15, 35, 55, 75, 90];
const STATION_ZONE = 12;
const SEAT_SPEED = 0.15;

const INITIAL_STATIONS: Station[] = [
  { id: 'station-1', name: '框架组装', status: 'idle', currentProgress: 0, positionX: STATION_POSITIONS[0] },
  { id: 'station-2', name: '坐垫安装', status: 'idle', currentProgress: 0, positionX: STATION_POSITIONS[1] },
  { id: 'station-3', name: '扶手安装', status: 'idle', currentProgress: 0, positionX: STATION_POSITIONS[2] },
  { id: 'station-4', name: '质量检测', status: 'idle', currentProgress: 0, positionX: STATION_POSITIONS[3] },
  { id: 'station-5', name: '下线包装', status: 'idle', currentProgress: 0, positionX: STATION_POSITIONS[4] },
];

const INITIAL_METRICS: Metrics = {
  oee: 85.5,
  output: 0,
  target: 1000,
  yieldRate: 98.2,
  availability: 92.0,
  performance: 95.5,
  quality: 98.8,
};

const useProductionStore = create<ProductionState>((set, get) => ({
  lineStatus: 'paused',
  stations: INITIAL_STATIONS,
  metrics: { ...INITIAL_METRICS },
  activeSeats: [],
  seatIdCounter: 1,
  timer: null,

  startLine: () => {
    const state = get();
    if (state.lineStatus === 'running') return;

    set({ lineStatus: 'running' });

    const tick = () => {
      const currentState = get();
      if (currentState.lineStatus !== 'running') return;

      set((state) => {
        let newSeats = [...state.activeSeats];
        let newStations = state.stations.map(s => ({ ...s, currentProgress: 0 }));
        const newMetrics = { ...state.metrics };

        if (newSeats.length === 0 || newSeats[newSeats.length - 1].positionX > 20) {
          const newSeat: Seat = {
            id: `seat-${state.seatIdCounter}`,
            positionX: 0,
            stageIndex: 0,
          };
          newSeats.push(newSeat);
        }

        newSeats = newSeats.map(seat => ({
          ...seat,
          positionX: seat.positionX + SEAT_SPEED,
        }));

        newStations = newStations.map(station => {
          const seatInZone = newSeats.find(
            seat => Math.abs(seat.positionX - station.positionX) < STATION_ZONE
          );
          if (seatInZone) {
            const progress = Math.min(100, ((seatInZone.positionX - (station.positionX - STATION_ZONE)) / (STATION_ZONE * 2)) * 100);
            return {
              ...station,
              status: station.status === 'error' ? 'error' : 'processing',
              currentProgress: progress,
            };
          }
          return {
            ...station,
            status: station.status === 'error' ? 'error' : 'idle',
            currentProgress: 0,
          };
        });

        const completedSeats = newSeats.filter(seat => seat.positionX > 110);
        if (completedSeats.length > 0) {
          newSeats = newSeats.filter(seat => seat.positionX <= 110);
          newMetrics.output += completedSeats.length;

          const fluctuation = (Math.random() - 0.5) * 0.3;
          newMetrics.yieldRate = Math.min(99.5, Math.max(96.0, newMetrics.yieldRate + fluctuation));

          const oeeFluctuation = (Math.random() - 0.5) * 0.5;
          newMetrics.oee = Math.min(95, Math.max(75, newMetrics.oee + oeeFluctuation));

          newMetrics.availability = Math.min(98, Math.max(85, newMetrics.availability + (Math.random() - 0.5) * 0.3));
          newMetrics.performance = Math.min(98, Math.max(90, newMetrics.performance + (Math.random() - 0.5) * 0.2));
          newMetrics.quality = Math.min(99.5, Math.max(97, newMetrics.quality + (Math.random() - 0.5) * 0.1));
        }

        return {
          activeSeats: newSeats,
          stations: newStations,
          metrics: newMetrics,
          seatIdCounter: state.seatIdCounter + (completedSeats.length > 0 ? completedSeats.length : 0),
        };
      });

      const nextState = get();
      if (nextState.lineStatus === 'running') {
        const timeoutId = setTimeout(tick, 50);
        set({ timer: timeoutId });
      }
    };

    const timeoutId = setTimeout(tick, 50);
    set({ timer: timeoutId });
  },

  pauseLine: () => {
    const state = get();
    if (state.timer) {
      clearTimeout(state.timer);
    }
    set({ lineStatus: 'paused', timer: null });
  },

  injectFault: (stationId: string) => {
    set((state) => ({
      lineStatus: 'fault',
      stations: state.stations.map(s =>
        s.id === stationId
          ? { ...s, status: 'error' as StationStatus, faultCode: 'E001' }
          : s
      ),
    }));
  },

  resolveFault: (stationId: string) => {
    set((state) => ({
      stations: state.stations.map(s =>
        s.id === stationId
          ? { ...s, status: 'idle' as StationStatus, faultCode: undefined }
          : s
      ),
      lineStatus: 'paused',
    }));
  },
}));

export default useProductionStore;