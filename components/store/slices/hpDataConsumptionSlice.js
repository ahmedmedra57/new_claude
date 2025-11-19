import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSelected: false,
  // telemetry
  heatingSystemAbbr: '#30 s.t.',
  usageHours: 0,
  energyConsump: 0,
  //
};

const hpDataConsumptionSlice = createSlice({
  name: 'hpDataConsumption',
  initialState: {
    'boston-east': {
      '01': initialState,
      '02': initialState,
      '03': initialState,
      '04': initialState,
      '05': initialState,
    },
    'ny-west': {
      '01': initialState,
      '02': initialState,
      '03': initialState,
      '04': initialState,
      '05': initialState,
    },
    'w.coast': {
      '01': initialState,
      '02': initialState,
      '03': initialState,
      '04': initialState,
      '05': initialState,
    },
  },
  reducers: {
    hpDataConsumptionHandleUnSelectIndividualMachine: (state, action) => {
      state[action.payload.location][action.payload.machine].isSelected = false;
    },
    hpDataConsumptionSpecificLocationSelectMachinesHandler: (state, action) => {
      state[action.payload.location][action.payload.specificLocation][
        action.payload.machine
      ].isSelected = true;
    },
    hpDataConsumptionHandleSelectIndividualMachine: (state, action) => {
      state[action.payload.location][action.payload.machine].isSelected = true;
    },
    hpDataConsumptionSpecificLocationUnselectMachinesHandler: (
      state,
      action
    ) => {
      state[action.payload.location][action.payload.specificLocation][
        action.payload.machine
      ] = false;
    },
  },
});

export default hpDataConsumptionSlice;
export const selectHpDataConsumption = (state) => state.hpDataConsumption;
export const {
  hpDataConsumptionHandleUnSelectIndividualMachine,
  hpDataConsumptionHandleSelectIndividualMachine,
  hpDataConsumptionSpecificLocationSelectMachinesHandler,
  hpDataConsumptionSpecificLocationUnselectMachinesHandler,
} = hpDataConsumptionSlice.actions;
