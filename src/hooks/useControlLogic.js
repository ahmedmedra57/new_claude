/**
 * Shared Control Logic Hooks
 *
 * Centralizes common logic for control components (InstantHeat, SnowSensor,
 * WindFactor, HeatingSchedule) to eliminate duplication across 3 implementations each.
 *
 * Each control type exists in 3 places:
 * 1. MC* controllers (for ControlBox)
 * 2. masterControlSwitches (for by-switch/by-location views)
 * 3. controls (for SectionController)
 */

import { useState, useEffect, useCallback } from 'react';
import { validateTemperatureInput, TEMP_RANGES } from '../utils/temperatureValidation';

/**
 * Shared logic for InstantHeat control
 * Handles temperature validation, state management, and submission
 */
export const useInstantHeatLogic = ({
  isF,
  initialTemp = '',
  onSuccess,
  onError,
  onTempMissing,
}) => {
  const [tempInput, setTempInput] = useState(initialTemp);

  useEffect(() => {
    setTempInput(initialTemp);
  }, [initialTemp]);

  const handleSubmit = useCallback((e) => {
    if (e) e.preventDefault();

    if (!tempInput || tempInput === '') {
      onTempMissing?.();
      return { success: false, reason: 'missing' };
    }

    const temp = Number(tempInput.match(/\d+/)?.[0] || tempInput);
    const validation = validateTemperatureInput(temp.toString(), isF, 'INSTANT_HEAT');

    if (validation.isValid) {
      onSuccess?.(temp);
      return { success: true, temp };
    } else {
      const range = TEMP_RANGES.INSTANT_HEAT[isF ? 'FAHRENHEIT' : 'CELSIUS'];
      onError?.({ range, errorKeys: validation.errorKeys });
      return { success: false, reason: 'invalid', range };
    }
  }, [tempInput, isF, onSuccess, onError, onTempMissing]);

  const reset = useCallback(() => {
    setTempInput('');
  }, []);

  return {
    tempInput,
    setTempInput,
    handleSubmit,
    reset,
  };
};

/**
 * Shared logic for SnowSensor control
 * Handles activation state and temperature management
 */
export const useSnowSensorLogic = ({
  isF,
  defaultTemp = 350,
  onActivate,
  onDeactivate,
}) => {
  const [isReady, setIsReady] = useState(false);

  const handleToggle = useCallback((currentState) => {
    if (currentState) {
      onDeactivate?.();
      setIsReady(false);
      return { activated: false };
    } else {
      onActivate?.(defaultTemp);
      setIsReady(true);
      return { activated: true, temp: defaultTemp };
    }
  }, [defaultTemp, onActivate, onDeactivate]);

  const reset = useCallback(() => {
    setIsReady(false);
  }, []);

  return {
    isReady,
    setIsReady,
    handleToggle,
    reset,
  };
};

/**
 * Shared logic for WindFactor control
 * Handles activation state management
 */
export const useWindFactorLogic = ({
  onActivate,
  onDeactivate,
}) => {
  const [isReady, setIsReady] = useState(false);

  const handleToggle = useCallback((currentState) => {
    if (currentState) {
      onDeactivate?.();
      setIsReady(false);
      return { activated: false };
    } else {
      onActivate?.();
      setIsReady(true);
      return { activated: true };
    }
  }, [onActivate, onDeactivate]);

  const reset = useCallback(() => {
    setIsReady(false);
  }, []);

  return {
    isReady,
    setIsReady,
    handleToggle,
    reset,
  };
};

/**
 * Shared logic for HeatingSchedule control
 * Handles schedule validation and submission
 */
