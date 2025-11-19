import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  displaySelectBox: [false, false, false, false, false, false],
  displayMultipleSelectBox: {
    admin: {
      tgs: { gasType: false, valveSettings: false },
      sys: {
        sysIdentification: false,
        sysConfiguration: false,
        forceGasAndElectricSys: false,
      },
    },
    forceAndCommands: {
      sys: {
        outsideTemp: false,
        burningChamber: false,
        encloseTemp: false,
        currEss: false,
        currTgs: false,
        currTes: false,
      },
    },
  },
  ess: {
    selectedOne: null,
    isAllSelected: false,
    isLocationSelected: [],
    isSpecificLocationSelected: [],
    isMachineSelected: [],
    selectedLocations: [],
    selectedSpecificLocations: [],
    selectedMachines: [],
  },
  tgs: {
    selectedOne: null,
    isAllSelected: false,
    isLocationSelected: [],
    isSpecificLocationSelected: [],
    isMachineSelected: [],
    selectedLocations: [],
    selectedSpecificLocations: [],
    selectedMachines: [],
  },
  tes: {
    selectedOne: null,
    isAllSelected: false,
    isLocationSelected: [],
    isSpecificLocationSelected: [],
    isMachineSelected: [],
    selectedLocations: [],
    selectedSpecificLocations: [],
    selectedMachines: [],
  },
  sys: {
    selectedOne: null,
    isAllSelected: false,
    isLocationSelected: [],
    isSpecificLocationSelected: [],
    isMachineSelected: [],
    selectedLocations: [],
    selectedSpecificLocations: [],
    selectedMachines: [],
  },
  valveSettings: {
    selectedOne: null,
    isAllSelected: false,
    isLocationSelected: [],
    isSpecificLocationSelected: [],
    isMachineSelected: [],
    selectedLocations: [],
    selectedSpecificLocations: [],
    selectedMachines: [],
  },
  gasType: {
    selectedOne: null,
    isAllSelected: false,
    isLocationSelected: [],
    isSpecificLocationSelected: [],
    isMachineSelected: [],
    selectedLocations: [],
    selectedSpecificLocations: [],
    selectedMachines: [],
  },
  // sysIdentification: {
  //   selectedOne: null,
  //   isAllSelected: false,
  //   isLocationSelected: [],
  //   isSpecificLocationSelected: [],
  //   isMachineSelected: [],
  //   selectedLocations: [],
  //   selectedSpecificLocations: [],
  //   selectedMachines: [],
  // },
  // sysConfiguration: {
  //   selectedOne: null,
  //   isAllSelected: false,
  //   isLocationSelected: [],
  //   isSpecificLocationSelected: [],
  //   isMachineSelected: [],
  //   selectedLocations: [],
  //   selectedSpecificLocations: [],
  //   selectedMachines: [],
  // },
  forceGasAndElectricSys: {
    selectedOne: null,
    isAllSelected: false,
    isLocationSelected: [],
    isSpecificLocationSelected: [],
    isMachineSelected: [],
    selectedLocations: [],
    selectedSpecificLocations: [],
    selectedMachines: [],
  },
  outsideTemp: {
    selectedOne: null,
    isAllSelected: false,
    isLocationSelected: [],
    isSpecificLocationSelected: [],
    isMachineSelected: [],
    selectedLocations: [],
    selectedSpecificLocations: [],
    selectedMachines: [],
  },
  burningChamber: {
    selectedOne: null,
    isAllSelected: false,
    isLocationSelected: [],
    isSpecificLocationSelected: [],
    isMachineSelected: [],
    selectedLocations: [],
    selectedSpecificLocations: [],
    selectedMachines: [],
  },
  encloseTemp: {
    selectedOne: null,
    isAllSelected: false,
    isLocationSelected: [],
    isSpecificLocationSelected: [],
    isMachineSelected: [],
    selectedLocations: [],
    selectedSpecificLocations: [],
    selectedMachines: [],
  },
  currEss: {
    selectedOne: null,
    isAllSelected: false,
    isLocationSelected: [],
    isSpecificLocationSelected: [],
    isMachineSelected: [],
    selectedLocations: [],
    selectedSpecificLocations: [],
    selectedMachines: [],
  },
  currTgs: {
    selectedOne: null,
    isAllSelected: false,
    isLocationSelected: [],
    isSpecificLocationSelected: [],
    isMachineSelected: [],
    selectedLocations: [],
    selectedSpecificLocations: [],
    selectedMachines: [],
  },
  currTes: {
    selectedOne: null,
    isAllSelected: false,
    isLocationSelected: [],
    isSpecificLocationSelected: [],
    isMachineSelected: [],
    selectedLocations: [],
    selectedSpecificLocations: [],
    selectedMachines: [],
  },
};

