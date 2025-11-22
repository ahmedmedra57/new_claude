/**
 * Control Component Helper Functions
 *
 * Shared utility functions for control components to reduce duplication
 * across InstantHeat, SnowSensor, WindFactor, and HeatingSchedule.
 */

import { TEMP_RANGES } from './temperatureValidation';

/**
 * Extracts numeric temperature from input string
 * Handles various input formats: "123", "123°F", "123 °C", etc.
 *
 * @param {string} tempInput - Temperature input string
 * @returns {number|null} - Numeric temperature or null if invalid
 */
export const extractTemperature = (tempInput) => {
  if (!tempInput) return null;

  const match = tempInput.match(/\d+/);
  if (!match) return null;

  return Number(match[0]);
};

/**
 * Formats temperature with unit for display
 *
 * @param {number} temp - Temperature value
 * @param {boolean} isF - True for Fahrenheit, false for Celsius
 * @returns {string} - Formatted temperature string
 */
export const formatTemperature = (temp, isF) => {
  if (temp === null || temp === undefined || temp === 0) {
    return '';
  }
  return `${temp} ${isF ? '°F' : '°C'}`;
};

/**
 * Gets temperature error message keys for display
 *
 * @param {string} programType - Program type (INSTANT_HEAT, etc.)
 * @param {boolean} isF - True for Fahrenheit, false for Celsius
 * @returns {array} - Array of error message strings
 */
export const getTemperatureErrorMessages = (programType, isF) => {
  const range = TEMP_RANGES[programType]?.[isF ? 'FAHRENHEIT' : 'CELSIUS'];

  if (!range) {
    return [
      'wrong temperature',
      'please input valid temperature',
    ];
  }

  const unit = isF ? '°F' : '°C';
  const programName = programType.toLowerCase().replace(/_/g, ' ');

  return [
    'wrong temperature',
    `in order to finalize ${programName} program,`,
    'please input your temperature first',
    `( the minimum temperature is ${range.min}${unit} )`,
    `( the maximum temperature is ${range.max}${unit} )`,
  ];
};

/**
 * Determines if EBP mode should disable the control
 *
 * @param {boolean} isEbp - Is EBP enabled
 * @param {number} EBP_mode - EBP mode (0 = disabled, 1+ = enabled)
 * @returns {boolean} - True if control should be disabled
 */
export const isEbpDisabled = (isEbp, EBP_mode) => {
  return isEbp && EBP_mode === 0;
};

/**
 * Gets control state styling classes
 *
 * @param {object} state - Control state object
 * @returns {object} - Styling flags
 */
export const getControlStateStyles = (state) => {
  const {
    isActivated = false,
    isReady = false,
    isDisabled = false,
  } = state;

  return {
    isActivated,
    isReady,
    isDisabled,
  };
};

/**
 * Validates if a control can be activated
 * Checks for conflicts with other controls and system state
 *
 * @param {object} params - Validation parameters
 * @returns {object} - Validation result
 */
export const canActivateControl = ({
  controlType,
  isAnotherSystemRunning = false,
  currentlyActiveControls = [],
  isDialSysDisabled = false,
  isTgs = false,
  isInstantHeatActive = false,
}) => {
  // Check if system is disabled
  if (isDialSysDisabled) {
    return {
      canActivate: false,
      reason: 'system_disabled',
      message: [
        'm.c. shut off',
        "can't be used another action with deactivate",
      ],
    };
  }

  // Check if another system is running
  if (isAnotherSystemRunning) {
    return {
      canActivate: false,
      reason: 'another_system_running',
      message: [
        'system conflict',
        'another system is currently running',
      ],
    };
  }

  // TGS-specific: Fan Only cannot be disabled while InstantHeat is active
  if (isTgs && controlType === 'fanOnly' && isInstantHeatActive) {
    return {
      canActivate: false,
      reason: 'heater_running',
      message: [
        'fan only',
        'the fan should always run while the heater is running in tgs',
      ],
    };
  }

  return {
    canActivate: true,
  };
};

/**
 * Formats date and time for heating schedule
 *
 * @param {Date} date - Date object
 * @returns {object} - Formatted date and time
 */
