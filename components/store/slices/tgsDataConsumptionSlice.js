import { createSlice } from '@reduxjs/toolkit';
import reduce from 'lodash/reduce';

const initialState = {
  isSelected: false,
  // telemetry
  heatingSystemAbbr: '#50 s.t.',
  usageHours: 650,
  energyConsump: 1200,
  //
};

const tgsDataConsumptionSlice = createSlice({
  name: 'tgsDataConsumption',
  initialState: {
    tgsDataConsumptionSwitch: {},
  },
  tgsDataConsumptionSwitchSpecificLocation: {},
  reducers: {
    tgsDataConsumptionHandleSelectIndividualMachine: (state, action) => {
      state.tgsDataConsumptionSwitch[action.payload.location][
        action.payload.machine
      ].isSelected = true;
    },
    tgsDataConsumptionSpecificLocationSelectMachineHandler: (state, action) => {
      state.tgsDataConsumptionSwitchSpecificLocation[action.payload.location].subLocations[
        action.payload.specificLocation
      ].devices[action.payload.machine].isSelected = true;
    },
    tgsDataConsumptionHandleUnSelectIndividualMachine: (state, action) => {
      state.tgsDataConsumptionSwitch[action.payload.location][
        action.payload.machine
      ].isSelected = false;
    },
    tgsDataConsumptionSpecificLocationUnselectMachineHandler: (
      state,
      action
    ) => {
      state.tgsDataConsumptionSwitch[action.payload.location][
        action.payload.specificLocation
      ][action.payload.machine] = false;
    },
    handleTgsDataConsumptionLocation: (state, action) => {
      state.tgsDataConsumptionSwitch = reduce(
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
      state.tgsDataConsumptionSwitchSpecificLocation = reduce(
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
    },
  },
});

export default tgsDataConsumptionSlice;
export const selectTgsDataConsumption = (state) => state.tgsDataConsumption;
export const {
  tgsDataConsumptionHandleSelectIndividualMachine,
  tgsDataConsumptionSpecificLocationSelectMachineHandler,
  tgsDataConsumptionHandleUnSelectIndividualMachine,
  tgsDataConsumptionSpecificLocationUnselectMachineHandler,
  handleTgsDataConsumptionLocation,
} = tgsDataConsumptionSlice.actions;