const forceCommandAndAdminSelectSlice = createSlice({
  name: 'forceCommandAndAdminSelect',
  initialState,
  reducers: {
    handleSettingsSelectedOne: (state, action) => {
      state[action.payload.switch].selectedOne = action.payload.selectedOne;
    },
    handleSettingsSelectAll: (state, action) => {
      state[action.payload.switch].isAllSelected = action.payload.status;
    },
    handleSettingsLocationSelect: (state, action) => {
      state[action.payload.switch].isLocationSelected = action.payload.arr;
    },
    handleSettingsSpecificLocationSelect: (state, action) => {
      state[action.payload.switch].isSpecificLocationSelected =
        action.payload.arr;
    },
    handleSettingsMachineSelect: (state, action) => {
      state[action.payload.switch].isMachineSelected = action.payload.arr;
    },
    handleSettingsAddLocations: (state, action) => {
      state[action.payload.switch].selectedLocations = action.payload.arr;
    },
    handleSettingsAddSpecificLocations: (state, action) => {
      state[action.payload.switch].selectedSpecificLocations =
        action.payload.arr;
    },
    handleSettingsAddMachines: (state, action) => {
      state[action.payload.switch].selectedMachines = action.payload.arr;
    },
    handleSettingsMachineSelectAlt: (state, action) => {
      const { specLocationIdx, locationIdx, machineIdx } = action.payload;
      if (specLocationIdx || specLocationIdx === 0) {
        state[action.payload.switch].isMachineSelected[locationIdx][
          specLocationIdx
        ][machineIdx] = true;
      } else {
        state[action.payload.switch].isMachineSelected[locationIdx][
          machineIdx
        ] = true;
      }
    },
    handleSettingsResetAllSelect: () => initialState,
    handleSettingsDisplaySelectBox: (state, action) => {
      state.displaySelectBox[action.payload] =
        !state.displaySelectBox[action.payload];
    },
    // handleSettingsDisplaySelectBoxWithAction: (state, action) => {
    //   state.displaySelectBox = action.payload;
    // },
    handleSettingsMultipleDisplaySelectBox: (state, action) => {
      state.displayMultipleSelectBox[action.payload.sysOptions][
        action.payload.swt
      ][action.payload.contentTitle] =
        !state.displayMultipleSelectBox[action.payload.sysOptions][
          action.payload.swt
        ][action.payload.contentTitle];
    },
  },
});

export default forceCommandAndAdminSelectSlice;
export const selectForceCommandAndAdminSelect = (state) =>
  state.forceCommandAndAdminSelect;
export const {
  handleSettingsSelectAll,
  handleSettingsSelectedOne,
  handleSettingsLocationSelect,
  handleSettingsSpecificLocationSelect,
  handleSettingsMachineSelect,
  handleSettingsAddLocations,
  handleSettingsAddSpecificLocations,
  handleSettingsAddMachines,
  handleSettingsMachineSelectAlt,
  handleSettingsResetAllSelect,
  handleSettingsDisplaySelectBox,
  handleSettingsDisplaySelectBoxWithAction,
  handleSettingsMultipleDisplaySelectBox,
} = forceCommandAndAdminSelectSlice.actions;
