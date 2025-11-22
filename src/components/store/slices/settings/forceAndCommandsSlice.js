import { createSlice } from "@reduxjs/toolkit";
import { reduce, result } from "lodash";
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
const initialState = {
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
};

const system = {
  ess: {
    "bet-east": {
      "01": initialState.ess,
      "02": initialState.ess,
      "03": initialState.ess,
      "04": initialState.ess,
      "05": initialState.ess,
    },
    "bet-west": {
      "01": initialState.ess,
      "02": initialState.ess,
      "03": initialState.ess,
      "04": initialState.ess,
      "05": initialState.ess,
    },
    "s.coast": {
      "01": initialState.ess,
      "02": initialState.ess,
      "03": initialState.ess,
      "04": initialState.ess,
      "05": initialState.ess,
    },
    "south-coast": {
      "01": initialState.ess,
      "02": initialState.ess,
      "03": initialState.ess,
      "04": initialState.ess,
      "05": initialState.ess,
    },
  },
  essSpec: {},
  tgs: {
    "mtl-east": {
      "01": initialState.tgs,
      "02": initialState.tgs,
      "03": initialState.tgs,
      "04": initialState.tgs,
      "05": initialState.tgs,
    },
    "mtl-west": {
      "01": initialState.tgs,
      "02": initialState.tgs,
      "03": initialState.tgs,
      "04": initialState.tgs,
      "05": initialState.tgs,
    },
    "mtl-south": {
      "01": initialState.tgs,
      "02": initialState.tgs,
      "03": initialState.tgs,
      "04": initialState.tgs,
      "05": initialState.tgs,
    },
  },
  tgsSpec: {},
  tes: {
    "bet-north": {
      "01": initialState.tes,
      "02": initialState.tes,
      "03": initialState.tes,
      "04": initialState.tes,
    },
    "bet-south": {
      "01": initialState.tes,
      "02": initialState.tes,
      "03": initialState.tes,
    },
    "n.coast": {
      "01": initialState.tes,
      "02": initialState.tes,
      "03": initialState.tes,
      "04": initialState.tes,
    },
  },
  tesSpec: {},
  sys: {
    "bet-north": {
      "01": initialState.sys,
      "02": initialState.sys,
      "03": initialState.sys,
      "04": initialState.sys,
    },
    "bet-south": {
      "01": initialState.sys,
      "02": initialState.sys,
      "03": initialState.sys,
    },
    "n.coast": {
      "01": initialState.sys,
      "02": initialState.sys,
      "03": initialState.sys,
      "04": initialState.sys,
    },
    "mtl-east": {
      "01": initialState.sys,
      "02": initialState.sys,
      "03": initialState.sys,
      "04": initialState.sys,
      "05": initialState.sys,
    },
    "mtl-west": {
      "01": initialState.sys,
      "02": initialState.sys,
      "03": initialState.sys,
      "04": initialState.sys,
      "05": initialState.sys,
    },
    "mtl-south": {
      "01": initialState.sys,
      "02": initialState.sys,
      "03": initialState.sys,
      "04": initialState.sys,
      "05": initialState.sys,
    },
  },
  sysSpec: {},
  hp: {},
  ate: {},
};

const forceAndCommandsSlice = createSlice({
  name: "forceAndCommands",
  initialState: system,
  reducers: {
    handleSelectAts: (state, action) => {
      const { location, specificLocation, machine, swt, selection } =
        action.payload;
        const swtSpec = swt === "ess" ? "essSpec" : swt === "tgs" ? "tgsSpec" : swt === "tes" ? "tesSpec" : "sysSpec";
      if (specificLocation) {
        state[swtSpec][location].subLocations[specificLocation].devices[machine].selectAts = selection;
      } else {
        state[swtSpec][location].devices[machine].selectAts = selection;
      }
    },
    handleFCSelectIndividualMachine: (state, action) => {
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
    handleFCUnSelectIndividualMachine: (state, action) => {
      const { location, specificLocation, machine, swt, isSelectedSys } =
        action.payload;
        const swtSpec = swt === "ess" ? "essSpec" : swt === "tgs" ? "tgsSpec" : swt === "tes" ? "tesSpec" : "sysSpec";
      if (specificLocation) {
        if (isSelectedSys) {
          //   // !!TEST
          //   state[swt][location][machine][isSelectedSys] = false;
          // } else {
          //   state[swt][location][machine].isSelected = false;
          // }
          // // !!END
          state[swtSpec][location].subLocations[specificLocation].devices[machine][
            isSelectedSys
          ] = false;
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
    handleSelectTC: (state, action) => {
      const { location, specificLocation, machine, selectedTCSys, tcNum } =
        action.payload;
      const initialState = {
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
        state.sysSpec[location].subLocations[specificLocation].devices[machine][selectedTCSys] =
          initialState;
        state.sysSpec[location].subLocations[specificLocation].devices[machine][selectedTCSys][
          tcNum
        ] = true;
      } else {
        state.sysSpec[location].devices[machine][selectedTCSys] = initialState;

        state.sysSpec[location].devices[machine][selectedTCSys][tcNum] = true;
      }
    },
    handleEssFCSelect: (state, action) => {
      state.ess = extractSelectData(action.payload, "ess");
      state.essSpec = extractSpecificSelectData(action.payload, "ess");
    },
    handleTgsFCSelect: (state, action) => {
      state.tgs = extractSelectData(action.payload, "tgs");
      state.tgsSpec = extractSpecificSelectData(action.payload, "tgs");
    },
    handleTesFCSelect: (state, action) => {
      state.tes = extractSelectData(action.payload, "tes");
      state.tesSpec = extractSpecificSelectData(action.payload, "tes");
    },
    handleSysFCSelect: (state, action) => {
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
export default forceAndCommandsSlice;
export const selectForceAndCommands = (state) => state.forceAndCommands;
export const {
  handleSelectAts,
  handleFCSelectIndividualMachine,
  handleFCUnSelectIndividualMachine,
  handleSelectTC,
  handleEssFCSelect,
  handleTgsFCSelect,
  handleTesFCSelect,
  handleSysFCSelect,
} = forceAndCommandsSlice.actions;
