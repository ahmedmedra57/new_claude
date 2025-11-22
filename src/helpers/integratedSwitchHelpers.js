import { convertFahrenheitToCelsius } from './helpers';
import {
  getCommandNumberService,
  updateBlowersMasterControlService,
  updateSwitchesMasterControlService,
} from '../services';

/**
 * Get all switches for a specific zone/location
 */
export const getSwitchesForZone = (location, switchStatus, locations, swtName) => {
  if (!location || !switchStatus || !switchStatus[location]) return [];
  if (!locations || !locations[swtName]) return [];

  const switches = [];
  const locationData = switchStatus[location];

  if (locationData.isSpecificLocation && locationData.subLocations) {
    // Has specific locations (sub-locations)
    Object.keys(locationData.subLocations).forEach((specificLocation) => {
      const specificLocationData = locationData.subLocations[specificLocation];
      if (specificLocationData && specificLocationData.devices) {
        Object.keys(specificLocationData.devices).forEach((machine) => {
          switches.push({
            id: machine,
            location: specificLocation,
            parentLocation: location,
            isSpecificLocation: true,
            specificLocationData: locations[swtName][specificLocation] || {},
            machine,
          });
        });
      }
    });
  } else if (locationData.devices) {
    // Direct switches under location
    Object.keys(locationData.devices).forEach((machine) => {
      switches.push({
        id: machine,
        location: location,
        parentLocation: null,
        isSpecificLocation: false,
        locationData: locations[swtName][location] || {},
        machine,
      });
    });
  }

  return switches;
};

/**
 * Calculate number of switches in a location
 */
export const getLocationSwitchCount = (location, switchStatus) => {
  if (!location || !switchStatus || !switchStatus[location]) return 0;

  const locationData = switchStatus[location];

  if (locationData.isSpecificLocation && locationData.subLocations) {
    return Object.keys(locationData.subLocations).reduce((acc, subLoc) => {
      const subLocation = locationData.subLocations[subLoc];
      if (subLocation && subLocation.devices) {
        return acc + Object.keys(subLocation.devices).length;
      }
      return acc;
    }, 0);
  }

  return Object.keys(locationData.devices || {}).length;
};

/**
 * Get command number and send control command to backend
 */
export const commandNumberServiceHandler = (
  machineIds,
  FC,
  checkOption,
  option,
  swtSystem,
  btnState,
  isF
) => {
  const isOn = btnState ? 1 : 0;

  getCommandNumberService('FAST_MASTER_CONTROL').then((commandNumber) => {
    if (checkOption === 'instantHeatOn') {
      FC(machineIds, swtSystem, {
        commandNumber: commandNumber,
        instant_temp: isF ? convertFahrenheitToCelsius(option) : option,
        on_switch: 1,
        actionType: 'FAST_MASTER_CONTROL',
      });
    } else if (checkOption === 'instantHeatOff') {
      FC(machineIds, swtSystem, {
        commandNumber: commandNumber,
        on_switch: 0,
        actionType: 'FAST_MASTER_CONTROL',
      });
    } else if (checkOption === 'snowSensorOn') {
      FC(machineIds, swtSystem, {
        commandNumber: commandNumber,
        snow_enabled: 1,
        actionType: 'FAST_MASTER_CONTROL',
      });
    } else {
      FC(machineIds, swtSystem, {
        commandNumber: commandNumber,
        snow_enabled: 0,
        actionType: 'FAST_MASTER_CONTROL',
      });
    }
  });
};

/**
 * Get appropriate service function based on system type
 */
export const getServiceForSystemType = (swtSystem) => {
  switch (swtSystem) {
    case 'ess':
      return { service: updateSwitchesMasterControlService, systemName: 'ESS' };
    case 'tgs':
      return { service: updateBlowersMasterControlService, systemName: 'TGS' };
    case 'tes':
      return { service: updateBlowersMasterControlService, systemName: 'TES' };
    default:
      return null;
  }
};

/**
 * Loop through machines in a location and dispatch actions
 */