export const formatScheduleDateTime = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date)) {
    return { date: null, time: null };
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return {
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}`,
  };
};

/**
 * Parses schedule date and time into Date object
 *
 * @param {string} dateStr - Date string (YYYY-MM-DD)
 * @param {string} timeStr - Time string (HH:MM)
 * @returns {Date|null} - Date object or null if invalid
 */
export const parseScheduleDateTime = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return null;

  const dateTime = new Date(`${dateStr} ${timeStr}`);
  if (isNaN(dateTime)) return null;

  return dateTime;
};

/**
 * Validates schedule date range
 *
 * @param {object} start - Start date/time
 * @param {object} end - End date/time
 * @returns {object} - Validation result
 */
export const validateScheduleDateRange = (start, end) => {
  if (!start.date || !start.time || !end.date || !end.time) {
    return {
      valid: false,
      reason: 'missing_fields',
      message: ['incomplete schedule', 'please fill in all date and time fields'],
    };
  }

  const startDateTime = parseScheduleDateTime(start.date, start.time);
  const endDateTime = parseScheduleDateTime(end.date, end.time);

  if (!startDateTime || !endDateTime) {
    return {
      valid: false,
      reason: 'invalid_format',
      message: ['invalid date format', 'please check your date and time inputs'],
    };
  }

  if (endDateTime <= startDateTime) {
    return {
      valid: false,
      reason: 'invalid_range',
      message: ['invalid date range', 'end time must be after start time'],
    };
  }

  const now = new Date();
  if (endDateTime < now) {
    return {
      valid: false,
      reason: 'past_date',
      message: ['schedule in past', 'end time cannot be in the past'],
    };
  }

  return {
    valid: true,
  };
};

/**
 * Gets system-specific configuration
 *
 * @param {string} systemType - System type (ess, tes, tgs)
 * @returns {object} - System configuration
 */
export const getSystemConfig = (systemType) => {
  const configs = {
    ess: {
      hasAts: true,
      hasFanOnly: false,
      supportsEbp: true,
      displayName: 'ESS',
    },
    tes: {
      hasAts: false,
      hasFanOnly: false,
      supportsEbp: true,
      displayName: 'TES',
    },
    tgs: {
      hasAts: false,
      hasFanOnly: true,
      supportsEbp: true,
      displayName: 'TGS',
    },
    hp: {
      hasAts: false,
      hasFanOnly: false,
      supportsEbp: false,
      displayName: 'HP',
    },
  };

  return configs[systemType] || configs.ess;
};

/**
 * Creates error message object for message boxes
 *
 * @param {string} title - Message title
 * @param {string} subtitle - Message subtitle
 * @param {array} messages - Array of message lines
 * @returns {object} - Message object
 */
export const createMessageBoxData = (title, subtitle, messages) => {
  return {
    title,
    subtitle,
    messages: Array.isArray(messages) ? messages : [messages],
  };
};

/**
 * Determines which logo to display based on state
 *
 * @param {string} controlType - Control type
 * @param {object} state - Control state
 * @returns {string} - Logo path
 */
export const getControlLogo = (controlType, state) => {
  const { isDisabled, isActivated, isReady, isEbp, EBP_mode } = state;

  const ebpDisabled = isEbpDisabled(isEbp, EBP_mode);
  const disabled = isDisabled || ebpDisabled;

  const logoMap = {
    instantHeat: {
      normal: '/images/logo-instantHeat.svg',
      disabled: '/images/logo-instantHeat-disabled.svg',
    },
    snowSensor: {
      normal: '/images/logo-snowSensor.svg',
      disabled: '/images/logo-snowSensor-disabled.svg',
    },
    windFactor: {
      normal: '/images/logo-windFactor.svg',
      disabled: '/images/logo-windFactor-disabled.svg',
    },
    heatingSchedule: {
      normal: '/images/logo-heatingSchedule.svg',
      disabled: '/images/logo-heatingSchedule-disabled.svg',
    },
    optionalConstantTemp: {
      normal: '/images/logo-optionalConstant.svg',
      disabled: '/images/logo-optionalConstant-disabled.svg',
    },
    fanOnly: {
      normal: '/images/tgs-fanOnly.svg',
      disabled: '/images/tgs-fanOnly-disabled.svg',
    },
  };

  const logos = logoMap[controlType] || logoMap.instantHeat;
  return disabled ? logos.disabled : logos.normal;
};

/**
 * Gets control title text
 *
 * @param {string} controlType - Control type
 * @returns {string} - Title text
 */
export const getControlTitle = (controlType) => {
  const titles = {
    instantHeat: 'instant heat program',
    snowSensor: 'snow sensor',
    windFactor: 'wind factor',
    heatingSchedule: 'heating schedule',
    optionalConstantTemp: 'optional constant temperature',
    fanOnly: 'fan only',
  };

  return titles[controlType] || controlType;
};
