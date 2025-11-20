import { createStore } from '../storeUtils';

const createSystemInitial = () => ({
  selectedOne: null,
  isAllSelected: false,
  isLocationSelected: [],
  isSpecificLocationSelected: [],
  isMachineSelected: [],
  selectedLocations: [],
  selectedSpecificLocations: [],
  selectedMachines: [],
});

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
  ess: createSystemInitial(),
  tgs: createSystemInitial(),
  tes: createSystemInitial(),
  sys: createSystemInitial(),
  valveSettings: createSystemInitial(),
  gasType: createSystemInitial(),
  forceGasAndElectricSys: createSystemInitial(),
  outsideTemp: createSystemInitial(),
  burningChamber: createSystemInitial(),
  encloseTemp: createSystemInitial(),
  currEss: createSystemInitial(),
  currTgs: createSystemInitial(),
  currTes: createSystemInitial(),
};

const useForceCommandAndAdminSelectStore = createStore('forceCommandAndAdminSelect', (set) => ({
  ...initialState,

  setSelectedOne: ({ switch: switchKey, selectedOne }) => set((state) => {
    state[switchKey].selectedOne = selectedOne;
  }),

  setSelectAll: ({ switch: switchKey, status }) => set((state) => {
    state[switchKey].isAllSelected = status;
  }),

  setLocationSelect: ({ switch: switchKey, arr }) => set((state) => {
    state[switchKey].isLocationSelected = arr;
  }),

  setSpecificLocationSelect: ({ switch: switchKey, arr }) => set((state) => {
    state[switchKey].isSpecificLocationSelected = arr;
  }),

  setMachineSelect: ({ switch: switchKey, arr }) => set((state) => {
    state[switchKey].isMachineSelected = arr;
  }),

  addLocations: ({ switch: switchKey, arr }) => set((state) => {
    state[switchKey].selectedLocations = arr;
  }),

  addSpecificLocations: ({ switch: switchKey, arr }) => set((state) => {
    state[switchKey].selectedSpecificLocations = arr;
  }),

  addMachines: ({ switch: switchKey, arr }) => set((state) => {
    state[switchKey].selectedMachines = arr;
  }),

  setMachineSelectAlt: ({ switch: switchKey, specLocationIdx, locationIdx, machineIdx }) => set((state) => {
    if (specLocationIdx !== undefined) {
      state[switchKey].isMachineSelected[locationIdx][specLocationIdx][machineIdx] = true;
    } else {
      state[switchKey].isMachineSelected[locationIdx][machineIdx] = true;
    }
  }),

  resetAllSelect: () => set(initialState),

  toggleDisplaySelectBox: (index) => set((state) => {
    state.displaySelectBox[index] = !state.displaySelectBox[index];
  }),

  toggleMultipleDisplaySelectBox: ({ sysOptions, swt, contentTitle }) => set((state) => {
    state.displayMultipleSelectBox[sysOptions][swt][contentTitle] =
      !state.displayMultipleSelectBox[sysOptions][swt][contentTitle];
  }),
}));

export default useForceCommandAndAdminSelectStore;
