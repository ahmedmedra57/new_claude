


import { freezeSwitchDeviceService, postEssCommand } from '../../services';
import { freezeBlowerDeviceService, postTgsCommand, postTesCommand } from '../../services';
import EssControlBox from '../ess/EssControlBox';
import TgsControlBox from '../tgs/TgsControlBox';
import TesControlBox from '../tes/TesControlBox';

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
      handleOpenMachineController: handleOpenMachineController,
      handleExpandSSRDetail: handleExpandSSRDetail,
      handleUnselectAllProgram: essHandleUnselectAllProgram,
    },

    // Services
    freezeDeviceService: freezeSwitchDeviceService,
    postCommand: postEssCommand,

    // Components
    ControlBox: EssControlBox,

    // Configuration
    systemType: 'ESS',
    systemName: 'ess',
    energyUnit: 'kw',
    energySource: 'energy',
    useSSRQueries: true,

    // Features
    hasFanOnly: false,

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
      handleOpenMachineController: tgsHandleOpenMachineController,
      handleFanOnly: tgsHandleFanOnly,
      handleUnselectAllProgram: tgsHandleUnselectAllProgram,
    },

    // Services
    freezeDeviceService: (isOff, deviceMac, userId) =>
      freezeBlowerDeviceService(isOff, deviceMac, userId, 'TGS'),
    postCommand: postTgsCommand,

    // Components
    ControlBox: TgsControlBox,

    // Configuration
    systemType: 'TGS',
    systemName: 'tgs',
    energyUnit: 'FT³/M³', // Changes based on isF
    energySource: 'gas',
    useSSRQueries: false,

    // Features
    hasFanOnly: true,

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
      handleOpenMachineController: tesHandleOpenMachineController,
      handleExpandSSRDetail: tesHandleExpandSSRDetail,
      handleUnselectAllProgram: tesHandleUnselectAllProgram,
    },

    // Services
    freezeDeviceService: (isOff, deviceMac, userId) =>
      freezeBlowerDeviceService(isOff, deviceMac, userId, 'TES'),
    postCommand: postTesCommand,

    // Components
    ControlBox: TesControlBox,

    // Configuration
    systemType: 'TES',
    systemName: 'tes',
    energyUnit: 'kw',
    energySource: 'energy',
    useSSRQueries: true,

    // Features
    hasFanOnly: false,

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
