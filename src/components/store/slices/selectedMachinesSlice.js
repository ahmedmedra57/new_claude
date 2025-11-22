import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  unit: `°C`,
  isFanOnly: false,
  atsState: { swt: null, selections: [false, false, false] },

  selectedController: [false, false, false, false, false, false],
  selectedMachines: null,
  heatingScheduleCalendar: { isDisplayed: false, id: null },

  instantHeat: { temp: 0, ready: false, isF: null },
  snowSensor: { ready: false, defaultTemp: 350 },

  optionalConstantTemp: {
    temp: 0,
    ready: false,
    isF: null,
  },
  heatingScheduleList: [
    {
      start: { date: null, time: null },
      end: { date: null, time: null },
      inputTemp: 0,
      isF: null,
    },
  ],
  heatingSchedule: {
    ready: false,
    disable: false,
  },
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

const selectedMachinesSlice = createSlice({
  name: 'selectedMachines',
  initialState,
  reducers: {
    instantHeatHandlerTempo: (state, action) => {
      state.instantHeat.temp = action.payload.temp;
      state.instantHeat.ready = action.payload.state;
      state.instantHeat.isF = action.payload.isF;
    },
    constantHeatHandlerTempo: (state, action) => {
      state.optionalConstantTemp.temp = action.payload.temp;
      state.optionalConstantTemp.ready = !state.optionalConstantTemp.ready;
      state.optionalConstantTemp.isF = action.payload.isF;
    },
    handleResetAll: () => initialState,

    handleSelectAController: (state, action) => {
      state.selectedController = action.payload;
    },

    snowSensorHandlerTempo: (state, action) => {
      state.snowSensor.ready = action.payload;
    },

    windFactorHandlerTempo: (state, action) => {
      state.windFactor.ready = action.payload;
    },
    handleCloseCalendar: (state) => {
      state.heatingScheduleCalendar.isDisplayed = false;
    },
    handleDisplayCalendar: (state, action) => {
      state.heatingScheduleCalendar.id = action.payload;
      state.heatingScheduleCalendar.isDisplayed = true;
    },

    ClearScheduleHandlerTempo: (state) => {
      state.heatingScheduleList[0] = {
        start: { date: null, time: null },
        end: { date: null, time: null },
      };
    },
    handleClearScheduler: (state) => {
      state.heatingScheduleList[0] = {
        start: { date: null, time: null },
        end: { date: null, time: null },
        inputTemp: 0,
        isF: null,
      };
      state.heatingSchedule.ready = false;
    },

    AddScheduleHandlerTempo: (state, action) => {

      state.heatingScheduleList[0] = {
        start: action.payload.start,
        end: action.payload.end,
        inputTemp: action.payload.inputTemp,
        isF: action.payload.isF,
      };

      state.heatingSchedule.ready = true;
    },

    handleAddFirstSchedule: (state, action) => {
      state.heatingScheduleListForTelemetry = [
        {
          start: action.payload.start,
          end: action.payload.end,
        },
      ];
    },
    handleAddMoreSchedule: (state, action) => {
      state.heatingScheduleListForTelemetry.push({
        start: action.payload.start,
        end: action.payload.end,
      });
    },

    fanOnlyHandlerTempo: (state, action) => {
      state.isFanOnly = action.payload;
    },
    handleDeactivatePrograms: (state, action) => {
      state[action.payload] = initialState[action.payload];
      state.mCOff[action.payload] = true;
    },
    handleAllDeactivatePrograms: (state, action) => {
      state.mCOff = action.payload;
    },

    toggleAtsHandlerTempo: (state, action) => {
      state.atsState = {
        swt: action.payload.swt,
        selections: action.payload.selections,
      };
    },
    ResetAllReadyToFalse: (state) => {
      state.instantHeat.ready = false;
      state.snowSensor.ready = false;
      state.optionalConstantTemp.ready = false;
      state.windFactor.ready = false;
      state.heatingSchedule.ready = false;
    },
    handleResetAllDialControl: (state) => {
      state.instantHeat = initialState.instantHeat;
      state.snowSensor = initialState.snowSensor;
      state.optionalConstantTemp = initialState.optionalConstantTemp;
      state.windFactor = initialState.windFactor;
      state.heatingSchedule = initialState.heatingSchedule;
    },
    handleResetMCOffState: (state) => {
      state.mCOff = {
        isFanOnly: false,
        heatingSchedule: false,
        instantHeat: false,
        optionalConstantTemp: false,
        snowSensor: false,
        windFactor: false,
      };
    },
    handleResetAtsState: (state) => {
      state.atsState = { swt: null, selections: [false, false, false] };
    },
  },
});

export default selectedMachinesSlice;
export const selectedMachinesState = (state) => state.selectedMachines;
export const {
  instantHeatHandlerTempo,
  constantHeatHandlerTempo,
  handleResetAll,
  handleSelectAController,
  snowSensorHandlerTempo,
  windFactorHandlerTempo,
  ClearScheduleHandlerTempo,
  AddScheduleHandlerTempo,
  fanOnlyHandlerTempo,
  toggleAtsHandlerTempo,

  handleCloseCalendar,
  handleDisplayCalendar,
  handleClearScheduler,
  handleAddFirstSchedule,
  handleAddMoreSchedule,
  handleDeactivatePrograms,
  handleAllDeactivatePrograms,

  ResetAllReadyToFalse,
  handleResetAllDialControl,
  handleResetMCOffState,
  handleResetAtsState,
} = selectedMachinesSlice.actions;
