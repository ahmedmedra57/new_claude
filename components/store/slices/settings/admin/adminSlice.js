import { createSlice } from '@reduxjs/toolkit';
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
    // isSelected: false,
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
    // isSelectedSysIdentification: false,
    // isSelectedForceGasAndElectricSys: false,
    // isSelectedSysConfiguration: false,
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
    // isTesSelected: false,
  },
  sysSpec: {
    isSelected: false,
    // isSelectedSysIdentification: false,
    // isSelectedForceGasAndElectricSys: false,
    // isSelectedSysConfiguration: false,
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
    // isTesSelected: false,
  },
};

const system = {
  ess: {
    'bet-east': {
      '01': initialState.ess,
      '02': initialState.ess,
      '03': initialState.ess,
      '04': initialState.ess,
      '05': initialState.ess,
    },
    'bet-west': {
      '01': initialState.ess,
      '02': initialState.ess,
      '03': initialState.ess,
      '04': initialState.ess,
      '05': initialState.ess,
    },
    's.coast': {
      '01': initialState.ess,
      '02': initialState.ess,
      '03': initialState.ess,
      '04': initialState.ess,
      '05': initialState.ess,
    },
    'south-coast': {
      '01': initialState.ess,
      '02': initialState.ess,
      '03': initialState.ess,
      '04': initialState.ess,
      '05': initialState.ess,
    },
  },
  essSpec: {},
  tgs: {
    'mtl-east': {
      '01': initialState.tgs,
      '02': initialState.tgs,
      '03': initialState.tgs,
      '04': initialState.tgs,
      '05': initialState.tgs,
    },
    'mtl-west': {
      '01': initialState.tgs,
      '02': initialState.tgs,
      '03': initialState.tgs,
      '04': initialState.tgs,
      '05': initialState.tgs,
    },
    'mtl-south': {
      '01': initialState.tgs,
      '02': initialState.tgs,
      '03': initialState.tgs,
      '04': initialState.tgs,
      '05': initialState.tgs,
    },
  },
  tgsSpec: {},
  tes: {
    'bet-north': {
      '01': initialState.tes,
      '02': initialState.tes,
      '03': initialState.tes,
      '04': initialState.tes,
    },
    'bet-south': {
      '01': initialState.tes,
      '02': initialState.tes,
      '03': initialState.tes,
    },
    'n.coast': {
      '01': initialState.tes,
      '02': initialState.tes,
      '03': initialState.tes,
      '04': initialState.tes,
    },
  },
  tesSpec: {},
  sys: {
    'bet-north': {
      '01': initialState.sys,
      '02': initialState.sys,
      '03': initialState.sys,
      '04': initialState.sys,
    },
    'bet-south': {
      '01': initialState.sys,
      '02': initialState.sys,
      '03': initialState.sys,
    },
    'n.coast': {
      '01': initialState.sys,
      '02': initialState.sys,
      '03': initialState.sys,
      '04': initialState.sys,
    },
    'mtl-east': {
      '01': initialState.sys,
      '02': initialState.sys,
      '03': initialState.sys,
      '04': initialState.sys,
      '05': initialState.sys,
    },
    'mtl-west': {
      '01': initialState.sys,
      '02': initialState.sys,
      '03': initialState.sys,
      '04': initialState.sys,
      '05': initialState.sys,
    },
    'mtl-south': {
      '01': initialState.sys,
      '02': initialState.sys,
      '03': initialState.sys,
      '04': initialState.sys,
      '05': initialState.sys,
    },
  },
  sysSpec: {},
  hp: {},
  ate: {},
};