export const useHeatingScheduleLogic = ({
  isF,
  onSuccess,
  onError,
  onValidationError,
}) => {
  const [scheduleData, setScheduleData] = useState({
    start: { date: null, time: null },
    end: { date: null, time: null },
    inputTemp: '',
  });

  const validateSchedule = useCallback(() => {
    const { start, end, inputTemp } = scheduleData;

    // Check if all required fields are present
    if (!start.date || !start.time || !end.date || !end.time || !inputTemp) {
      onValidationError?.({ reason: 'missing_fields' });
      return { valid: false, reason: 'missing_fields' };
    }

    // Validate temperature
    const temp = Number(inputTemp);
    const validation = validateTemperatureInput(temp.toString(), isF, 'HEATING_SCHEDULE');

    if (!validation.isValid) {
      const range = TEMP_RANGES.HEATING_SCHEDULE[isF ? 'FAHRENHEIT' : 'CELSIUS'];
      onError?.({ range, errorKeys: validation.errorKeys });
      return { valid: false, reason: 'invalid_temp', range };
    }

    // Validate dates (end must be after start)
    const startDateTime = new Date(`${start.date} ${start.time}`);
    const endDateTime = new Date(`${end.date} ${end.time}`);

    if (endDateTime <= startDateTime) {
      onValidationError?.({ reason: 'invalid_date_range' });
      return { valid: false, reason: 'invalid_date_range' };
    }

    return { valid: true };
  }, [scheduleData, isF, onError, onValidationError]);

  const handleSubmit = useCallback((e) => {
    if (e) e.preventDefault();

    const validation = validateSchedule();

    if (validation.valid) {
      onSuccess?.(scheduleData);
      return { success: true, data: scheduleData };
    }

    return { success: false, ...validation };
  }, [scheduleData, validateSchedule, onSuccess]);

  const updateScheduleField = useCallback((field, value) => {
    setScheduleData(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const reset = useCallback(() => {
    setScheduleData({
      start: { date: null, time: null },
      end: { date: null, time: null },
      inputTemp: '',
    });
  }, []);

  return {
    scheduleData,
    setScheduleData,
    updateScheduleField,
    validateSchedule,
    handleSubmit,
    reset,
  };
};

/**
 * Shared logic for Optional Constant Temperature control
 * Similar to InstantHeat but with different temperature ranges
 */
export const useOptionalConstantTempLogic = ({
  isF,
  initialTemp = '',
  onSuccess,
  onError,
  onTempMissing,
}) => {
  const [tempInput, setTempInput] = useState(initialTemp);

  useEffect(() => {
    setTempInput(initialTemp);
  }, [initialTemp]);

  const handleSubmit = useCallback((e) => {
    if (e) e.preventDefault();

    if (!tempInput || tempInput === '') {
      onTempMissing?.();
      return { success: false, reason: 'missing' };
    }

    const temp = Number(tempInput.match(/\d+/)?.[0] || tempInput);
    const validation = validateTemperatureInput(temp.toString(), isF, 'OPTIONAL_CONSTANT');

    if (validation.isValid) {
      onSuccess?.(temp);
      return { success: true, temp };
    } else {
      const range = TEMP_RANGES.OPTIONAL_CONSTANT[isF ? 'FAHRENHEIT' : 'CELSIUS'];
      onError?.({ range, errorKeys: validation.errorKeys });
      return { success: false, reason: 'invalid', range };
    }
  }, [tempInput, isF, onSuccess, onError, onTempMissing]);

  const reset = useCallback(() => {
    setTempInput('');
  }, []);

  return {
    tempInput,
    setTempInput,
    handleSubmit,
    reset,
  };
};

/**
 * Hook for managing control activation states
 * Shared across all control types
 */
export const useControlActivation = (initialState = {
  isActivated: false,
  isReady: false,
  isDisabled: false,
}) => {
  const [state, setState] = useState(initialState);

  const activate = useCallback(() => {
    setState(prev => ({ ...prev, isActivated: true, isReady: false }));
  }, []);

  const deactivate = useCallback(() => {
    setState(prev => ({ ...prev, isActivated: false, isReady: false }));
  }, []);

  const setReady = useCallback((ready) => {
    setState(prev => ({ ...prev, isReady: ready }));
  }, []);

  const setDisabled = useCallback((disabled) => {
    setState(prev => ({ ...prev, isDisabled: disabled }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, [initialState]);

  return {
    ...state,
    activate,
    deactivate,
    setReady,
    setDisabled,
    reset,
  };
};

/**
 * Hook for TGS-specific fan-only logic
 * Used in conjunction with InstantHeat for TGS system
 */
export const useTgsFanOnlyLogic = ({
  isInstantHeatActive,
  onActivate,
  onDeactivate,
}) => {
  const [isFanOnlyActive, setIsFanOnlyActive] = useState(false);

  // TGS rule: Fan must run when heater is running
  useEffect(() => {
    if (isInstantHeatActive && !isFanOnlyActive) {
      setIsFanOnlyActive(true);
      onActivate?.();
    }
  }, [isInstantHeatActive, isFanOnlyActive, onActivate]);

  const handleToggle = useCallback(() => {
    if (isInstantHeatActive) {
      // Cannot turn off fan while heater is running in TGS
      return { success: false, reason: 'heater_running' };
    }

    if (isFanOnlyActive) {
      onDeactivate?.();
      setIsFanOnlyActive(false);
      return { success: true, activated: false };
    } else {
      onActivate?.();
      setIsFanOnlyActive(true);
      return { success: true, activated: true };
    }
  }, [isInstantHeatActive, isFanOnlyActive, onActivate, onDeactivate]);

  return {
    isFanOnlyActive,
    setIsFanOnlyActive,
    handleToggle,
    canDeactivate: !isInstantHeatActive,
  };
};
