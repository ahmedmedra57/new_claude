import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  instantHeat: false,
  snowSensor: false,
  fanOnly: false,
  windFactor: false,
  optionalConstantTemp: false,
  ats: false,
  shutOff: false,
  heatingSchedule: false,
};

const mobileSelectProgramSlice = createSlice({
  name: 'selectedProgram',
  initialState,
  reducers: {
    handleSelectProgram: (state, action) => {
      state[action.payload] = !state[action.payload];
    },
    handleUnselectAllProgram: () => initialState,
  },
});

export default mobileSelectProgramSlice;
export const selectedProgram = (state) => state.selectedProgram;
export const { handleSelectProgram, handleUnselectAllProgram } =
  mobileSelectProgramSlice.actions;
