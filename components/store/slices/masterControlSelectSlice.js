import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  displaySelectBox: false,
  ess: {
    selectedOne: null,
    isAllSelected: false,
    isLocationSelected: [],
    isSpecificLocationSelected: [],
    isMachineSelected: [],
    selectedMachines: [],
    selectedLocations: [],
    selectedSpecificLocations: [],
  },
  tes: {
    selectedOne: null,
    isAllSelected: false,
    isLocationSelected: [],
    isSpecificLocationSelected: [],
    isMachineSelected: [],
    selectedMachines: [],
    selectedLocations: [],
    selectedSpecificLocations: [],
  },
  tgs: {
    selectedOne: null,
    isAllSelected: false,
    isLocationSelected: [],
    isSpecificLocationSelected: [],
    isMachineSelected: [],
    selectedMachines: [],
    selectedLocations: [],
    selectedSpecificLocations: [],
  },
  hp: {
    selectedOne: null,
    isAllSelected: false,
    isLocationSelected: [],
    isSpecificLocationSelected: [],
    isMachineSelected: [],
    selectedMachines: [],
    selectedLocations: [],
    selectedSpecificLocations: [],
  },
  hpEc: {
    selectedOne: null,
    isAllSelected: false,
    isLocationSelected: [],
    isSpecificLocationSelected: [],
    isMachineSelected: [],
    selectedMachines: [],
    selectedLocations: [],
    selectedSpecificLocations: [],
  },
  hpGc: {
    selectedOne: null,
    isAllSelected: false,
    isLocationSelected: [],
    isSpecificLocationSelected: [],
    isMachineSelected: [],
    selectedMachines: [],
    selectedLocations: [],
    selectedSpecificLocations: [],
  },
  essDc: {
    selectedOne: null,
    isAllSelected: false,
    isLocationSelected: [],
    isSpecificLocationSelected: [],
    isMachineSelected: [],
    selectedMachines: [],
    selectedLocations: [],
    selectedSpecificLocations: [],
  },
  // tesDc: {
  //   selectedOne: null,
  //   isAllSelected: false,
  //   isLocationSelected: [],
  //   isMachineSelected: [],
  //   selectedMachines: [],
  //   selectedLocations: [],
  // },
  tgsTesDc: {
    selectedOne: null,
    isAllSelected: false,
    isLocationSelected: [],
    isSpecificLocationSelected: [],
    isMachineSelected: [],
    selectedMachines: [],
    selectedLocations: [],
    selectedSpecificLocations: [],
  },
  hpDc: {
    selectedOne: null,
    isAllSelected: false,
    isLocationSelected: [],
    isSpecificLocationSelected: [],
    isMachineSelected: [],
    selectedMachines: [],
    selectedLocations: [],
    selectedSpecificLocations: [],
  },
};

const masterControlSelectSlice = createSlice({
  name: 'masterControlSelect',
  initialState,
  reducers: {
    handleSelectedOne: (state, action) => {
      state[action.payload.switch].selectedOne = action.payload.selectedOne;
    },
    handleSelectAll: (state, action) => {
      state[action.payload.switch].isAllSelected = action.payload.status;
    },
    handleLocationSelect: (state, action) => {
      state[action.payload.switch].isLocationSelected = action.payload.arr;
    },
    handleSpecificLocationSelect: (state, action) => {
      state[action.payload.switch].isSpecificLocationSelected =
        action.payload.arr;
    },
    handleMachineSelect: (state, action) => {
      state[action.payload.switch].isMachineSelected = action.payload.arr;
    },
    handleAddLocations: (state, action) => {
      state[action.payload.switch].selectedLocations = action.payload.arr;
    },
    handleAddSpecificLocations: (state, action) => {
      state[action.payload.switch].selectedSpecificLocations =
        action.payload.arr;
    },
    handleAddMachines: (state, action) => {
      state[action.payload.switch].selectedMachines = action.payload.arr;
    },
    handleLocationSelectAlt: (state, action) => {
      state[action.payload.sys].isLocationSelected[
        action.payload.locationIdx
      ] = true;
    },
    handleSpecificLocationSelectAlt: (state, action) => {
      state[action.payload.sys].isSpecificLocationSelected[
        action.payload.locationIdx
      ][action.payload.specificLocationIdx] = true;
    },

    handleMachineSelectAlt: (state, action) => {
      state[action.payload.switch].isMachineSelected[
        action.payload.locationIdx
      ][action.payload.machineIdx] = true;
    },
    handleMachineSelectWithSpecLocationAlt: (state, action) => {
      console.log(
        'action.handleMachineSelectWithSpecLocationAlt',
        action.payload
      );
      state[action.payload.switch].isMachineSelected[
        action.payload.locationIdx
      ][action.payload.specLocationIdx][action.payload.machineIdx] = true;
    },

    handleResetAllSelect: () => initialState,
    handleDisplaySelectBox: (state) => {
      state.displaySelectBox = !state.displaySelectBox;
    },
    handleDisplaySelectBoxWithAction: (state, action) => {
      state.displaySelectBox = action.payload;
    },
    handleCleanUpSelectedOne: (state) => {
      state.ess.selectedOne = null;
      state.tes.selectedOne = null;
      state.tgs.selectedOne = null;
    },
  },
});

export default masterControlSelectSlice;
export const selectMasterControls = (state) => state.masterControlSelect;
export const {
  handleSelectAll,
  handleSelectedOne,
  handleLocationSelect,
  handleSpecificLocationSelect,
  handleMachineSelect,
  handleAddSpecificLocations,
  handleAddLocations,
  handleAddMachines,
  handleLocationSelectAlt,
  handleSpecificLocationSelectAlt,
  handleMachineSelectAlt,
  handleMachineSelectWithSpecLocationAlt,
  handleResetAllSelect,
  handleDisplaySelectBox,
  handleDisplaySelectBoxWithAction,
  handleCleanUpSelectedOne,
} = masterControlSelectSlice.actions;
