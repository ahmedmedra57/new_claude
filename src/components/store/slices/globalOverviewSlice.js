import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedSystem: null,
  displaySystemDetails: [true, true, true, true, true],
};

const globalOverviewSlice = createSlice({
  name: 'globalOverview',
  initialState,
  reducers: {
    handleSelectDisplaySystem: (state, action) => {
      state.selectedSystem = action.payload;
    },
    handleDisplaySystemDetails: (state, action) => {
      state.displaySystemDetails = action.payload;
    },
    handleResetMapSelection: () => initialState,
  },
});

export default globalOverviewSlice;
export const selectGlobalOverview = (state) => state.globalOverview;
export const {
  handleSelectDisplaySystem,
  handleDisplaySystemDetails,
  handleResetMapSelection,
} = globalOverviewSlice.actions;
