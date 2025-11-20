import { createStore } from './storeUtils';

const useTelemetryStore = createStore('telemetry', (set) => ({
  isSearch: false,
  selectChartSystem: false,
  totalHours: 0,
  totalConsumption: 0,
  auditLogData: {},

  setSearchTelemetrySystem: (isSearch) => set({ isSearch }),
  setSelectChartSystem: (selectChartSystem) => set({ selectChartSystem }),
  setTotalHoursTelemetry: (totalHours) => set({ totalHours }),
  setTotalConsumptionTelemetry: (totalConsumption) => set({ totalConsumption }),
  setAuditLogData: (auditLogData) => set({ auditLogData }),
}));

export default useTelemetryStore;
