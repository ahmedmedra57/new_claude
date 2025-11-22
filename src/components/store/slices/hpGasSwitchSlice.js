import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSelected: false,
  // telemetry
  heatingSystemAbbr: '#40 s.t.',
  usageHours: 0,
  energyConsump: 0,
  //
};

const hpGasSwitchSlice = createSlice({
  name: 'hpGasSwitch',
  initialState: {
    'ny-east': { '01': initialState, '02': initialState, '03': initialState },
    'ny-west': {
      '01': initialState,
      '02': initialState,
      '03': initialState,
      '04': initialState,
    },
  },
  reducers: {
    hpGcSpecificLocationSelectMachinesHandler: (state, action) => {
      state[action.payload.location][action.payload.specificLocation][
        action.payload.machine
      ].isSelected = true;
    },
    hpGcHandleSelectIndividualMachine: (state, action) => {
      state[action.payload.location][action.payload.machine].isSelected = true;
    },
    hpGcSpecificLocationUnselectMachinesHandler: (state, action) => {
      state[action.payload.location][action.payload.specificLocation][
        action.payload.machine
      ].isSelected = false;
    },
    hpGcHandleUnSelectIndividualMachine: (state, action) => {
      state[action.payload.location][action.payload.machine].isSelected = false;
    },
  },
});

export default hpGasSwitchSlice;
export const selectHpGasSwitch = (state) => state.hpGasSwitch;
export const {
  hpGcHandleUnSelectIndividualMachine,
  hpGcHandleSelectIndividualMachine,
  hpGcSpecificLocationSelectMachinesHandler,
  hpGcSpecificLocationUnselectMachinesHandler,
} = hpGasSwitchSlice.actions;
