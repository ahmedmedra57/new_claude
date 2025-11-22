import {
  handleInstantHeat,
  handleInstantHeatOff,
  handleInstantHeatReady,
  handleOpenMachineController,
  handleShutOff,
  handleShutOn,
  handleSnowSensor,
  handleSnowSensorOff,
  handleWindFactor,
  handleWindFactorOff,
  handleReadyHeatingSchedule,
  handleClearHeatingSchedule,
  handleAddHeatingSchedule,
  handleOptionalConstantTempReady,
  handleMachineOptionalConstantTempOff,
  essHandleSelectProgram,
  selectEssSwitch,
  essHandleUnselectAllProgram,
  handleExpandSSRDetail,
  handleUnSelectIndividualMachine,
  essSpecificLocationUnselectMachinesHandler,
} from '../store/slices/essSwitchSlice';

import {
  tgsHandleInstantHeatOff,
  tgsHandleShutOff,
  tgsHandleSnowSensor,
  tgsHandleSnowSensorOff,
  tgsHandleWindFactor,
  tgsHandleWindFactorOff,
  tgsHandleReadyHeatingSchedule,
  tgsHandleClearHeatingSchedule,
  tgsHandleAddHeatingSchedule,
  tgsActivateConflictMessage,
  tgsDeactivateConflictMessage,
  tgsSetDevicesConflicts,
  selectTgsSwitch,
  tgsHandleOpenMachineController,
  tgsHandleExpandSSRDetail,
  tgsHandleFanOnly,
  tgsHandleUnselectAllProgram,
  tgsHandleSelectProgram,
  tgsHandleInstantHeatIsReady,
  tgsHandleUnSelectIndividualMachine,
  tgsSpecificLocationUnselectMachinesHandler,
} from '../store/slices/tgsSwitchSlice';

import {
  tesHandleInstantHeatOff,
  tesHandleShutOff,
  tesHandleSnowSensor,
  tesHandleSnowSensorOff,
  tesHandleWindFactor,
  tesHandleWindFactorOff,
  tesHandleReadyHeatingSchedule,
  tesHandleClearHeatingSchedule,
  tesHandleAddHeatingSchedule,
  tesHandleOptionalConstantTempIsReady,
  tesHandleOptionalConstantTempOff,
  tesActivateConflictMessage,
  tesDeactivateConflictMessage,
  tesSetDevicesConflicts,
  selectTesSwitch,
  tesHandleOpenMachineController,
  tesHandleExpandSSRDetail,
  tesHandleUnselectAllProgram,
  tesHandleSelectProgram,
  tesHandleInstantHeatIsReady,
  tesHandleUnSelectIndividualMachine,
  tesSpecificLocationUnselectMachinesHandler,
} from '../store/slices/tesSwitchSlice';

import {
  freezeSwitchDeviceService,
  postEssCommand,
  getEssZones,
  getTgsZones,
  getTesZones,
} from '../../services';
import { freezeBlowerDeviceService, postTgsCommand, postTesCommand } from '../../services';
import ControlBox from './ControlBox';

/**
 * System-specific configurations for ESS, TGS, and TES
 * This centralizes all differences between the three systems
 */

