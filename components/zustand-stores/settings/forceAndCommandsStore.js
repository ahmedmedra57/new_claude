import { createStore } from '../storeUtils';
import { reduce } from 'lodash';

const thermoCoupleList = {
  tc01: false,
  tc02: false,
  tc03: false,
  tc04: false,
  tc05: false,
  tc06: false,
  tc07: false,
  tc08: false,
  tc09: false,
  tc10: false,
  tc11: false,
};

const createInitialState = () => ({
  ess: {
    isSelected: false,
    heaterTemp: null,
    selectAts: null,
    deviceMac: null,
    deviceType: null,
  },
  tgs: {
    isSelected: false,
    heaterTemp: null,
    selectAts: null,
    deviceMac: null,
    deviceType: null,
  },
  tes: {
    isSelected: false,
    heaterTemp: null,
    selectAts: null,
    deviceMac: null,
    deviceType: null,
  },
  sys: {
    isOutsideTempSelected: false,
    isBurningChamberSelected: false,
    isEncloseTempSelected: false,
    isCurrEssSelected: false,
    isCurrTgsSelected: false,
    isCurrTesSelected: false,
    outsideTempTCNumber: thermoCoupleList,
    burningChamberTCNumber: thermoCoupleList,
    encloseTempTCNumber: thermoCoupleList,
    currEssTCNumber: thermoCoupleList,
    currTgsTCNumber: thermoCoupleList,
    currTesTCNumber: thermoCoupleList,
    deviceMac: null,
    deviceType: null,
    machineName: null,
  },
});

// Helper functions
const extractSelectData = (data, type) => {
  const initialState = createInitialState();
  return reduce(
    data,
    (result, location) => ({
      ...result,
      [location.zone_id]: reduce(
        location.devices,
        (result, machine) => ({
          ...result,
          [machine.device_mac]: {
            ...initialState[type],
            deviceMac: machine.device_mac,
            deviceType: machine.deviceType,
            machineName: machine.device_name,
            locationName: location.zone_name,
            locationId: location.zone_id,
          },
        }),
        {}
      ),
    }),
    {}
  );
};

const extractSpecificSelectData = (data, type) => {
  const initialState = createInitialState();
  return reduce(
    data,
    (result, location) => {
      if (location.specific_location) {
        return {
          ...result,
          [location.zone_id]: {
            isSpecificLocation: true,
            subLocations: location.specific_location.reduce(
              (result, specificLocation) => {
                result[specificLocation.zone_id] = {
                  devices: reduce(
                    specificLocation.devices,
                    (result, machine) => {
                      return {
                        ...result,
                        [machine.device_mac]: {
                          ...initialState[type],
                          deviceMac: machine.device_mac,
                          deviceType: machine.deviceType,
                          machineName: machine.device_name,
                          locationName: specificLocation.zone_name,
                          locationId: specificLocation.zone_id,
                        },
                      };
                    },
                    {}
                  ),
                };
                return result;
              },
              {}
            ),
          },
        };
      }
      return {
        ...result,
        [location.zone_id]: {
          isSpecificLocation: false,
          devices: reduce(
            location.devices,
            (result, machine) => ({
              ...result,
              [machine.device_mac]: {
                ...initialState[type],
                deviceMac: machine.device_mac,
                deviceType: machine.deviceType,
                machineName: machine.device_name,
                locationName: location.zone_name,
                locationId: location.zone_id,
              },
            }),
            {}
          ),
        },
      };
    },
    {}
  );
};

