import { createStore } from './storeUtils';

const initialData = {
  selectedOne: null,
  isAllSelected: false,
  isLocationSelected: [],
  isSpecificLocationSelected: [],
  isMachineSelected: [],
  selectedMachines: [],
  selectedLocations: [],
  selectedSpecificLocations: [],
};

const useMasterControlSelectStore = createStore('masterControlSelect', (set) => ({
  displaySelectBox: false,
  ess: { ...initialData },
  tes: { ...initialData },
  tgs: { ...initialData },
  hp: { ...initialData },
  hpEc: { ...initialData },
  hpGc: { ...initialData },
  essDc: { ...initialData },
  tgsTesDc: { ...initialData },
  hpDc: { ...initialData },

  setSelectedOne: (switchType, selectedOne) => set((state) => {
    state[switchType].selectedOne = selectedOne;
  }),

  setSelectAll: (switchType, status) => set((state) => {
    state[switchType].isAllSelected = status;
  }),

  setLocationSelect: (switchType, arr) => set((state) => {
    state[switchType].isLocationSelected = arr;
  }),

  setSpecificLocationSelect: (switchType, arr) => set((state) => {
    state[switchType].isSpecificLocationSelected = arr;
  }),

  setMachineSelect: (switchType, arr) => set((state) => {
    state[switchType].isMachineSelected = arr;
  }),

  addLocations: (switchType, arr) => set((state) => {
    state[switchType].selectedLocations = arr;
  }),

  addSpecificLocations: (switchType, arr) => set((state) => {
    state[switchType].selectedSpecificLocations = arr;
  }),

  addMachines: (switchType, arr) => set((state) => {
    state[switchType].selectedMachines = arr;
  }),

  setLocationSelectAlt: (sys, locationIdx) => set((state) => {
    state[sys].isLocationSelected[locationIdx] = true;
  }),

  setSpecificLocationSelectAlt: (sys, locationIdx, specificLocationIdx) => set((state) => {
    state[sys].isSpecificLocationSelected[locationIdx][specificLocationIdx] = true;
  }),

  setMachineSelectAlt: (switchType, locationIdx, machineIdx) => set((state) => {
    state[switchType].isMachineSelected[locationIdx][machineIdx] = true;
  }),

  setMachineSelectWithSpecLocationAlt: (switchType, locationIdx, specLocationIdx, machineIdx) => set((state) => {
    state[switchType].isMachineSelected[locationIdx][specLocationIdx][machineIdx] = true;
  }),

  resetAllSelect: () => set({
    ess: { ...initialData },
    tes: { ...initialData },
    tgs: { ...initialData },
    hp: { ...initialData },
    hpEc: { ...initialData },
    hpGc: { ...initialData },
    essDc: { ...initialData },
    tgsTesDc: { ...initialData },
    hpDc: { ...initialData },
  }),

  toggleDisplaySelectBox: () => set((state) => {
    state.displaySelectBox = !state.displaySelectBox;
  }),

  setDisplaySelectBox: (displaySelectBox) => set({ displaySelectBox }),

  cleanUpSelectedOne: () => set((state) => {
    state.ess.selectedOne = null;
    state.tes.selectedOne = null;
    state.tgs.selectedOne = null;
  }),
}));

export default useMasterControlSelectStore;
