import { createStore } from './storeUtils';

const useMcStore = createStore('mc', (set) => ({
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
  command: {
    create: { ess: false, tgs: false, tes: false },
    clear: { ess: false, tgs: false, tes: false },
  },

  selectEss: () => set((state) => {
    state.selectSystem = {
      ess: true,
      tgs: false,
      tes: false,
      hp: false,
      essDc: false,
      tgsTesDc: false,
      tesDc: false,
      hpDc: false,
      hpGc: false,
      hpEc: false,
    };
  }),

  selectTgs: () => set((state) => {
    state.selectSystem = {
      ess: false,
      tgs: true,
      tes: false,
      hp: false,
      essDc: false,
      tgsTesDc: false,
      tesDc: false,
      hpDc: false,
      hpGc: false,
      hpEc: false,
    };
  }),

  selectTes: () => set((state) => {
    state.selectSystem = {
      ess: false,
      tgs: false,
      tes: true,
      hp: false,
      essDc: false,
      tgsTesDc: false,
      tesDc: false,
      hpDc: false,
      hpGc: false,
      hpEc: false,
    };
  }),

  selectHp: () => set((state) => {
    state.selectSystem = {
      ess: false,
      tgs: false,
      tes: false,
      hp: true,
      essDc: false,
      tgsTesDc: false,
      tesDc: false,
      hpDc: false,
      hpGc: false,
      hpEc: false,
    };
  }),

  selectTelemetrySystem: (systemKey) => set((state) => {
    state.selectSystem = {
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
    };
    state.selectSystem[systemKey] = true;
  }),

  selectSystem: (systemKey) => set((state) => {
    state.selectSystem = {
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
    };
    state.selectSystem[systemKey] = true;
  }),

  unselectAllSystems: () => set((state) => {
    state.selectSystem = {
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
    };
  }),

  setCreateCommand: (command) => set((state) => {
    state.command.create = command;
  }),

  setClearCommand: (command) => set((state) => {
    state.command.clear = command;
  }),
}));

export default useMcStore;
