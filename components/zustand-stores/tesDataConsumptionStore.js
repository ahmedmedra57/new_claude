import { createStore } from './storeUtils';
import reduce from 'lodash/reduce';

const initialState = {
  isSelected: false,
  heatingSystemAbbr: '#20 s.t.',
  usageHours: 50,
  energyConsump: 700,
};

const useTesDataConsumptionStore = createStore('tesDataConsumption', (set) => ({
  tesDataConsumptionSwitch: {},
  tesDataConsumptionSwitchSpecificLocation: {},

  selectIndividualMachine: (location, machine) => set((state) => {
    state.tesDataConsumptionSwitch[location][machine].isSelected = true;
  }),

  selectSpecificLocationMachine: (location, specificLocation, machine) => set((state) => {
    state.tesDataConsumptionSwitchSpecificLocation[location].subLocations[
      specificLocation
    ].devices[machine].isSelected = true;
  }),

  unselectIndividualMachine: (location, machine) => set((state) => {
    state.tesDataConsumptionSwitch[location][machine].isSelected = false;
  }),

  unselectSpecificLocationMachine: (location, specificLocation, machine) => set((state) => {
    state.tesDataConsumptionSwitch[location][specificLocation][machine] = false;
  }),

  setTesDataConsumptionLocation: (data) => set((state) => {
    state.tesDataConsumptionSwitch = reduce(
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

    state.tesDataConsumptionSwitchSpecificLocation = reduce(
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

export default useTesDataConsumptionStore;