export const systemConfigs = {
  ess: {
    // Redux
    selectSwitch: selectEssSwitch,
    actions: {
      handleInstantHeatReady: handleInstantHeatReady,
      handleInstantHeatOff: handleInstantHeatOff,
      handleShutOff: handleShutOff,
      handleSnowSensor: handleSnowSensor,
      handleSnowSensorOff: handleSnowSensorOff,
      handleWindFactor: handleWindFactor,
      handleWindFactorOff: handleWindFactorOff,
      handleReadyHeatingSchedule: handleReadyHeatingSchedule,
      handleClearHeatingSchedule: handleClearHeatingSchedule,
      handleAddHeatingSchedule: handleAddHeatingSchedule,
      handleOptionalConstantTempReady: handleOptionalConstantTempReady,
      handleMachineOptionalConstantTempOff: handleMachineOptionalConstantTempOff,
      handleOpenMachineController: handleOpenMachineController,
      handleExpandSSRDetail: handleExpandSSRDetail,
      handleUnselectAllProgram: essHandleUnselectAllProgram,
      handleSelectProgram: essHandleSelectProgram,
      handleUnSelectIndividualMachine: handleUnSelectIndividualMachine,
      specificLocationUnselectMachinesHandler: essSpecificLocationUnselectMachinesHandler,
    },

    // Services
    freezeDeviceService: freezeSwitchDeviceService,
    postCommand: postEssCommand,
    getZones: getEssZones,

    // Components
    ControlBox: ControlBox,
    ControlBoxComponent: ControlBox,

    // Configuration
    systemType: 'ESS',
    systemName: 'ess',
    energyUnit: 'kw',
    energySource: 'energy',
    useSSRQueries: true,
    hasSSRQueries: true,

    // Features
    hasFanOnly: false,
    hasThermocouples: true,
    requiresPermissionCheck: true,

    // Display
    getHeaderTitle: (machineName, swtSize, applicationAbr, isMobile) =>
      isMobile ? `${machineName} #${swtSize}-ess` : `${machineName}  ${applicationAbr}.`,
  },

  tgs: {
    // Redux
    selectSwitch: selectTgsSwitch,
    actions: {
      handleInstantHeatReady: tgsHandleInstantHeatIsReady,
      handleInstantHeatOff: tgsHandleInstantHeatOff,
      handleShutOff: tgsHandleShutOff,
      handleSnowSensor: tgsHandleSnowSensor,
      handleSnowSensorOff: tgsHandleSnowSensorOff,
      handleWindFactor: tgsHandleWindFactor,
      handleWindFactorOff: tgsHandleWindFactorOff,
      handleReadyHeatingSchedule: tgsHandleReadyHeatingSchedule,
      handleClearHeatingSchedule: tgsHandleClearHeatingSchedule,
      handleAddHeatingSchedule: tgsHandleAddHeatingSchedule,
      tgsActivateConflictMessage: tgsActivateConflictMessage,
      tgsDeactivateConflictMessage: tgsDeactivateConflictMessage,
      tgsSetDevicesConflicts: tgsSetDevicesConflicts,
      handleOpenMachineController: tgsHandleOpenMachineController,
      handleExpandSSRDetail: tgsHandleExpandSSRDetail,
      handleFanOnly: tgsHandleFanOnly,
      handleUnselectAllProgram: tgsHandleUnselectAllProgram,
      handleSelectProgram: tgsHandleSelectProgram,
      handleUnSelectIndividualMachine: tgsHandleUnSelectIndividualMachine,
      specificLocationUnselectMachinesHandler: tgsSpecificLocationUnselectMachinesHandler,
    },

    // Services
    freezeDeviceService: (isOff, deviceMac, userId) =>
      freezeBlowerDeviceService(isOff, deviceMac, userId, 'TGS'),
    postCommand: postTgsCommand,
    getZones: getTgsZones,

    // Components
    ControlBox: ControlBox,
    ControlBoxComponent: ControlBox,

    // Configuration
    systemType: 'TGS',
    systemName: 'tgs',
    energyUnit: 'FT³/M³', // Changes based on isF
    energySource: 'gas',
    useSSRQueries: false,
    hasSSRQueries: false,

    // Features
    hasFanOnly: true,
    hasThermocouples: false,
    requiresPermissionCheck: false,

    // Display
    getHeaderTitle: (machineName, swtSize, applicationAbr, isMobile) =>
      isMobile ? `${machineName} #${swtSize}-tgs` : `${machineName} #${swtSize} ${applicationAbr}.`,
  },

  tes: {
    // Redux
    selectSwitch: selectTesSwitch,
    actions: {
      handleInstantHeatReady: tesHandleInstantHeatIsReady,
      handleInstantHeatOff: tesHandleInstantHeatOff,
      handleShutOff: tesHandleShutOff,
      handleSnowSensor: tesHandleSnowSensor,
      handleSnowSensorOff: tesHandleSnowSensorOff,
      handleWindFactor: tesHandleWindFactor,
      handleWindFactorOff: tesHandleWindFactorOff,
      handleReadyHeatingSchedule: tesHandleReadyHeatingSchedule,
      handleClearHeatingSchedule: tesHandleClearHeatingSchedule,
      handleAddHeatingSchedule: tesHandleAddHeatingSchedule,
      handleOptionalConstantTempReady: tesHandleOptionalConstantTempIsReady,
      handleMachineOptionalConstantTempOff: tesHandleOptionalConstantTempOff,
      tesActivateConflictMessage: tesActivateConflictMessage,
      tesDeactivateConflictMessage: tesDeactivateConflictMessage,
      tesSetDevicesConflicts: tesSetDevicesConflicts,
      handleOpenMachineController: tesHandleOpenMachineController,
      handleExpandSSRDetail: tesHandleExpandSSRDetail,
      handleUnselectAllProgram: tesHandleUnselectAllProgram,
      handleSelectProgram: tesHandleSelectProgram,
      handleUnSelectIndividualMachine: tesHandleUnSelectIndividualMachine,
      specificLocationUnselectMachinesHandler: tesSpecificLocationUnselectMachinesHandler,
    },

    // Services
    freezeDeviceService: (isOff, deviceMac, userId) =>
      freezeBlowerDeviceService(isOff, deviceMac, userId, 'TES'),
    postCommand: postTesCommand,
    getZones: getTesZones,

    // Components
    ControlBox: ControlBox,
    ControlBoxComponent: ControlBox,

    // Configuration
    systemType: 'TES',
    systemName: 'tes',
    energyUnit: 'kw',
    energySource: 'energy',
    useSSRQueries: true,
    hasSSRQueries: true,

    // Features
    hasFanOnly: false,
    hasThermocouples: true,
    requiresPermissionCheck: false,

    // Display
    getHeaderTitle: (machineName, swtSize, applicationAbr, isMobile) =>
      isMobile ? `${machineName} #${swtSize}-tes` : `${machineName} #${swtSize} ${applicationAbr}.`,
  },
};

/**
 * Get energy unit based on system and temperature preference
 */
export const getEnergyUnit = (systemName, isF) => {
  if (systemName === 'tgs') {
    return isF ? 'FT³' : 'M³';
  }
  return systemConfigs[systemName].energyUnit;
};

/**
 * Program icon mapping (shared across all systems)
 */
export const programIcons = {
  instantHeat: '/images/logo-instantHeat.svg',
  snowSensor: '/images/logo-snowSensor.svg',
  heatingSchedule: '/images/logo-schedule.svg',
  windFactor: '/images/logo-windFactor.svg',
  optionalConstantTemp: '/images/logo-constantTemp.svg',
  fanOnly: '/images/tgs-fanOnly.svg',
};
