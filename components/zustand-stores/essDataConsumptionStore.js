import { createStore } from './storeUtils';
import { reduce } from 'lodash';

const initialState = {
  isSelected: false,
  heatingSystemAbbr: '#10 s.t.',
  usageHours: 75,
  energyConsump: 300,
};

const useEssDataConsumptionStore = createStore('essDataConsumption', (set) => ({
  essDataConsumptionSwitch: {},
  essDataConsumptionSwitchSpecificLocation: {},

  selectIndividualMachine: (location, machine) => set((state) => {
    state.essDataConsumptionSwitch[location][machine].isSelected = true;
  }),

  selectSpecificLocationMachine: (location, specificLocation, machine) => set((state) => {
    state.essDataConsumptionSwitchSpecificLocation[location].subLocations[
      specificLocation
    ].devices[machine].isSelected = true;
  }),

  unselectIndividualMachine: (location, machine) => set((state) => {
    state.essDataConsumptionSwitch[location][machine].isSelected = false;
  }),

  unselectSpecificLocationMachine: (location, specificLocation, machine) => set((state) => {
    state.essDataConsumptionSwitch[location][specificLocation][machine] = false;
  }),

  setEssDataConsumptionLocation: (data) => set((state) => {
    state.essDataConsumptionSwitch = reduce(
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
      },
      {}
    );

    state.essDataConsumptionSwitchSpecificLocation = reduce(
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
  }),
}));

export default useEssDataConsumptionStore;
