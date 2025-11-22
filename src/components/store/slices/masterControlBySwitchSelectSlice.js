import { createSlice } from '@reduxjs/toolkit';

const initialData = {
  selectedOne: null,
  isAllSelected: false,

  isLocationSelected: [],
  isSpecificLocationSelected: [],
  isMachineSelected: [],

  selectedLocations: [],
  selectedSpecificLocations: [],
  selectedMachines: [],
  displaySelectBox: false,

  isApplied: false,
  inputTemp: 0,
  isF: false,
  scheduleList: [
    {
      start: { date: null, time: null },
      end: { date: null, time: null },
      inputTemp: null,
      isF: null,
    },
  ],
};

const initialState = {
  instantHeat: initialData,
  snowSensor: initialData,
  optionalConstant: initialData,
  heatingSchedule: initialData,
  windFactor: initialData,
  ats: initialData,
  shutOff: initialData,
  fanOnly: initialData,
};

const masterControlSelectBySwitchSlice = createSlice({
  name: 'masterControlSelectBySwitch',
  initialState,
  reducers: {
    // make selected result to display
    handleResetSelectedOne: (state) => {
      state.instantHeat.selectedOne = null;
      state.snowSensor.selectedOne = null;
      state.optionalConstant.selectedOne = null;
      state.heatingSchedule.selectedOne = null;
      state.windFactor.selectedOne = null;
      state.ats.selectedOne = null;
      state.shutOff.selectedOne = null;
      state.fanOnly.selectedOne = null;
    },
    handleSelectedOneBySwitch: (state, action) => {
      state[action.payload.controller].selectedOne = action.payload.selectedOne;
    },
    // select all locations at once
    handleSelectAllBySwitch: (state, action) => {
      // ALL = true
      state[action.payload.controller].isAllSelected = action.payload.status;
    },
    // select a location
    handleLocationSelectBySwitch: (state, action) => {
      state[action.payload.controller].isLocationSelected = action.payload.arr;
    },
    // select a location
    handleSpecificLocationSelectBySwitch: (state, action) => {
      state[action.payload.controller].isSpecificLocationSelected =
        action.payload.arr;
    },
    // select an individual machine
    handleMachineSelectBySwitch: (state, action) => {
      state[action.payload.controller].isMachineSelected = action.payload.arr;
    },
    // select machine by selected locations
    handleMachineSelectAllBySwitch: (state, action) => {
      state[action.payload.controller].isMachineSelected[
        action.payload.locationIdx
      ][action.payload.machineIdx] = true;
    },

    // Add selected location name
    handleAddLocationsBySwitch: (state, action) => {
      state[action.payload.controller].selectedLocations = action.payload.arr;
    },
    // Add selected specific location name
    handleAddSpecificLocationsBySwitch: (state, action) => {
      state[action.payload.controller].selectedSpecificLocations =
        action.payload.arr;
    },
    // Add selected machine name
    handleAddMachinesBySwitch: (state, action) => {
      state[action.payload.controller].selectedMachines = action.payload.arr;
    },
    handleMachineSelectAltBySwitch: (state, action) => {
      state[action.payload.controller].isMachineSelected[
        action.payload.locationIdx
      ][action.payload.machineIdx] = true;
    },
    handleMachineSelectWithSpecLocationAltBySwitch: (state, action) => {
      state[action.payload.controller].isMachineSelected[
        action.payload.locationIdx
      ][action.payload.specLocationIdx][action.payload.machineIdx] = true;
    },

    handleResetAllSelectBySwitch: (state, action) => {
      return { ...initialState };
    },
    // display box toggler
    handleDisplaySelectBoxBySwitch: (state, action) => {
      state[action.payload.controller].displaySelectBox =
        !state.displaySelectBox;
    },
    // for what??? no idea...
    handleDisplaySelectBoxWithActionBySwitch: (state, action) => {
      state.displaySelectBox = action.payload;
    },
    // instantHeat
    handleApplyWithTemp: (state, action) => {
      // change apply button state depends on controller name
      state[action.payload.controller].isApplied =
        !state[action.payload.controller].isApplied;
      // change input temp. depends on controller name
      state[action.payload.controller].inputTemp = action.payload.temp;
    },
    handleSetScheduleList: (state, action) => {
      state.heatingSchedule.scheduleList[action.payload.index] = {
        start: action.payload.start,
        end: action.payload.end,
        inputTemp: action.payload.inputTemp,
        isF: action.payload.isF,
      };

      state.heatingSchedule.scheduleList[action.payload.index + 1] = {
        start: { date: null, time: null },
        end: { date: null, time: null },
        inputTemp: null,
        isF: null,
      };
    },
  },
});

export default masterControlSelectBySwitchSlice;
export const selectMCBySwitch = (state) => state.masterControlSelectBySwitch;
export const {
  handleSelectAllBySwitch,
  handleSelectedOneBySwitch,
  handleLocationSelectBySwitch,
  handleSpecificLocationSelectBySwitch,
  handleMachineSelectBySwitch,
  handleAddLocationsBySwitch,
  handleAddSpecificLocationsBySwitch,
  handleAddMachinesBySwitch,
  handleMachineSelectAllBySwitch,
  handleResetAllSelectBySwitch,
  handleDisplaySelectBoxBySwitch,
  handleDisplaySelectBoxWithActionBySwitch,
  handleMachineSelectAltBySwitch,
  handleMachineSelectWithSpecLocationAltBySwitch,

  handleApplyWithTemp,
  handleSetSchedule,
  handleResetSelectedOne,
} = masterControlSelectBySwitchSlice.actions;
