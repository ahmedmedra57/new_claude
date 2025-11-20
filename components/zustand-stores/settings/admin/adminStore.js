import { createStore } from '../../storeUtils';
import reduce from 'lodash/reduce';

const initialState = {
  ess: {
    isSelected: false,
    addElementToBankInfo: [],
    trackTempControl: false,
  },
  essSpec: {
    isSelected: false,
    addElementToBankInfo: [],
    trackTempControl: false,
  },
  tgs: {
    isSelectedValveSettings: false,
    isSelectedGasType: false,
    gasType: '',
    sysIdentification: {
      locationName: '',
      switchName: '',
      isHeatingSystemWithTes: true,
      application: 's.t.',
      switchSize: '#10',
      ssrRating: '',
      sysId: '',
    },
    gasValue: {
      startPosition: '',
      minPosition: '',
      maxPosition: '',
      isConfirm: false,
      isApply: false,
    },
  },
  tgsSpec: {
    isSelected: false,
    isSelectedValveSettings: false,
    isSelectedGasType: false,
    gasType: '',
    sysIdentification: {
      locationName: '',
      switchName: '',
      isHeatingSystemWithTes: true,
      application: 's.t.',
      switchSize: '#10',
      ssrRating: '',
      sysId: '',
    },
    gasValue: {
      startPosition: '',
      minPosition: '',
      maxPosition: '',
      isConfirm: false,
      isApply: false,
    },
  },
  tes: {
    isSelected: false,
    addElementToBankInfo: [],
    trackTempControl: false,
  },
  tesSpec: {
    isSelected: false,
    addElementToBankInfo: [],
    trackTempControl: false,
  },
  sys: {
    isSelected: false,
    sysIdentification: {
      locationName: '',
      switchName: '',
      isHeatingSystemWithTes: true,
      application: 's.t.',
      switchSize: '#10',
      ssrRating: '',
      sysId: '',
    },
    forceGasAndElectric: null,
  },
  sysSpec: {
    isSelected: false,
    sysIdentification: {
      locationName: '',
      switchName: '',
      isHeatingSystemWithTes: true,
      application: 's.t.',
      switchSize: '#10',
      ssrRating: '',
      sysId: '',
    },
    forceGasAndElectric: null,
  },
};

const extractSelectData = (data, type) => {
  return reduce(
    data,
    (result, value) => {
      if (value.specific_location) {
        return {
          ...result,
          ...reduce(
            value.specific_location,
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
          ),
        };
      }
      return {
        ...result,
        [value.zone_id]: reduce(
          value.devices,
          (result, machine) => ({
            ...result,
            [machine.device_mac]: {
              ...initialState[type],
              deviceMac: machine.device_mac,
              deviceType: machine.deviceType,
              machineName: machine.device_name,
              locationName: value.zone_name,
              locationId: value.zone_id,
            },
          }),
          {}
        ),
      };
    },
    {}
  );
};

const extractSpecificSelectData = (data, type) => {
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

const useAdminStore = createStore('admin', (set) => ({
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

  setTrackTempControl: ({ location, specificLocation, machine, swt, selection }) => set((state) => {
    const swtSpec = swt === 'ess' ? 'essSpec' : swt === 'tgs' ? 'tgsSpec' : swt === 'tes' ? 'tesSpec' : 'sysSpec';
    if (specificLocation) {
      state[swtSpec][location].subLocations[specificLocation].devices[machine].trackTempControl = selection;
    } else {
      state[swtSpec][location].devices[machine].trackTempControl = selection;
    }
  }),

  setGasValuePosition: ({ location, specificLocation, machine, position, value }) => set((state) => {
    state.tgs[location][machine].gasValue[position] = value;
  }),

  resetUnApplyMachinesOfGasInputs: ({ location, specificLocation, machine, isApplyState }) => set((state) => {
    if (specificLocation) {
      if (!isApplyState) {
        state.tgs[location][specificLocation][machine].gasValue.startPosition = '';
        state.tgs[location][specificLocation][machine].gasValue.minPosition = '';
        state.tgs[location][specificLocation][machine].gasValue.maxPosition = '';
      }
    } else {
      if (!isApplyState) {
        state.tgs[location][machine].gasValue.startPosition = '';
        state.tgs[location][machine].gasValue.minPosition = '';
        state.tgs[location][machine].gasValue.maxPosition = '';
      }
    }
  }),

  setGasType: ({ location, specificLocation, machine, value }) => set((state) => {
    if (specificLocation) {
      state.tgsSpec[location].subLocations[specificLocation].devices[machine].gasType = value;
    } else {
      state.tgsSpec[location].devices[machine].gasType = value;
    }
  }),

  setForceGasAndElectric: ({ location, specificLocation, machine, selection }) => set((state) => {
    if (specificLocation) {
      state.sysSpec[location].subLocations[specificLocation].devices[machine].forceGasAndElectric = selection;
    } else {
      state.sysSpec[location].devices[machine].forceGasAndElectric = selection;
    }
  }),

  setEssAdminSelect: (data) => set((state) => {
    state.ess = extractSelectData(data, 'ess');
    state.essSpec = extractSpecificSelectData(data, 'essSpec');
  }),

  setTgsAdminSelect: (data) => set((state) => {
    state.tgs = extractSelectData(data, 'tgs');
    state.tgsSpec = extractSpecificSelectData(data, 'tgsSpec');
  }),

  setTesAdminSelect: (data) => set((state) => {
    state.tes = extractSelectData(data, 'tes');
    state.tesSpec = extractSpecificSelectData(data, 'tesSpec');
  }),

  setSysAdminSelect: (data) => set((state) => {
    state.sysSpec = reduce(
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
      data,
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

export default useAdminStore;
