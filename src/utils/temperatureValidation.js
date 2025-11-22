/**
 * Temperature Validation Utility
 *
 * Centralized temperature validation logic for all heating programs.
 * Eliminates duplicate validation code across 11+ components.
 */

export const TEMP_RANGES = {
  HEATING_SCHEDULE: {
    FAHRENHEIT: { min: 250, max: 1830 },
    CELSIUS: { min: 121, max: 999 }
  },
  OPTIONAL_CONSTANT: {
    FAHRENHEIT: { min: 77, max: 248 },
    CELSIUS: { min: 25, max: 120 }
  },
  INSTANT_HEAT: {
    FAHRENHEIT: { min: 250, max: 1830 },
    CELSIUS: { min: 121, max: 999 }
  }
};

/**
 * Validates temperature against program-specific ranges
 * @param {number} temp - Temperature value to validate
 * @param {boolean} isF - True for Fahrenheit, false for Celsius
 * @param {string} programType - Program type (HEATING_SCHEDULE, OPTIONAL_CONSTANT, INSTANT_HEAT)
 * @returns {boolean} - True if temperature is valid
 */
export const validateTemperature = (temp, isF, programType = 'HEATING_SCHEDULE') => {
  const ranges = TEMP_RANGES[programType];
  if (!ranges) {
    console.error(`Unknown program type: ${programType}`);
    return false;
  }

  const range = isF ? ranges.FAHRENHEIT : ranges.CELSIUS;
  return temp >= range.min && temp <= range.max;
};

/**
 * Gets temperature range for a specific program
 * @param {boolean} isF - True for Fahrenheit, false for Celsius
 * @param {string} programType - Program type
 * @returns {object} - Object with min and max temperature
 */
export const getTemperatureRange = (isF, programType = 'HEATING_SCHEDULE') => {
  const ranges = TEMP_RANGES[programType];
  return isF ? ranges.FAHRENHEIT : ranges.CELSIUS;
};

/**
 * Gets i18n keys for temperature validation error messages
 * @param {string} programType - Program type
 * @returns {array} - Array of i18n keys for error messages
 */
export const getTemperatureErrorKeys = (programType) => {
  const keyBase = programType === 'HEATING_SCHEDULE'
    ? 'masterControl.heatingSchedule'
    : programType === 'OPTIONAL_CONSTANT'
    ? 'masterControl.optionalConstant'
    : 'masterControl.instantHeat';

  return [
    `${keyBase}.wrongTemperature`,
    `${keyBase}.finalizePrompt`,
    `${keyBase}.inputTempFirst`,
    `${keyBase}.minTemp`,
    `${keyBase}.maxTemp`,
  ];
};

/**
 * Validates temperature input and returns result object
 * @param {string} tempInput - Temperature input string
 * @param {boolean} isF - True for Fahrenheit, false for Celsius
 * @param {string} programType - Program type
 * @returns {object} - { isValid: boolean, temp: number, errorKeys: array }
 */
export const validateTemperatureInput = (tempInput, isF, programType = 'HEATING_SCHEDULE') => {
  if (!tempInput || tempInput.trim() === '') {
    return {
      isValid: false,
      temp: null,
      errorKeys: getTemperatureErrorKeys(programType)
    };
  }

  const temp = Number(tempInput);

  if (isNaN(temp)) {
    return {
      isValid: false,
      temp: null,
      errorKeys: getTemperatureErrorKeys(programType)
    };
  }

  const isValid = validateTemperature(temp, isF, programType);

  return {
    isValid,
    temp,
    errorKeys: isValid ? null : getTemperatureErrorKeys(programType)
  };
};
