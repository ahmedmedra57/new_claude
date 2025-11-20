import { createStore } from '../storeUtils';

const useUnitsStore = createStore('units', (set) => ({
  isF: false,
  selectedUnit: '',

  setUnits: (isF) => set({ isF }),
  setUnitSelection: (selectedUnit) => set((state) => {
    state.selectedUnit = selectedUnit;
    state.isF = selectedUnit === 0;
  }),
}));

export default useUnitsStore;
