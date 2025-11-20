import { useState, useCallback } from 'react';
import { systemConfigs } from '../components/commonComponentsMC/systemConfigs';
import { convertFahrenheitToCelsius } from '../helpers/helpers';
import { useESSSwitchStore, useTGSSwitchStore, useTESSwitchStore } from '../components/zustand-stores';

/**
 * Custom hook for switch control actions
 * Handles shutOff, snowSensor, instantHeat, and fanOnly (TGS only)
 * Works for ESS, TGS, and TES systems
 *
 * @param {string} systemName - 'ess', 'tgs', or 'tes'
 * @param {string} location - Location ID
 * @param {string} machine - Machine ID
 * @param {string} deviceMac - Device MAC address
 * @param {string} userId - Current user ID
 * @param {boolean} isF - Is Fahrenheit (vs Celsius)
 * @returns {Object} - Control handlers and state
 */
const useSwitchControls = (
  systemName,
  location,
  machine,
  deviceMac,
  userId,
  isF = true
) => {
  const config = systemConfigs[systemName];

  // Get the appropriate store based on system name
  const storeMap = {
    ess: useESSSwitchStore,
    tgs: useTGSSwitchStore,
    tes: useTESSwitchStore,
  };
  const switchStore = storeMap[systemName]();

  const [openMessageBox, setOpenMessageBox] = useState(false);
  const [messageTitle, setMessageTitle] = useState('');
  const [message, setMessage] = useState('');

  /**
   * Handle shut off/on toggle
   */
  const handleShutOff = useCallback(
    (isCurrentlyOff) => {
      config.freezeDeviceService(!isCurrentlyOff, deviceMac, userId)
        .then(() => {
          switchStore.setShutOff(location, machine);
        })
        .catch((err) => {
          console.error('Error toggling shut off:', err);
        });
    },
    [config, deviceMac, userId, switchStore, location, machine]
  );

  /**
   * Handle snow sensor toggle
   */
  const handleSnowSensor = useCallback(
    (isCurrentlyReady) => {
      if (isCurrentlyReady) {
        config.postCommand(deviceMac, 'snow_enabled', 0);
        switchStore.setSnowSensorOff(location, machine);
      } else {
        config.postCommand(deviceMac, 'snow_enabled', 1);
        switchStore.setSnowSensor(location, machine);
      }
    },
    [config, deviceMac, switchStore, location, machine]
  );

  /**
   * Handle fan only (TGS only)
   */
  const handleFanOnly = useCallback(
    (isCurrentlyOn) => {
      if (config.hasFanOnly) {
        switchStore.setFanOnly(location, machine, !isCurrentlyOn);
      }
    },
    [config, switchStore, location, machine]
  );

  /**
   * Show temperature input message
   */
  const showTemperatureMessage = useCallback((title) => {
    setMessageTitle(title);
    setMessage([
      `in order to finalize instant heat program, `,
      'please input your temperature',
      '( the minimum temperature is 121°C - 250°F )',
      '( the maximum temperature is 999°C - 1830°F )',
    ]);
    setOpenMessageBox(true);
  }, []);

  /**
   * Close message box
   */
  const closeMessageBox = useCallback(() => {
    setOpenMessageBox(false);
  }, []);

  /**
   * Handle instant heat activation/deactivation
   */
  const handleInstantHeat = useCallback(
    (inputTemp, isCurrentlyActivated, isCurrentlyReady, title) => {
      const temp = Number(inputTemp.match(/\d+/)?.[0]);

      if (isCurrentlyActivated || isCurrentlyReady) {
        // Turn off instant heat
        config.postCommand(deviceMac, 'on_switch', 0);
        switchStore.setInstantHeatOff(location, machine);
      } else {
        // Validate temperature
        const minTemp = isF ? 250 : 121;
        const maxTemp = isF ? 1830 : 999;

        if (temp >= minTemp && temp <= maxTemp) {
          config.postCommand(deviceMac, 'on_switch', 1);
          config.postCommand(
            deviceMac,
            'instant_temp',
            isF ? convertFahrenheitToCelsius(temp) : temp
          );
          switchStore.setInstantHeatReady(location, machine, temp, isF);
        } else {
          showTemperatureMessage(title);
        }
      }
    },
    [config, deviceMac, isF, switchStore, location, machine, showTemperatureMessage]
  );

  /**
   * Handle machine detail toggle
   */
  const handleMachineDetailToggle = useCallback(
    (isCurrentlyOpen) => {
      switchStore.setOpenMachineController(location, machine, !isCurrentlyOpen);

      if (isCurrentlyOpen) {
        switchStore.setUnselectAllProgram(location, machine);
      }
    },
    [switchStore, location, machine]
  );

  /**
   * Main button click handler
   */
  const handleButtonClick = useCallback(
    (btnName, currentState = {}) => {
      switch (btnName) {
        case 'shutOff':
          handleShutOff(currentState.isOff);
          break;
        case 'snowSensor':
          handleSnowSensor(currentState.isReady);
          break;
        case 'fanOnly':
          handleFanOnly(currentState.fanOnly);
          break;
        default:
          break;
      }
    },
    [handleShutOff, handleSnowSensor, handleFanOnly]
  );

  return {
    // Handlers
    handleShutOff,
    handleSnowSensor,
    handleFanOnly,
    handleInstantHeat,
    handleMachineDetailToggle,
    handleButtonClick,

    // Message state
    openMessageBox,
    messageTitle,
    message,
    showTemperatureMessage,
    closeMessageBox,
    setOpenMessageBox,
  };
};

export default useSwitchControls;
