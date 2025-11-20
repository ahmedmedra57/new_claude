import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { systemConfigs } from '../components/commonComponentsMC/systemConfigs';
import { convertFahrenheitToCelsius } from '../helpers/helpers';

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
  const dispatch = useDispatch();
  const config = systemConfigs[systemName];

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
          dispatch(config.actions.handleShutOff({ location, machine }));
        })
        .catch((err) => {
          console.error('Error toggling shut off:', err);
        });
    },
    [config, deviceMac, userId, dispatch, location, machine]
  );

  /**
   * Handle snow sensor toggle
   */
  const handleSnowSensor = useCallback(
    (isCurrentlyReady) => {
      if (isCurrentlyReady) {
        config.postCommand(deviceMac, 'snow_enabled', 0);
        dispatch(config.actions.handleSnowSensorOff({ location, machine }));
      } else {
        config.postCommand(deviceMac, 'snow_enabled', 1);
        dispatch(config.actions.handleSnowSensor({ location, machine }));
      }
    },
    [config, deviceMac, dispatch, location, machine]
  );

  /**
   * Handle fan only (TGS only)
   */
  const handleFanOnly = useCallback(
    (isCurrentlyOn) => {
      if (config.hasFanOnly) {
        dispatch(
          config.actions.handleFanOnly({
            location,
            machine,
            state: !isCurrentlyOn,
          })
        );
      }
    },
    [config, dispatch, location, machine]
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
        dispatch(config.actions.handleInstantHeatOff({ location, machine }));
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
          dispatch(
            config.actions.handleInstantHeatReady({
              location,
              machine,
              temp,
              isF,
            })
          );
        } else {
          showTemperatureMessage(title);
        }
      }
    },
    [config, deviceMac, isF, dispatch, location, machine, showTemperatureMessage]
  );

  /**
   * Handle machine detail toggle
   */
  const handleMachineDetailToggle = useCallback(
    (isCurrentlyOpen) => {
      dispatch(
        config.actions.handleOpenMachineController({
          location,
          machine,
          status: !isCurrentlyOpen,
        })
      );

      if (isCurrentlyOpen) {
        dispatch(config.actions.handleUnselectAllProgram({ location, machine }));
      }
    },
    [config, dispatch, location, machine]
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
