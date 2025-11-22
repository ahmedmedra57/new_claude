import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSelected: false,
  // telemetry
  heatingSystemAbbr: '#30 s.t.',
  usageHours: 0,
  energyConsump: 0,
  //
};

const hpElectricSwitchSlice = createSlice({
  name: 'hpElectricSwitch',
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
    hpEcHandleUnSelectIndividualMachine: (state, action) => {
      state[action.payload.location][action.payload.machine].isSelected = false;
    },
    hpEcSpecificLocationSelectMachinesHandler: (state, action) => {
      state[action.payload.location][action.payload.specificLocation][
        action.payload.machine
      ].isSelected = true;
    },
    hpEcHandleSelectIndividualMachine: (state, action) => {
      state[action.payload.location][action.payload.machine].isSelected = true;
    },
    hpEcSpecificLocationUnselectMachinesHandler: (state, action) => {
      state[action.payload.location][action.payload.specificLocation][
        action.payload.machine
      ] = false;
    },
  },
});

export default hpElectricSwitchSlice;
export const selectHpElectricSwitch = (state) => state.hpElectricSwitch;
export const {
  hpEcHandleUnSelectIndividualMachine,
  hpEcHandleSelectIndividualMachine,
  hpEcSpecificLocationSelectMachinesHandler,
  hpEcSpecificLocationUnselectMachinesHandler,
} = hpElectricSwitchSlice.actions;
