import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSearch: false,
  selectChartSystem: false,
  totalHours: 0,
  totalConsumption: 0,
  auditLogData: {},
};

const telemetrySlice = createSlice({
  name: 'telemetry',
  initialState: initialState,
  reducers: {
    handleSearchTelemetrySystem: (state, action) => {
      state.isSearch = action.payload;
    },
    // this toggles the chart to singe or double sided. this should depending on the year or years selected on the calender.
    handleSelectChartSystem: (state, action) => {
      state.selectChartSystem = action.payload;
    },
    handleTotalHoursTelemetry: (state, action) => {
      state.totalHours = action.payload;
    },
    handleTotalConsumptionTelemetry: (state, action) => {
      state.totalConsumption = action.payload;
    },
    handleAuditLogData: (state, action) => {
      state.auditLogData = action.payload;
    },
  },
});

export default telemetrySlice;
export const selectTelemetry = (state) => state.telemetry;
export const { 
  handleSearchTelemetrySystem,
  handleSelectChartSystem,
  handleTotalHoursTelemetry,
  handleTotalConsumptionTelemetry,
  handleAuditLogData,
} = telemetrySlice.actions;