const useForceAndCommandsStore = createStore('forceAndCommands', (set) => ({
  ess: {},
  essSpec: {},
  tgs: {},
  tgsSpec: {},
  tes: {},
  tesSpec: {},
  sys: {},
  sysSpec: {},
  hp: {},
  ate: {},

  selectAts: ({ location, specificLocation, machine, swt, selection }) => set((state) => {
    const swtSpec = swt === 'ess' ? 'essSpec' : swt === 'tgs' ? 'tgsSpec' : swt === 'tes' ? 'tesSpec' : 'sysSpec';
    if (specificLocation) {
      state[swtSpec][location].subLocations[specificLocation].devices[machine].selectAts = selection;
    } else {
      state[swtSpec][location].devices[machine].selectAts = selection;
    }
  }),

  selectIndividualMachine: ({ location, specificLocation, machine, swt, isSelectedSys }) => set((state) => {
    const swtSpec = swt === 'ess' ? 'essSpec' : swt === 'tgs' ? 'tgsSpec' : swt === 'tes' ? 'tesSpec' : 'sysSpec';
    if (specificLocation) {
      if (isSelectedSys) {
        state[swtSpec][location].subLocations[specificLocation].devices[machine][isSelectedSys] = true;
      } else {
        state[swtSpec][location].subLocations[specificLocation].devices[machine].isSelected = true;
      }
    } else {
      if (isSelectedSys) {
        state[swtSpec][location].devices[machine][isSelectedSys] = true;
      } else {
        state[swtSpec][location].devices[machine].isSelected = true;
      }
    }
  }),

  unselectIndividualMachine: ({ location, specificLocation, machine, swt, isSelectedSys }) => set((state) => {
    const swtSpec = swt === 'ess' ? 'essSpec' : swt === 'tgs' ? 'tgsSpec' : swt === 'tes' ? 'tesSpec' : 'sysSpec';
    if (specificLocation) {
      if (isSelectedSys) {
        state[swtSpec][location].subLocations[specificLocation].devices[machine][isSelectedSys] = false;
      } else {
        state[swtSpec][location].subLocations[specificLocation].devices[machine].isSelected = false;
      }
    } else {
      if (isSelectedSys) {
        state[swtSpec][location].devices[machine][isSelectedSys] = false;
      } else {
        state[swtSpec][location].devices[machine].isSelected = false;
      }
    }
  }),

  selectTC: ({ location, specificLocation, machine, selectedTCSys, tcNum }) => set((state) => {
    const initialTCState = {
      tc01: false,
      tc02: false,
      tc03: false,
      tc04: false,
      tc05: false,
      tc06: false,
      tc07: false,
      tc08: false,
      tc09: false,
      tc10: false,
      tc11: false,
    };

    if (specificLocation) {
      state.sysSpec[location].subLocations[specificLocation].devices[machine][selectedTCSys] = initialTCState;
      state.sysSpec[location].subLocations[specificLocation].devices[machine][selectedTCSys][tcNum] = true;
    } else {
      state.sysSpec[location].devices[machine][selectedTCSys] = initialTCState;
      state.sysSpec[location].devices[machine][selectedTCSys][tcNum] = true;
    }
  }),

  setEssData: (payload) => set((state) => {
    state.ess = extractSelectData(payload, 'ess');
    state.essSpec = extractSpecificSelectData(payload, 'ess');
  }),

  setTgsData: (payload) => set((state) => {
    state.tgs = extractSelectData(payload, 'tgs');
    state.tgsSpec = extractSpecificSelectData(payload, 'tgs');
  }),

  setTesData: (payload) => set((state) => {
    state.tes = extractSelectData(payload, 'tes');
    state.tesSpec = extractSpecificSelectData(payload, 'tes');
  }),

  setSysData: (payload) => set((state) => {
    const initialState = createInitialState();
    state.sysSpec = reduce(
      payload,
      (result, location) => {
        if (location.specific_location) {
          return {
            ...result,
            [location.zone_id]: {
              isSpecificLocation: true,
              subLocations: location.specific_location.reduce(
                (result, specificLocation) => {
                  result[specificLocation.zone_id] = {
                    devices: reduce(
                      specificLocation.devices,
                      (result, machine) => {
                        return {
                          ...result,
                          [machine.device_mac]: {
                            ...initialState.sys,
                            deviceMac: machine.device_mac,
                            deviceType: machine.deviceType,
                            machineName: machine.device_name,
                            locationName: specificLocation.zone_name,
                            locationId: specificLocation.zone_id,
                          },
                        };
                      },
                      {}
                    ),
                  };
                  return result;
                },
                {}
              ),
            },
          };
        }
        return {
          ...result,
          [location.zone_id]: {
            isSpecificLocation: false,
            devices: reduce(
              location.devices,
              (result, machine) => ({
                ...result,
                [machine.device_mac]: {
                  ...initialState.sys,
                  deviceMac: machine.device_mac,
                  deviceType: machine.deviceType,
                  machineName: machine.device_name,
                  locationName: location.zone_name,
                  locationId: location.zone_id,
                },
              }),
              {}
            ),
          },
        };
      },
      {}
    );
    state.sys = reduce(
      payload,
      (result, location) => ({
        ...result,
        [location.zone_id]: {
          ...result[location.zone_id],
          ...reduce(
            location.devices,
            (result, machine) => ({
              ...result,
              [machine.device_mac]: {
                ...initialState.sys,
                deviceMac: machine.device_mac,
                deviceType: machine.deviceType,
                machineName: machine.device_name,
                locationName: location.zone_name,
                locationId: location.zone_id,
              },
            }),
            {}
          ),
        },
      }),
      {}
    );
  }),
}));

export default useForceAndCommandsStore;
