import { createStore } from './storeUtils';

const initialState = {
  isSelected: false,
  heatingSystemAbbr: '#30 s.t.',
  usageHours: 0,
  energyConsump: 0,
};

const useHpElectricSwitchStore = createStore('hpElectricSwitch', (set) => ({
  'ny-east': {
    '01': initialState,
    '02': initialState,
    '03': initialState,
  },
  'ny-west': {
    '01': initialState,
    '02': initialState,
    '03': initialState,
    '04': initialState,
  },

  unselectIndividualMachine: (location, machine) => set((state) => {
    state[location][machine].isSelected = false;
  }),

  selectSpecificLocationMachine: (location, specificLocation, machine) => set((state) => {
    state[location][specificLocation][machine].isSelected = true;
  }),

  selectIndividualMachine: (location, machine) => set((state) => {
    state[location][machine].isSelected = true;
  }),

  unselectSpecificLocationMachine: (location, specificLocation, machine) => set((state) => {
    state[location][specificLocation][machine] = false;
  }),
}));

export default useHpElectricSwitchStore;
