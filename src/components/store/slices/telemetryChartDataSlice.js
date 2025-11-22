import { createSlice } from '@reduxjs/toolkit';

const initialState = {
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
};

const telemetryChartDataSlice = createSlice({
  name: 'telemetryChartData',
  initialState,
  reducers: {
    setTelemetryChartData: (state, action) => {
      Object.keys(action.payload.data).forEach((objectKey) => {
        state[action.payload.swtName][objectKey] =
          action.payload.data[objectKey];
      });
    },
    setTelemetryIntervalUnit: (state, action) => {
      state.intervalUnit = action.payload;
    },
  },
});

export default telemetryChartDataSlice;
export const selectTelemetryChartData = (state) => state.telemetryChartData;
export const { setTelemetryChartData, setTelemetryIntervalUnit } =
  telemetryChartDataSlice.actions;
