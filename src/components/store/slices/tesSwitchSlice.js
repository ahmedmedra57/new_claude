/**
 * TES Switch Slice (Factory-Generated)
 *
 * This file replaces the original 1,316-line tesSwitchSlice.js
 * with a factory-generated version to eliminate duplication.
 *
 * Original: 1,316 lines
 * New: ~20 lines
 * Savings: ~1,296 lines
 */

import { createSystemSlice, createSystemSelector } from './factories/createSystemSlice';

// Generate TES slice using factory
const tesSwitchSlice = createSystemSlice('tes');

// Export actions (maintains backward compatibility)
export const {
  handleSelectIndividualMachine: tesHandleSelectIndividualMachine,
  tesSpecificLocationSelectMachinesHandler,
  handleUnSelectIndividualMachine: tesHandleUnSelectIndividualMachine,
  tesSpecificLocationUnselectMachinesHandler,
  handleInstantHeatReady: tesHandleInstantHeatIsReady,
  handleInstantHeatOff: tesHandleInstantHeatOff,
  handleInstantHeatReset: tesHandleInstantHeatReset,
  handleSnowSensor: tesHandleSnowSensor,
  handleSnowSensorOff: tesHandleSnowSensorOff,
  handleSnowSensorReset: tesHandleSnowSensorReset,
  handleOptionalConstantTempReady: tesHandleOptionalConstantTempReady,
  handleMachineOptionalConstantTempOff: tesHandleMachineOptionalConstantTempOff,
  handleOptionalConstantTempReset: tesHandleOptionalConstantTempReset,
  handleWindFactor: tesHandleWindFactor,
  handleWindFactorOff: tesHandleWindFactorOff,
  handleWindFactorReset: tesHandleWindFactorReset,
  handleAddHeatingSchedule: tesHandleAddHeatingSchedule,
  handleReadyHeatingSchedule: tesHandleReadyHeatingSchedule,
  handleClearHeatingSchedule: tesHandleClearHeatingSchedule,
  handleHeatingScheduleReset: tesHandleHeatingScheduleReset,
  handleShutOff: tesHandleShutOff,
  handleOpenMachineController: tesHandleOpenMachineController,
  handleSelector: tesHandleSelector,
  handleOpenSetting: tesHandleOpenSetting,
  handleOpenPasswordBox: tesHandleOpenPasswordBox,
  handleExpandSSRDetail: tesHandleExpandSSRDetail,
  handleToggleSSR: tesHandleToggleSSR,
  handleChangeSSRDetail: tesHandleChangeSSRDetail,
  handleTesSwitch,
  handleTesSwitchSocket,
  handleTesSSRState,
  handleTesSSRStateSocket,
  handleTesGraph,
  handleTesGraphDate,
} = tesSwitchSlice.actions;

// Export selector (maintains backward compatibility)
export const selectTesSwitch = createSystemSelector('tes');

// Export reducer
export default tesSwitchSlice.reducer;
