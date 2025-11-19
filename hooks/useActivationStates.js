import { useMemo } from 'react';

/**
 * Custom hook to calculate activation states for all programs
 * Replaces ~25 lines of useMemo logic per component
 *
 * @param {object} switchData - The switch data from Redux
 * @param {string} systemName - 'ess', 'tgs', or 'tes'
 * @returns {object} - Activation state booleans for all programs
 */
const useActivationStates = (switchData, systemName = 'ess') => {
  const heatingScheduleActivated = useMemo(() => {
    return (
      switchData?.heatingSchedule?.isActivated &&
      switchData?.op_mode === 'SCHEDULE'
    );
  }, [switchData]);

  const snowSensorActivated = useMemo(() => {
    return (
      switchData?.snowSensor?.isActivated &&
      switchData?.op_mode === 'SNOW'
    );
  }, [switchData]);

  const instantHeatActivated = useMemo(() => {
    return (
      switchData?.instantHeat?.isActivated &&
      switchData?.op_mode === 'SWITCH'
    );
  }, [switchData]);

  const windFactorActivated = useMemo(() => {
    return (
      switchData?.windFactor?.isActivated &&
      switchData?.op_mode === 'WIND'
    );
  }, [switchData]);

  const constantTempActivated = useMemo(() => {
    return (
      switchData?.optionalConstantTemp?.isActivated &&
      switchData?.op_mode === 'CONSTANT'
    );
  }, [switchData]);

  const fanOnlyActivated = useMemo(() => {
    if (systemName !== 'tgs') return false;
    return (
      switchData?.fanOnly?.isActivated &&
      switchData?.op_mode === 'FAN'
    );
  }, [switchData, systemName]);

  return {
    heatingScheduleActivated,
    snowSensorActivated,
    instantHeatActivated,
    windFactorActivated,
    constantTempActivated,
    fanOnlyActivated,
  };
};

export default useActivationStates;
