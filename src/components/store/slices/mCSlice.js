import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectSystem: {
    ess: false,
    tgs: false,
    tes: false,
    hp: false,
    essDc: false,
    tgsTesDc: false,
    tesDc: false,
    hpDc: false,
    hpGc: false,
    hpEc: false,
  },
  // selectGasSystem: {

  // },
  // selectElectricSystem: {
  //   ess: false,
  //   tes: false,
  //   hp: false,
  // },
  // selectDataSystem: {
  //   ess: false,
  //   tgs: false,
  //   tes: false,
  //   hp: false,
  // },
  command: {
    create: { ess: false, tgs: false, tes: false },
    clear: { ess: false, tgs: false, tes: false },
  },
};

const mCSlice = createSlice({
  name: 'mC',
  initialState,
  reducers: {
    handleSelectEss: (state) => {
      state.selectSystem.ess = true;
      state.selectSystem.tgs = false;
      state.selectSystem.tes = false;
      state.selectSystem.hp = false;
    },
    handleSelectTgs: (state) => {
      state.selectSystem.ess = false;
      state.selectSystem.tgs = true;
      state.selectSystem.tes = false;
      state.selectSystem.hp = false;
    },
    handleSelectTes: (state) => {
      state.selectSystem.ess = false;
      state.selectSystem.tgs = false;
      state.selectSystem.tes = true;
      state.selectSystem.hp = false;
    },
    handleSelectHp: (state) => {
      state.selectSystem.ess = false;
      state.selectSystem.tgs = false;
      state.selectSystem.tes = false;
      state.selectSystem.hp = true;
    },

    handleSelectTelemetrySystem: (state, action) => {
      // state.selectSystem = {
      //   essDc: false,
      //   tgsDc: false,
      //   tesDc: false,
      //   hpDc: false,
      //   tgs: false,
      //   hpGc: false,
      //   ess: false,
      //   tes: false,
      //   hpEc: false,
      // };
      state.selectSystem = { ...initialState.selectSystem };
      state.selectSystem[action.payload] = true;
    },
    handleCreateCommand: (state, action) => {
      state.command.create = action.payload;
    },
    handleClearCommand: (state, action) => {
      state.command.clear = action.payload;
    },
    handleUnselectAllSystem: (state) => {
      // state.selectSystem = {
      //   essDc: false,
      //   tgsDc: false,
      //   tesDc: false,
      //   hpDc: false,
      //   tgs: false,
      //   hpGc: false,
      //   ess: false,
      //   tes: false,
      //   hpEc: false,
      // };
      state.selectSystem = { ...initialState.selectSystem };
    },
    handleSelectSystem: (state, action) => {
      // state.selectSystem = {
      //   essDc: false,
      //   tgsDc: false,
      //   tesDc: false,
      //   hpDc: false,
      //   tgs: false,
      //   hpGc: false,
      //   ess: false,
      //   tes: false,
      //   hpEc: false,
      // };
      state.selectSystem = { ...initialState.selectSystem };
      state.selectSystem[action.payload] = true;
    },
  },
});

export default mCSlice;
export const selectMC = (state) => state.mC;
export const {
  handleSelectEss,
  handleSelectTgs,
  handleSelectTes,
  handleSelectHp,
  handleSelectTelemetrySystem,
  handleCreateCommand,
  handleClearCommand,
  handleUnselectAllSystem,
  handleSelectSystem,
} = mCSlice.actions;
