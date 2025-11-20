import { createStore } from './storeUtils';

const useMcIsExpandedStore = createStore('mcIsExpanded', (set) => ({
  ess: {
    masterControl: true,
    locationMasterControl: [],
    specificLocationMasterControl: [],
    isLocationOpen: [],
    isSpecificLocationOpen: [],
  },
  tgs: {
    masterControl: true,
    locationMasterControl: [],
    specificLocationMasterControl: [],
    isLocationOpen: [],
    isSpecificLocationOpen: [],
  },
  tes: {
    masterControl: true,
    locationMasterControl: [],
    specificLocationMasterControl: [],
    isLocationOpen: [],
    isSpecificLocationOpen: [],
  },
  hp: {
    masterControl: false,
    isLocationOpen: [],
  },
  ate: {
    masterControl: false,
    isLocationOpen: [],
  },

  setOpenLocationInitialState: (swtSystem, locations) => set((state) => {
    state[swtSystem].isLocationOpen = locations;
    state[swtSystem].locationMasterControl = locations;
  }),

  setOpenSpecificLocationInitialState: (swtSystem, specificLocations) => set((state) => {
    state[swtSystem].isSpecificLocationOpen = specificLocations;
    state[swtSystem].specificLocationMasterControl = specificLocations;
  }),

  setEssInitialState: (locations) => set((state) => {
    state.ess.isLocationOpen = locations;
  }),

  setTgsInitialState: (locations) => set((state) => {
    state.tgs.isLocationOpen = locations;
  }),

  setTgsSpecificLocationInitialState: (specificLocations) => set((state) => {
    state.tgs.isSpecificLocationOpen = specificLocations;
  }),

  setTesInitialState: (locations) => set((state) => {
    state.tes.isLocationOpen = locations;
  }),

  setTesSpecificLocationInitialState: (specificLocations) => set((state) => {
    state.tes.isSpecificLocationOpen = specificLocations;
  }),

  setOpenLocation: (swtName, index, status) => set((state) => {
    state[swtName].isLocationOpen[index] = status;
  }),

  setOpenSpecificLocation: (swtName, openSpecificLocationIdx, status) => set((state) => {
    state[swtName].isSpecificLocationOpen[openSpecificLocationIdx] = status;
  }),

  setOpenMasterControl: (swtName, status) => set((state) => {
    state[swtName].masterControl = status;
  }),

  setOpenLocationMasterControl: (swtName, locationIdx, status) => set((state) => {
    state[swtName].locationMasterControl[locationIdx] = status;
  }),

  setOpenSpecificLocationMasterControl: (swtName, locationIdx, status) => set((state) => {
    state[swtName].specificLocationMasterControl[locationIdx] = status;
  }),
}));

export default useMcIsExpandedStore;
