import { createSlice } from "@reduxjs/toolkit";
import { reduce } from "lodash";

const initialState = {
  isSelected: false,
  heatingSystemAbbr: "#10 s.t.",
  usageHours: 75,
  energyConsump: 300,
};

const essDataConsumptionSlice = createSlice({
  name: "essDataConsumption",
  initialState: {
    essDataConsumptionSwitch: {},
  },
  essDataConsumptionSwitchSpecificLocation: {},
  reducers: {
    essDataConsumptionHandleSelectIndividualMachine: (state, action) => {
      state.essDataConsumptionSwitch[action.payload.location][
        action.payload.machine
      ].isSelected = true;
    },
    essDataConsumptionSpecificLocationSelectMachineHandler: (state, action) => {
      state.essDataConsumptionSwitchSpecificLocation[
        action.payload.location
      ].subLocations[action.payload.specificLocation].devices[
        action.payload.machine
      ].isSelected = true;
    },
    essDataConsumptionHandleUnSelectIndividualMachine: (state, action) => {
      state.essDataConsumptionSwitch[action.payload.location][
        action.payload.machine
      ].isSelected = false;
    },
    essDataConsumptionSpecificLocationUnselectMachineHandler: (
      state,
      action
    ) => {
      console.log(
        action.payload,
        "essDataConsumptionSpecificLocationUnselectMachineHandler"
      );
      state.essDataConsumptionSwitch[action.payload.location][
        action.payload.specificLocation
      ][action.payload.machine] = false;
    },
    handleEssDataConsumptionLocation: (state, action) => {
      state.essDataConsumptionSwitch = reduce(
        action.payload,
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
                        ...initialState,
                        inhandId: machine.inhand_id,
                        machineName: machine.device_name,
                        machineMac: machine.device_mac,
                        locationId: location.zone_id,
                        locationName: location.zone_name,
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
                  ...initialState,
                  inhandId: machine.inhand_id,
                  machineName: machine.device_name,
                  machineMac: machine.device_mac,
                  locationId: value.zone_id,
                  locationName: value.zone_name,
                },
              }),
              {}
            ),
          };
          // return {
          //   ...result,
          //   [location.zone_id]: {
          //     ...location.devices.reduce(
          //       (result, machine) => ({
          //         ...result,
          //         [machine.device_mac]: {
          //           ...initialState,
          //           inhandId: machine.inhand_id,
          //           machineName: machine.device_name,
          //           machineMac: machine.device_mac,
          //           locationId: location.zone_id,
          //           locationName: location.zone_name,
          //         },
          //       }),
          //       {}
          //     ),
          //   },
          // };
        },
        {}
      );
      state.essDataConsumptionSwitchSpecificLocation = reduce(
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
                              ...initialState,
                              inhandId: machine.inhand_id,
                              machineName: machine.device_name,
                              machineMac: machine.device_mac,
                              locationId: specificLocation.zone_id,
                              locationName: specificLocation.zone_name,
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
                    ...initialState,
                    inhandId: machine.inhand_id,
                    machineName: machine.device_name,
                    machineMac: machine.device_mac,
                    locationId: location.zone_id,
                    locationName: location.zone_name,
                  },
                }),
                {}
              ),
            },
          };
        },
        {}
      );
      // state.essDataConsumptionSwitchSpecificLocation = reduce(
      //   action.payload,
      //   (result, location) => {
      //     if (location.specific_location) {
      //       return {
      //         ...result,
      //         [location.zone_id]: {
      //           isSpecificLocation: true,
      //           subLocations: location.specific_location.reduce(
      //             (result, specificLocation) => {
      //               result[specificLocation.zone_id] = {
      //                 devices: reduce(
      //                   specificLocation.devices,
      //                   (result, machine) => ({
      //                     ...result,
      //                     [machine.device_mac]: {
      //                       ...initialState,
      //                       inhandId: machine.inhand_id,
      //                       machineName: machine.device_name,
      //                       machineMac: machine.device_mac,
      //                       locationId: specificLocation.zone_id,
      //                       locationName: specificLocation.zone_name,
      //                     },
      //                   }),
      //                   {}
      //                 ),
      //               };
      //             }
      //           ),
      //         },
      //       };
      //     }
      //     return {
      //       ...result,
      //       [location.zone_id]: {
      //         isSpecificLocation: false,
      //         devices: reduce(
      //           location.devices,
      //           (result, machine) => {
      //             return {
      //               ...result,
      //               [machine.device_mac]: {
      //                 ...initialState,
      //                 inhandId: machine.inhand_id,
      //                 machineName: machine.device_name,
      //                 machineMac: machine.device_mac,
      //                 locationId: location.zone_id,
      //                 locationName: location.zone_name,
      //               },
      //             };
      //           },
      //           {}
      //         ),
      //       },
      //     };
      //   },
      //   {}
      // );
    },
  },
});

export default essDataConsumptionSlice;
export const selectEssDataConsumption = (state) => state.essDataConsumption;
export const {
  essDataConsumptionSpecificLocationSelectMachineHandler,
  essDataConsumptionHandleSelectIndividualMachine,
  essDataConsumptionHandleUnSelectIndividualMachine,
  essDataConsumptionSpecificLocationUnselectMachineHandler,
  handleEssDataConsumptionLocation,
} = essDataConsumptionSlice.actions;
