import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectUserInfo } from '../components/store/slices/userSlice';
import { selectLocations } from '../components/store/slices/locationsSlice';
import { systemConfigs } from '../components/commonComponentsMC/systemConfigs';
import {
  calculateTotalEnergyConsumption,
  extractApplicationAbr,
  extractSwtSize,
} from '../helpers/helpers';

/**
 * Custom hook to get and process switch data for a specific machine
 * Works for ESS, TGS, and TES systems
 *
 * @param {string} location - Location ID
 * @param {string} machine - Machine ID
 * @param {string} systemName - 'ess', 'tgs', or 'tes'
 * @param {boolean} isMobile - Is mobile view
 * @param {boolean} isF - Is Fahrenheit (vs Celsius)
 * @returns {Object} - Processed switch data with computed values
 */
const useSwitchData = (location, machine, systemName, isMobile = false, isF = true) => {
  const config = systemConfigs[systemName];

  // Get switch data from Redux
  const { [systemName + 'Switch']: switchStatus, ['flat' + systemName.charAt(0).toUpperCase() + systemName.slice(1) + 'Switch']: flatSwitchStatus } =
    useSelector(config.selectSwitch);

  const switchData = flatSwitchStatus?.[location]?.[machine] || {};
  const locations = useSelector(selectLocations);
  const { user, allUsers } = useSelector(selectUserInfo);

  // Extract common data
  const {
    deviceMac,
    isFaults,
    isOff,
    instantHeat,
    snowSensor,
    optionalConstantTemp,
    heatingSystem,
    heatingSchedule,
    windFactor,
    isGp,
    isEbp,
    isWifi,
    openMachineController,
    mobileSelectedProgram,
    locationName,
    machineName,
    reading,
    isDisabled,
    freezeBy,
    fanOnly,
    isTESActive,
    isTGSActive,
    EBP_mode,
    switch_panels,
  } = switchData;

  // Computed values
  const locationData = locations[systemName]?.[location];
  const swtLocationName = locationData?.locationName;

  const freezeByUser = allUsers?.find((u) => u.user_id === freezeBy);
  const freezeByName = isOff && freezeByUser
    ? `${freezeByUser.firstname} ${freezeByUser.lastname}`
    : null;

  const swtSize = extractSwtSize(heatingSystem);
  const applicationAbr = extractApplicationAbr(heatingSystem);

  const headerTitle = config.getHeaderTitle(machineName, swtSize, applicationAbr, isMobile);

  const energyConsumption = useMemo(() => {
    return calculateTotalEnergyConsumption(reading, systemName, isF);
  }, [reading, systemName, isF]);

  const energyUnit = systemName === 'tgs' ? (isF ? 'FT³' : 'M³') : config.energyUnit;
  const energySource = config.energySource;

  // Program states
  const isActivated = instantHeat?.isActivated;
  const isReadyInstantHeat = instantHeat?.isReady;
  const isReady = snowSensor?.isReady;

  return {
    // Original data
    switchData,
    flatSwitchStatus,
    switchStatus,

    // Basic fields
    deviceMac,
    isFaults,
    isOff,
    instantHeat,
    snowSensor,
    optionalConstantTemp,
    heatingSystem,
    heatingSchedule,
    windFactor,
    isGp,
    isEbp,
    isWifi,
    openMachineController,
    mobileSelectedProgram,
    locationName,
    machineName,
    reading,
    isDisabled,
    freezeBy,
    fanOnly,
    isTESActive,
    isTGSActive,
    EBP_mode,
    switch_panels,

    // Location data
    locationData,
    swtLocationName,

    // User data
    userId: user?.user_id,
    freezeByUser,
    freezeByName,

    // Computed values
    swtSize,
    applicationAbr,
    headerTitle,
    energyConsumption,
    energyUnit,
    energySource,

    // Program states
    isActivated,
    isReadyInstantHeat,
    isReady,
  };
};

export default useSwitchData;
