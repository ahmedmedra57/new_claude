import {
  handleInstantHeat,
  handleInstantHeatOff,
  handleInstantHeatReady,
  handleOpenMachineController,
  handleShutOff,
  handleShutOn,
  handleSnowSensor,
  handleSnowSensorOff,
<<<<<<< HEAD:src/components/commonComponentsMC/systemConfigs.js
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
=======
  selectEssSwitch,
  essHandleUnselectAllProgram,
  handleExpandSSRDetail,
>>>>>>> 9cf9a32773896e201f614a12d99dd6469d3b32ed:components/commonComponentsMC/systemConfigs.js
} from '../store/slices/essSwitchSlice';

import {
  tgsHandleInstantHeatOff,
  tgsHandleShutOff,
  tgsHandleSnowSensor,
  tgsHandleSnowSensorOff,
<<<<<<< HEAD:src/components/commonComponentsMC/systemConfigs.js
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
=======
  selectTgsSwitch,
  tgsHandleOpenMachineController,
  tgsHandleFanOnly,
  tgsHandleUnselectAllProgram,
  tgsHandleInstantHeatIsReady,
>>>>>>> 9cf9a32773896e201f614a12d99dd6469d3b32ed:components/commonComponentsMC/systemConfigs.js
} from '../store/slices/tgsSwitchSlice';

import {
  tesHandleInstantHeatOff,
  tesHandleShutOff,
  tesHandleSnowSensor,
  tesHandleSnowSensorOff,
<<<<<<< HEAD:src/components/commonComponentsMC/systemConfigs.js
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
=======
>>>>>>> 9cf9a32773896e201f614a12d99dd6469d3b32ed:components/commonComponentsMC/systemConfigs.js
  selectTesSwitch,
  tesHandleOpenMachineController,
  tesHandleExpandSSRDetail,
  tesHandleUnselectAllProgram,
<<<<<<< HEAD:src/components/commonComponentsMC/systemConfigs.js
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
=======
  tesHandleInstantHeatIsReady,
} from '../store/slices/tesSwitchSlice';

import { freezeSwitchDeviceService, postEssCommand } from '../../services';
import { freezeBlowerDeviceService, postTgsCommand, postTesCommand } from '../../services';
import EssControlBox from '../ess/EssControlBox';
import TgsControlBox from '../tgs/TgsControlBox';
import TesControlBox from '../tes/TesControlBox';
>>>>>>> 9cf9a32773896e201f614a12d99dd6469d3b32ed:components/commonComponentsMC/systemConfigs.js

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
<<<<<<< HEAD:src/components/commonComponentsMC/systemConfigs.js
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
=======
      handleOpenMachineController: handleOpenMachineController,
      handleExpandSSRDetail: handleExpandSSRDetail,
      handleUnselectAllProgram: essHandleUnselectAllProgram,
>>>>>>> 9cf9a32773896e201f614a12d99dd6469d3b32ed:components/commonComponentsMC/systemConfigs.js
    },

    // Services
    freezeDeviceService: freezeSwitchDeviceService,
    postCommand: postEssCommand,
<<<<<<< HEAD:src/components/commonComponentsMC/systemConfigs.js
    getZones: getEssZones,

    // Components
    ControlBox: ControlBox,
    ControlBoxComponent: ControlBox,
=======

    // Components
    ControlBox: EssControlBox,
>>>>>>> 9cf9a32773896e201f614a12d99dd6469d3b32ed:components/commonComponentsMC/systemConfigs.js

    // Configuration
    systemType: 'ESS',
    systemName: 'ess',
    energyUnit: 'kw',
    energySource: 'energy',
    useSSRQueries: true,
<<<<<<< HEAD:src/components/commonComponentsMC/systemConfigs.js
    hasSSRQueries: true,

    // Features
    hasFanOnly: false,
    hasThermocouples: true,
    requiresPermissionCheck: true,
=======

    // Features
    hasFanOnly: false,
>>>>>>> 9cf9a32773896e201f614a12d99dd6469d3b32ed:components/commonComponentsMC/systemConfigs.js

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
<<<<<<< HEAD:src/components/commonComponentsMC/systemConfigs.js
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
=======
      handleOpenMachineController: tgsHandleOpenMachineController,
      handleFanOnly: tgsHandleFanOnly,
      handleUnselectAllProgram: tgsHandleUnselectAllProgram,
>>>>>>> 9cf9a32773896e201f614a12d99dd6469d3b32ed:components/commonComponentsMC/systemConfigs.js
    },

    // Services
    freezeDeviceService: (isOff, deviceMac, userId) =>
      freezeBlowerDeviceService(isOff, deviceMac, userId, 'TGS'),
    postCommand: postTgsCommand,
<<<<<<< HEAD:src/components/commonComponentsMC/systemConfigs.js
    getZones: getTgsZones,

    // Components
    ControlBox: ControlBox,
    ControlBoxComponent: ControlBox,
=======

    // Components
    ControlBox: TgsControlBox,
>>>>>>> 9cf9a32773896e201f614a12d99dd6469d3b32ed:components/commonComponentsMC/systemConfigs.js

    // Configuration
    systemType: 'TGS',
    systemName: 'tgs',
    energyUnit: 'FT³/M³', // Changes based on isF
    energySource: 'gas',
    useSSRQueries: false,
<<<<<<< HEAD:src/components/commonComponentsMC/systemConfigs.js
    hasSSRQueries: false,

    // Features
    hasFanOnly: true,
    hasThermocouples: false,
    requiresPermissionCheck: false,
=======

    // Features
    hasFanOnly: true,
>>>>>>> 9cf9a32773896e201f614a12d99dd6469d3b32ed:components/commonComponentsMC/systemConfigs.js

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
<<<<<<< HEAD:src/components/commonComponentsMC/systemConfigs.js
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
=======
      handleOpenMachineController: tesHandleOpenMachineController,
      handleExpandSSRDetail: tesHandleExpandSSRDetail,
      handleUnselectAllProgram: tesHandleUnselectAllProgram,
>>>>>>> 9cf9a32773896e201f614a12d99dd6469d3b32ed:components/commonComponentsMC/systemConfigs.js
    },

    // Services
    freezeDeviceService: (isOff, deviceMac, userId) =>
      freezeBlowerDeviceService(isOff, deviceMac, userId, 'TES'),
    postCommand: postTesCommand,
<<<<<<< HEAD:src/components/commonComponentsMC/systemConfigs.js
    getZones: getTesZones,

    // Components
    ControlBox: ControlBox,
    ControlBoxComponent: ControlBox,
=======

    // Components
    ControlBox: TesControlBox,
>>>>>>> 9cf9a32773896e201f614a12d99dd6469d3b32ed:components/commonComponentsMC/systemConfigs.js

    // Configuration
    systemType: 'TES',
    systemName: 'tes',
    energyUnit: 'kw',
    energySource: 'energy',
    useSSRQueries: true,
<<<<<<< HEAD:src/components/commonComponentsMC/systemConfigs.js
    hasSSRQueries: true,

    // Features
    hasFanOnly: false,
    hasThermocouples: true,
    requiresPermissionCheck: false,
=======

    // Features
    hasFanOnly: false,
>>>>>>> 9cf9a32773896e201f614a12d99dd6469d3b32ed:components/commonComponentsMC/systemConfigs.js

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
