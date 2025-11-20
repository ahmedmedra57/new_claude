import { createStore } from './storeUtils';

const useGlobalOverviewStore = createStore('globalOverview', (set) => ({
  selectedSystem: null,
  displaySystemDetails: [true, true, true, true, true],

  setSelectedSystem: (selectedSystem) => set({ selectedSystem }),
  setDisplaySystemDetails: (displaySystemDetails) => set({ displaySystemDetails }),
  resetMapSelection: () => set({
    selectedSystem: null,
    displaySystemDetails: [true, true, true, true, true],
  }),
}));

export default useGlobalOverviewStore;
