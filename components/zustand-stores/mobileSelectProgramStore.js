import { createStore } from './storeUtils';

const initialState = {
  instantHeat: false,
  snowSensor: false,
  fanOnly: false,
  windFactor: false,
  optionalConstantTemp: false,
  ats: false,
  shutOff: false,
  heatingSchedule: false,
};

const useMobileSelectProgramStore = createStore('selectedProgram', (set) => ({
  ...initialState,

  toggleProgram: (program) => set((state) => {
    state[program] = !state[program];
  }),

  unselectAllPrograms: () => set(initialState),
}));

export default useMobileSelectProgramStore;