const adminSlice = createSlice({
  name: 'admin',
  initialState: system,
  reducers: {
    handleAdminSelectIndividualMachine: (state, action) => {
      const { location, specificLocation, machine, swt, isSelectedSys } =
        action.payload;
        const swtSpec = swt === "ess" ? "essSpec" : swt === "tgs" ? "tgsSpec" : swt === "tes" ? "tesSpec" : "sysSpec";
        if (specificLocation) {
          if (isSelectedSys) {
            //   // !!TEST
            //   state[swt][location][machine][isSelectedSys] = true;
            // } else {
            //   state[swt][location][machine].isSelected = true;
            // }
            // // !!END
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
    },

    handleAdminUnSelectIndividualMachine: (state, action) => {
      const { location, specificLocation, machine, swt, isSelectedSys } =
        action.payload;
        const swtSpec = swt === "ess" ? "essSpec" : swt === "tgs" ? "tgsSpec" : swt === "tes" ? "tesSpec" : "sysSpec";
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
    },
    handleTrackTempControl: (state, action) => {
      const { location, specificLocation, machine, swt, selection } =
        action.payload;
        const swtSpec = swt === "ess" ? "essSpec" : swt === "tgs" ? "tgsSpec" : swt === "tes" ? "tesSpec" : "sysSpec";
      if (specificLocation) {
        state[swtSpec][location].subLocations[specificLocation].devices[machine].trackTempControl =
          selection;
      } else {
        state[swtSpec][location].devices[machine].trackTempControl = selection;
      }
    },
    handleGasValuePosition: (state, action) => {
      const { location, specificLocation, machine, position, value } =
        action.payload;
        state.tgs[location][machine].gasValue[position] = value;
    },
    handleResetUnApplyMachinesOfGasInputs: (state, action) => {
      const { location, specificLocation, machine, isApplyState } =
        action.payload;
      if (specificLocation) {
        if (!isApplyState) {
          state.tgs[location][specificLocation][
            machine
          ].gasValue.startPosition = '';
          state.tgs[location][specificLocation][machine].gasValue.minPosition =
            '';
          state.tgs[location][specificLocation][machine].gasValue.maxPosition =
            '';
        }
      } else {
        if (!isApplyState) {
          state.tgs[location][machine].gasValue.startPosition = '';
          state.tgs[location][machine].gasValue.minPosition = '';
          state.tgs[location][machine].gasValue.maxPosition = '';
        }
      }
    },
    handleGasType: (state, action) => {
      const { location, specificLocation, machine, value } = action.payload;
      if (specificLocation) {
        state.tgsSpec[location].subLocations[specificLocation].devices[machine].gasType = value;
      } else {
        state.tgsSpec[location].devices[machine].gasType = value;
      }
    },

    // handleSysConfiguration: (state, action) => {
    //   const { location, specificLocation, machine, selection } = action.payload;
    //   if (specificLocation) {
    //     state.sys[location][specificLocation][machine].isTesSelected =
    //       selection;
    //   } else {
    //     state.sys[location][machine].isTesSelected = selection;
    //   }
    // },
    handleForceGasAndElectric: (state, action) => {
      const { location, specificLocation, machine, selection } = action.payload;
      if (specificLocation) {
        state.sysSpec[location].subLocations[specificLocation].devices[machine].forceGasAndElectric =
          selection;
      } else {
        state.sysSpec[location].devices[machine].forceGasAndElectric = selection;
      }
    },
    handleEssAdminSelect: (state, action) => {
      state.ess = extractSelectData(action.payload, 'ess');
      state.essSpec = extractSpecificSelectData(action.payload, "essSpec");
    },
    handleTgsAdminSelect: (state, action) => {
      state.tgs = extractSelectData(action.payload, 'tgs');
      state.tgsSpec = extractSpecificSelectData(action.payload, "tgsSpec");
    },
    handleTesAdminSelect: (state, action) => {
      state.tes = extractSelectData(action.payload, 'tes');
      state.tesSpec = extractSpecificSelectData(action.payload, "tesSpec");
    },
    handleSysAdminSelect: (state, action) => {
      state.sysSpec = reduce(
        action.payload,
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
        action.payload,
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
    },
  },
});

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

export default adminSlice;
export const selectAdmin = (state) => state.admin;
export const {
  handleAdminSelectIndividualMachine,
  handleAdminUnSelectIndividualMachine,
  handleTrackTempControl,
  handleGasValuePosition,
  handleResetUnApplyMachinesOfGasInputs,
  handleGasType,
  handleForceGasAndElectric,
  handleSysConfiguration,
  handleIsSelected,
  handleEssAdminSelect,
  handleTgsAdminSelect,
  handleTesAdminSelect,
  handleSysAdminSelect,
} = adminSlice.actions;
