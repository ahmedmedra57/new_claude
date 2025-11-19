import { createSlice } from '@reduxjs/toolkit';

const MCIsExpandedSlice = createSlice({
  name: 'isExpanded',
  initialState: {
    ess: {
      masterControl: true,
      locationMasterControl: [],
      specificLocationMasterControl: [],
      isLocationOpen: [],
      isSpecificLocationOpen: [],
    },
    tgs: {
      masterControl: true,
      locationMasterControl: [],
      specificLocationMasterControl: [],
      isLocationOpen: [],
      isSpecificLocationOpen: [],
    },
    tes: {
      masterControl: true,
      locationMasterControl: [],
      specificLocationMasterControl: [],
      isLocationOpen: [],
      isSpecificLocationOpen: [],
    },
    hp: { masterControl: false, isLocationOpen: [] },
    ate: { masterControl: false, isLocationOpen: [] },
  },
  reducers: {
    setOpenLocationInitialStateHandler: (state, action) => {
      state[action.payload.swtSystem].isLocationOpen = action.payload.locations;
      state[action.payload.swtSystem].locationMasterControl =
        action.payload.locations;
    },
    setOpenSpecificLocationInitialStateHandler: (state, action) => {
      state[action.payload.swtSystem].isSpecificLocationOpen =
        action.payload.specificLocations;
      state[action.payload.swtSystem].specificLocationMasterControl =
        action.payload.specificLocations;
    },

    handleEssInitialState: (state, action) => {
      state.ess.isLocationOpen = action.payload;
    },
    handleTgsInitialState: (state, action) => {
      state.tgs.isLocationOpen = action.payload;
    },
    handleTgsSpecificLocationInitialState: (state, action) => {
      state.tgs.isSpecificLocationOpen = action.payload;
    },
    handleTesInitialState: (state, action) => {
      state.tes.isLocationOpen = action.payload;
    },
    handleTesSpecificLocationInitialState: (state, action) => {
      state.tes.isSpecificLocationOpen = action.payload;
    },
    handleOpenLocation: (state, action) => {
      state[action.payload.swtName].isLocationOpen[action.payload.index] =
        action.payload.status;
    },
    handleOpenSpecificLocation: (state, action) => {
      state[action.payload.swtName].isSpecificLocationOpen[
        action.payload.openSpecificLocationIdx
      ] = action.payload.status;
    },
    handleOpenMasterControl: (state, action) => {
      state[action.payload.swtName].masterControl = action.payload.status;
    },
    handleOpenLocationMasterControl: (state, action) => {
      state[action.payload.swtName].locationMasterControl[
        action.payload.locationIdx
      ] = action.payload.status;
    },
    handleOpenSpecificLocationMasterControl: (state, action) => {
      state[action.payload.swtName].specificLocationMasterControl[
        action.payload.locationIdx
      ] = action.payload.status;
    },
  },
});

export default MCIsExpandedSlice;
export const selectMCIsExpanded = (state) => state.isExpanded;
export const {
  setOpenLocationInitialStateHandler,
  setOpenSpecificLocationInitialStateHandler,
  handleEssInitialState,
  handleTgsInitialState,
  handleTesInitialState,
  handleTgsSpecificLocationInitialState,
  handleTesSpecificLocationInitialState,
  handleOpenSpecificLocation,
  handleOpenLocation,
  handleOpenMasterControl,
  handleOpenLocationMasterControl,
  handleOpenSpecificLocationMasterControl,
} = MCIsExpandedSlice.actions;