export const loopMachinesAndDispatchHandler = (
  checkOption,
  location,
  specificLocation,
  option,
  dispatchFC,
  swtSystem,
  btnState,
  switchStatus,
  switchStatusE,
  dispatch,
  isF
) => {
  if (!location || !switchStatus || !switchStatusE) return;
  if (!switchStatus[location]) return;

  let machineIds = [];

  if (switchStatus[location]?.isSpecificLocation) {
    const subLocations = switchStatus[location].subLocations;
    if (subLocations) {
      Object.keys(subLocations).forEach((subLocation) => {
        const devices = subLocations[subLocation]?.devices;
        if (devices && switchStatusE[subLocation]) {
          Object.keys(devices).forEach((machine) => {
            if (switchStatusE[subLocation][machine]?.deviceMac) {
              machineIds.push(switchStatusE[subLocation][machine].deviceMac);

              if (checkOption === 'instantHeatOn') {
                dispatch(dispatchFC({ location: subLocation, machine, temp: option, isF }));
              } else if (checkOption === 'fanOnly') {
                dispatch(dispatchFC({ location: subLocation, machine, state: option }));
              } else {
                dispatch(dispatchFC({ location: subLocation, machine }));
              }
            }
          });
        }
      });
    }
  } else {
    if (switchStatusE[location]) {
      Object.keys(switchStatusE[location]).forEach((machine) => {
        if (switchStatusE[location][machine]?.deviceMac) {
          machineIds.push(switchStatusE[location][machine].deviceMac);

          if (checkOption === 'instantHeatOn') {
            dispatch(dispatchFC({ location, machine, temp: option, isF }));
          } else if (checkOption === 'fanOnly') {
            dispatch(dispatchFC({ location, machine, state: option }));
          } else {
            dispatch(dispatchFC({ location, machine }));
          }
        }
      });
    }
  }

  const serviceInfo = getServiceForSystemType(swtSystem);
  if (serviceInfo && machineIds.length > 0) {
    commandNumberServiceHandler(
      machineIds,
      serviceInfo.service,
      checkOption,
      option,
      serviceInfo.systemName,
      btnState,
      isF
    );
  }
};

/**
 * Handle control actions in header (instant heat, snow sensor, fan only)
 */
export const createControllerHandler = (
  swtName,
  dispatch,
  switchHandlers,
  loopHandler,
  switchStatus,
  switchStatusE,
  isF
) => {
  return (btn, state, location, temp, specificLocation) => {
    const handlers = switchHandlers[swtName];

    if (btn === 'instantHeat') {
      if (state === 'on') {
        loopHandler(
          'instantHeatOn',
          location,
          specificLocation,
          temp,
          handlers.instantHeatReady,
          swtName,
          true,
          switchStatus,
          switchStatusE,
          dispatch,
          isF
        );
      } else {
        loopHandler(
          'instantHeatOff',
          location,
          specificLocation,
          null,
          handlers.instantHeatOff,
          swtName,
          false,
          switchStatus,
          switchStatusE,
          dispatch,
          isF
        );
      }
    } else if (btn === 'snowSensor') {
      if (state === 'off') {
        loopHandler(
          false,
          location,
          specificLocation,
          null,
          handlers.snowSensorOff,
          swtName,
          false,
          switchStatus,
          switchStatusE,
          dispatch,
          isF
        );
      } else {
        loopHandler(
          'snowSensorOn',
          location,
          specificLocation,
          null,
          handlers.snowSensor,
          swtName,
          true,
          switchStatus,
          switchStatusE,
          dispatch,
          isF
        );
      }
    } else if (btn === 'fanOnly') {
      if (state === 'off') {
        loopHandler(
          'fanOnly',
          location,
          specificLocation,
          false,
          handlers.fanOnly,
          swtName,
          false,
          switchStatus,
          switchStatusE,
          dispatch,
          isF
        );
      } else {
        loopHandler(
          'fanOnly',
          location,
          specificLocation,
          true,
          handlers.fanOnly,
          swtName,
          true,
          switchStatus,
          switchStatusE,
          dispatch,
          isF
        );
      }
    }
  };
};
