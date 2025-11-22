import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  essSnowSensorTemp: 0,
  tgsSnowSensorTemp: 0,
  tesSnowSensorTemp: 0,
  snowSensorSavedUnitIsF: false,
};

const snowSensorSlice = createSlice({
  name: 'snowSensor',
  initialState,
  reducers: {
    handleSnowSensorTemp: (state, action) => {
      state[action.payload.keyName] = action.payload.value;
    },
  },
});

export default snowSensorSlice;
export const selectSnowSensor = (state) => state.snowSensor;
export const { handleSnowSensorTemp } = snowSensorSlice.actions;
