import { createStore } from '../storeUtils';

const useSnowSensorStore = createStore('snowSensor', (set) => ({
  essSnowSensorTemp: 0,
  tgsSnowSensorTemp: 0,
  tesSnowSensorTemp: 0,
  snowSensorSavedUnitIsF: false,

  setSnowSensorTemp: ({ keyName, value }) => set({ [keyName]: value }),
}));

export default useSnowSensorStore;
