/**
 * Temperature Program Configuration
 *
 * Centralized configuration for all temperature-based programs.
 * Used by TemperatureProgram component to eliminate duplication.
 */

export const TEMPERATURE_PROGRAMS = {
  instantHeat: {
    name: 'instantHeat',
    displayName: 'instant heat program',
    iconSrc: '/images/logo-instantHeat.svg',
    validationType: 'INSTANT_HEAT',
    tempRanges: {
      celsius: { min: 121, max: 999 },
      fahrenheit: { min: 250, max: 1830 },
    },
    hasTgsMode: true, // Special TGS fan-only integration
    hasScheduler: false,
  },

  optionalConstant: {
    name: 'constantTemp',
    displayName: 'opt. const. temp. program',
    iconSrc: '/images/logo-constantTemp.svg',
    validationType: 'OPTIONAL_CONSTANT',
    tempRanges: {
      celsius: { min: 25, max: 120 },
      fahrenheit: { min: 77, max: 248 },
    },
    hasTgsMode: false,
    hasScheduler: false,
  },

  heatingSchedule: {
    name: 'heatingSchedule',
    displayName: 'heating schedule program',
    iconSrc: '/images/logo-heatingSchedule.svg',
    validationType: 'HEATING_SCHEDULE',
    tempRanges: {
      celsius: { min: 121, max: 999 },
      fahrenheit: { min: 250, max: 1830 },
    },
    hasTgsMode: false,
    hasScheduler: true, // Has date/time picker
  },
};

/**
 * Get program configuration by name
 * @param {string} programName - Program name ('instantHeat', 'optionalConstant', 'heatingSchedule')
 * @returns {object} Program configuration
 */
export const getProgramConfig = (programName) => {
  const config = TEMPERATURE_PROGRAMS[programName];
  if (!config) {
    console.error(`Unknown program: ${programName}`);
    return TEMPERATURE_PROGRAMS.instantHeat; // Fallback
  }
  return config;
};

/**
 * Get temperature range for display
 * @param {string} programName - Program name
 * @param {boolean} isF - Is Fahrenheit
 * @returns {object} { min, max, unit }
 */
export const getTempRangeForDisplay = (programName, isF) => {
  const config = getProgramConfig(programName);
  const range = isF ? config.tempRanges.fahrenheit : config.tempRanges.celsius;
  const unit = isF ? '°F' : '°C';

  return {
    ...range,
    unit,
    displayText: `${range.min}${unit} - ${range.max}${unit}`,
  };
};
