import { createStore } from '../storeUtils';

const useWindFactorStore = createStore('windFactor', (set) => ({
  lowWindTemp: 0,
  medWindTemp: 0,
  highWindTemp: 0,
  extremeWindTemp: 0,
  windFactorSavedUnitIsF: false,

  setWindTemp: ({ objectName, temp }) => set({ [objectName]: temp }),
}));

export default useWindFactorStore;
