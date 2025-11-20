import { createStore } from './storeUtils';

const initialData = {
  isLocationScope: true,
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

const useMasterControlSelectByLocationStore = createStore('masterControlSelectByLocation', (set) => ({
  instantHeat: { ...initialData },
  snowSensor: { ...initialData },
  optionalConstant: { ...initialData },
  heatingSchedule: { ...initialData },
  windFactor: { ...initialData },
  ats: { ...initialData },
  shutOff: { ...initialData },
  fanOnly: { ...initialData },

  resetSelectedOne: () => set((state) => {
    state.instantHeat.selectedOne = null;
    state.snowSensor.selectedOne = null;
    state.optionalConstant.selectedOne = null;
    state.heatingSchedule.selectedOne = null;
    state.windFactor.selectedOne = null;
    state.ats.selectedOne = null;
    state.shutOff.selectedOne = null;
    state.fanOnly.selectedOne = null;
  }),

  setSelectedOne: (controller, selectedOne) => set((state) => {
    state[controller].selectedOne = selectedOne;
  }),

  setSelectAll: (controller, status) => set((state) => {
    state[controller].isAllSelected = status;
  }),

  setLocationSelect: (controller, arr) => set((state) => {
    state[controller].isLocationSelected = arr;
  }),

  setSpecificLocationSelect: (controller, arr) => set((state) => {
    state[controller].isSpecificLocationSelected = arr;
  }),

  setMachineSelect: (controller, arr) => set((state) => {
    state[controller].isMachineSelected = arr;
  }),

  addLocations: (controller, arr) => set((state) => {
    state[controller].selectedLocations = arr;
  }),

  addSpecificLocations: (controller, arr) => set((state) => {
    state[controller].selectedSpecificLocations = arr;
  }),

  addMachines: (controller, arr) => set((state) => {
    state[controller].selectedMachines = arr;
  }),

  setMachineSelectAlt: (controller, locationIdx, machineIdx) => set((state) => {
    state[controller].isMachineSelected[locationIdx][machineIdx] = true;
  }),

  setMachineSelectWithSpecLocationAlt: (controller, locationIdx, specLocationIdx, machineIdx) => set((state) => {
    state[controller].isMachineSelected[locationIdx][specLocationIdx][machineIdx] = true;
  }),

  resetAll: () => set({
    instantHeat: { ...initialData },
    snowSensor: { ...initialData },
    optionalConstant: { ...initialData },
    heatingSchedule: { ...initialData },
    windFactor: { ...initialData },
    ats: { ...initialData },
    shutOff: { ...initialData },
    fanOnly: { ...initialData },
  }),

  toggleDisplaySelectBox: (controller) => set((state) => {
    state[controller].displaySelectBox = !state.displaySelectBox;
  }),

  setDisplaySelectBox: (displaySelectBox) => set({ displaySelectBox }),

  applyWithTemp: (controller, temp) => set((state) => {
    state[controller].isApplied = !state[controller].isApplied;
    state[controller].inputTemp = temp;
  }),

  setScheduleList: (index, start, end, inputTemp, isF) => set((state) => {
    state.heatingSchedule.scheduleList[index] = {
      start,
      end,
      inputTemp,
      isF,
    };
    state.heatingSchedule.scheduleList[index + 1] = {
      start: { date: null, time: null },
      end: { date: null, time: null },
      inputTemp: null,
      isF: null,
    };
  }),
}));

export default useMasterControlSelectByLocationStore;
