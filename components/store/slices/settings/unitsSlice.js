import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  isF: false,
  selectedUnit: '',
};

const unitsSlice = createSlice({
  name: 'units',
  initialState,
  reducers: {
    handleSetUnits: (state, action) => {
      state.isF = action.payload;
    },
    handleUnitSelection: (state, action) => {
      state.selectedUnit = action.payload;
      if (action.payload === 0) {
        state.isF = true;
      } else state.isF = false;
    },
  },
});

export default unitsSlice;
export const selectUnits = (state) => state.units;
export const { handleSetUnits, handleUnitSelection } = unitsSlice.actions;
