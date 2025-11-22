/**
 * ESS Switch Slice (Factory-Generated)
 *
 * This file replaces the original 1,000-line essSwitchSlice.js
 * with a factory-generated version to eliminate duplication.
 *
 * Original: 1,000 lines
 * New: ~20 lines
 * Savings: ~980 lines
 */

import { createSystemSlice, createSystemSelector } from './factories/createSystemSlice';

// Generate ESS slice using factory
const essSwitchSlice = createSystemSlice('ess');

// Export actions (maintains backward compatibility)
export const {
  handleSelectIndividualMachine,
  essSpecificLocationSelectMachinesHandler,
  handleUnSelectIndividualMachine,
  essSpecificLocationUnselectMachinesHandler,
  handleInstantHeatReady,
  handleInstantHeatOff,
  handleInstantHeatReset,
  handleSnowSensor,
  handleSnowSensorOff,
  handleSnowSensorReset,
  handleOptionalConstantTempReady,
  handleMachineOptionalConstantTempOff,
  handleOptionalConstantTempReset,
  handleWindFactor,
  handleWindFactorOff,
  handleWindFactorReset,
  handleAddHeatingSchedule,
  handleReadyHeatingSchedule,
  handleClearHeatingSchedule,
  handleHeatingScheduleReset,
  handleShutOff,
  handleAtsSelection,
  handleOpenMachineController,
  handleSelector,
  handleOpenSetting,
  handleOpenPasswordBox,
  handleExpandSSRDetail,
  handleToggleSSR,
  handleChangeSSRDetail,
  handleEssSwitch,
  handleEssSwitchSocket,
  handleEssSSRState,
  handleEssSSRStateSocket,
  handleEssGraph,
  handleEssGraphDate,
} = essSwitchSlice.actions;

// Export selector (maintains backward compatibility)
export const selectEssSwitch = createSystemSelector('ess');

// Export reducer
export default essSwitchSlice.reducer;
