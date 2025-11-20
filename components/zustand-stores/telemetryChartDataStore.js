import { createStore } from './storeUtils';

const useTelemetryChartDataStore = createStore('telemetryChartData', (set) => ({
  intervalUnit: '',
  essDataConsumpData: {
    dailyData: [],
    dailyKeys: [],
  },
  tesDataConsumpData: {
    dailyData: [],
    dailyKeys: [],
  },
  tgsDataConsumpData: {
    dailyData: [],
    dailyKeys: [],
  },
  hpDataConsumpData: {
    dailyData: [],
    dailyKeys: [],
  },

  setTelemetryChartData: ({ swtName, data }) => set((state) => {
    Object.keys(data).forEach((objectKey) => {
      state[swtName][objectKey] = data[objectKey];
    });
  }),

  setTelemetryIntervalUnit: (intervalUnit) => set({ intervalUnit }),
}));

export default useTelemetryChartDataStore;
