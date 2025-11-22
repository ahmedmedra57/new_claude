/**
 * TGS Switch Slice (Factory-Generated)
 *
 * This file replaces the original 1,000-line tgsSwitchSlice.js
 * with a factory-generated version to eliminate duplication.
 *
 * Original: 1,000 lines
 * New: ~20 lines
 * Savings: ~980 lines
 */

import { createSystemSlice, createSystemSelector } from './factories/createSystemSlice';

// Generate TGS slice using factory
const tgsSwitchSlice = createSystemSlice('tgs');

// Export actions (maintains backward compatibility)
export const {
  handleSelectIndividualMachine: tgsHandleSelectIndividualMachine,
  tgsSpecificLocationSelectMachinesHandler,
  handleUnSelectIndividualMachine: tgsHandleUnSelectIndividualMachine,
  tgsSpecificLocationUnselectMachinesHandler,
  handleInstantHeatReady: tgsHandleInstantHeatIsReady,
  handleInstantHeatOff: tgsHandleInstantHeatOff,
  handleInstantHeatReset: tgsHandleInstantHeatReset,
  handleSnowSensor: tgsHandleSnowSensor,
  handleSnowSensorOff: tgsHandleSnowSensorOff,
  handleSnowSensorReset: tgsHandleSnowSensorReset,
  handleOptionalConstantTempReady: tgsHandleOptionalConstantTempReady,
  handleMachineOptionalConstantTempOff: tgsHandleMachineOptionalConstantTempOff,
  handleOptionalConstantTempReset: tgsHandleOptionalConstantTempReset,
  handleWindFactor: tgsHandleWindFactor,
  handleWindFactorOff: tgsHandleWindFactorOff,
  handleWindFactorReset: tgsHandleWindFactorReset,
  handleAddHeatingSchedule: tgsHandleAddHeatingSchedule,
  handleReadyHeatingSchedule: tgsHandleReadyHeatingSchedule,
  handleClearHeatingSchedule: tgsHandleClearHeatingSchedule,
  handleHeatingScheduleReset: tgsHandleHeatingScheduleReset,
  handleShutOff: tgsHandleShutOff,
  handleOpenMachineController: tgsHandleOpenMachineController,
  handleSelector: tgsHandleSelector,
  handleOpenSetting: tgsHandleOpenSetting,
  handleOpenPasswordBox: tgsHandleOpenPasswordBox,
  handleExpandSSRDetail: tgsHandleExpandSSRDetail,
  handleToggleSSR: tgsHandleToggleSSR,
  handleChangeSSRDetail: tgsHandleChangeSSRDetail,
  handleTgsSwitch,
  handleTgsSwitchSocket,
  handleTgsSSRState,
  handleTgsSSRStateSocket,
  handleTgsGraph,
  handleTgsGraphDate,
} = tgsSwitchSlice.actions;

// Export selector (maintains backward compatibility)
export const selectTgsSwitch = createSystemSelector('tgs');

// Export reducer
export default tgsSwitchSlice.reducer;
