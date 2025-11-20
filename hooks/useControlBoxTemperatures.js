import { useEffect, useState } from 'react';
import { useUnitsStore } from '../components/zustand-stores';
import { convertCelsiusToFahrenheit } from '../helpers/helpers';

/**
 * Custom hook to manage temperature state for ControlBox components
 * Replaces ~80 lines of useState + useEffect logic per component
 *
 * @param {object} switchData - The switch data from Zustand
 * @param {string} systemName - 'ess', 'tgs', or 'tes'
 * @returns {object} - Temperature states and unit
 */
const useControlBoxTemperatures = (switchData, systemName) => {
  const { isF } = useUnitsStore();
  const unit = isF ? '°F' : '°C';

  const {
    instantHeat,
    snowSensor,
    heatingScheduleList,
    optionalConstantTemp,
  } = switchData;

  // Temperature states
  const [instantHeatTemp, setInstantHeatTemp] = useState('');
  const [constantTemp, setConstantTemp] = useState('');
  const [schedulerTemp, setSchedulerTemp] = useState('');
  const [snowSensorTemp, setSnowSensorTemp] = useState('');

  // Sync instant heat temperature
  useEffect(() => {
    if (instantHeat?.inputTemp > 0) {
      setInstantHeatTemp(`${instantHeat.inputTemp} ${unit}`);
    } else {
      setInstantHeatTemp('');
    }
  }, [instantHeat, unit]);

  // Sync scheduler temperature
  useEffect(() => {
    if (heatingScheduleList?.[0]?.inputTemp > 0) {
      setSchedulerTemp(`${heatingScheduleList[0].inputTemp} ${unit}`);
    } else {
      setSchedulerTemp('');
    }
  }, [heatingScheduleList, unit]);

  // Sync snow sensor temperature
  useEffect(() => {
    if (snowSensor?.defaultTemp > 0) {
      const temp = isF
        ? convertCelsiusToFahrenheit(snowSensor.defaultTemp)
        : snowSensor.defaultTemp;
      setSnowSensorTemp(`${temp} ${unit}`);
    } else {
      setSnowSensorTemp('');
    }
  }, [snowSensor, isF, unit]);

  // Sync constant temperature (ESS and TES only)
  useEffect(() => {
    if (optionalConstantTemp?.inputTemp > 0) {
      setConstantTemp(`${optionalConstantTemp.inputTemp} ${unit}`);
    } else {
      setConstantTemp('');
    }
  }, [optionalConstantTemp, unit]);

  return {
    // Temperature values
    instantHeatTemp,
    constantTemp,
    schedulerTemp,
    snowSensorTemp,
    unit,
    isF,

    // Setters (for form inputs)
    setInstantHeatTemp,
    setConstantTemp,
    setSchedulerTemp,
    setSnowSensorTemp,
  };
};

export default useControlBoxTemperatures;
