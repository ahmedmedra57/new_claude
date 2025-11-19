import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  lowWindTemp: 0,
  medWindTemp: 0,
  highWindTemp: 0,
  extremeWindTemp: 0,
  windFactorSavedUnitIsF: false,
};

const windFactorSlice = createSlice({
  name: 'windFactor',
  initialState,
  reducers: {
    handleSetWindTemp: (state, action) => {
      state[action.payload.objectName] = action.payload.temp;
    },
  },
});

export default windFactorSlice;
export const selectWindFactor = (state) => state.windFactor;
export const { handleSetWindTemp } = windFactorSlice.actions;
