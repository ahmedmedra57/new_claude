import { createStore } from './storeUtils';

const initialState = {
  unit: '°C',
  isFanOnly: false,
  atsState: { swt: null, selections: [false, false, false] },
  selectedController: [false, false, false, false, false, false],
  selectedMachines: null,
  heatingScheduleCalendar: { isDisplayed: false, id: null },
  instantHeat: { temp: 0, ready: false, isF: null },
  snowSensor: { ready: false, defaultTemp: 350 },
  optionalConstantTemp: { temp: 0, ready: false, isF: null },
  heatingScheduleList: [
    {
      start: { date: null, time: null },
      end: { date: null, time: null },
      inputTemp: 0,
      isF: null,
    },
  ],
  heatingSchedule: { ready: false, disable: false },
  windFactor: { ready: false },
  mCOff: {
    isFanOnly: false,
    heatingSchedule: false,
    instantHeat: false,
    optionalConstantTemp: false,
    snowSensor: false,
    windFactor: false,
  },
  heatingScheduleListForTelemetry: [
    {
      start: null,
      end: null,
    },
  ],
};

const useSelectedMachinesStore = createStore('selectedMachines', (set) => ({
  ...initialState,

  setInstantHeat: (temp, state, isF) => set((s) => {
    s.instantHeat.temp = temp;
    s.instantHeat.ready = state;
    s.instantHeat.isF = isF;
  }),

  setConstantHeat: (temp, isF) => set((s) => {
    s.optionalConstantTemp.temp = temp;
    s.optionalConstantTemp.ready = !s.optionalConstantTemp.ready;
    s.optionalConstantTemp.isF = isF;
  }),

  resetAll: () => set(initialState),

  setSelectedController: (selectedController) => set({ selectedController }),

  setSnowSensor: (ready) => set((s) => {
    s.snowSensor.ready = ready;
  }),

  setWindFactor: (ready) => set((s) => {
    s.windFactor.ready = ready;
  }),

  closeCalendar: () => set((s) => {
    s.heatingScheduleCalendar.isDisplayed = false;
  }),

  displayCalendar: (id) => set((s) => {
    s.heatingScheduleCalendar.id = id;
    s.heatingScheduleCalendar.isDisplayed = true;
  }),

  clearSchedule: () => set((s) => {
    s.heatingScheduleList[0] = {
      start: { date: null, time: null },
      end: { date: null, time: null },
    };
  }),

  clearScheduler: () => set((s) => {
    s.heatingScheduleList[0] = {
      start: { date: null, time: null },
      end: { date: null, time: null },
      inputTemp: 0,
      isF: null,
    };
    s.heatingSchedule.ready = false;
  }),

  addSchedule: (start, end, inputTemp, isF) => set((s) => {
    s.heatingScheduleList[0] = {
      start,
      end,
      inputTemp,
      isF,
    };
    s.heatingSchedule.ready = true;
  }),

  addFirstSchedule: (start, end) => set({
    heatingScheduleListForTelemetry: [{ start, end }],
  }),

  addMoreSchedule: (start, end) => set((s) => {
    s.heatingScheduleListForTelemetry.push({ start, end });
  }),

  setFanOnly: (isFanOnly) => set({ isFanOnly }),

  deactivatePrograms: (program) => set((s) => {
    s[program] = initialState[program];
    s.mCOff[program] = true;
  }),

  setAllDeactivatePrograms: (mCOff) => set({ mCOff }),

  toggleAts: (swt, selections) => set({
    atsState: { swt, selections },
  }),

  resetAllReadyToFalse: () => set((s) => {
    s.instantHeat.ready = false;
    s.snowSensor.ready = false;
    s.optionalConstantTemp.ready = false;
    s.windFactor.ready = false;
    s.heatingSchedule.ready = false;
  }),

  resetAllDialControl: () => set((s) => {
    s.instantHeat = initialState.instantHeat;
    s.snowSensor = initialState.snowSensor;
    s.optionalConstantTemp = initialState.optionalConstantTemp;
    s.windFactor = initialState.windFactor;
    s.heatingSchedule = initialState.heatingSchedule;
  }),

  resetMCOffState: () => set({
    mCOff: {
      isFanOnly: false,
      heatingSchedule: false,
      instantHeat: false,
      optionalConstantTemp: false,
      snowSensor: false,
      windFactor: false,
    },
  }),

  resetAtsState: () => set({
    atsState: { swt: null, selections: [false, false, false] },
  }),
}));

export default useSelectedMachinesStore;
