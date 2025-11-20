// Export all Zustand stores for easy importing
// Usage: import { useAppStore, useUserStore } from './zustand-stores';

// Basic stores
export { default as useAppStore } from './appStore';
export { default as useMessageBoxesStore } from './messageBoxesStore';
export { default as useGlobalOverviewStore } from './globalOverviewStore';
export { default as useReportStatusStore } from './reportStatusStore';
export { default as useAddressStore } from './addressStore';

// User & Telemetry
export { default as useUserStore } from './userStore';
export { default as useTelemetryStore } from './telemetryStore';
export { default as useTelemetryChartDataStore } from './telemetryChartDataStore';

// Master Control
export { default as useMCStore } from './mcStore';
export { default as useMCCommandStore } from './mcCommandStore';
export { default as useMasterControlSelectStore } from './masterControlSelectStore';
export { default as useMasterControlBySwitchSelectStore } from './masterControlBySwitchSelectStore';
export { default as useMasterControlSelectByLocationStore } from './masterControlSelectByLocationStore';
export { default as useMCIsExpandedStore } from './mcIsExpandedStore';

// Mobile
export { default as useMobileMasterControlStore } from './mobileMasterControlStore';
export { default as useMobileSelectProgramStore } from './mobileSelectProgramStore';

// Machines & Locations
export { default as useSelectedMachinesStore } from './selectedMachinesStore';
export { default as useLocationsStore } from './locationsStore';
export { default as useSSRDescriptionStore } from './ssrDescriptionStore';

// Faults
export { default as useFaultsStore } from './faultsStore';

// Data Consumption
export { default as useESSDataConsumptionStore } from './essDataConsumptionStore';
export { default as useTGSDataConsumptionStore } from './tgsDataConsumptionStore';
export { default as useTESDataConsumptionStore } from './tesDataConsumptionStore';
export { default as useHPDataConsumptionStore } from './hpDataConsumptionStore';

// Switch Stores (Complex)
export { default as useESSSwitchStore } from './essSwitchStore';
export { default as useTGSSwitchStore } from './tgsSwitchStore';
export { default as useTESSwitchStore } from './tesSwitchStore';
export { default as useHPElectricSwitchStore } from './hpElectricSwitchStore';
export { default as useHPGasSwitchStore } from './hpGasSwitchStore';

// Settings
export { default as useUnitsStore } from './settings/unitsStore';
export { default as useSnowSensorStore } from './settings/snowSensorStore';
export { default as useWindFactorStore } from './settings/windFactorStore';
export { default as useInterfaceModeStore } from './settings/interfaceModeStore';
export { default as useSettingsOptionsStore } from './settings/settingsOptionsStore';
export { default as useEditCancelApplyButtonsStore } from './settings/editCancelApplyButtonsStore';
export { default as useForceAndCommandsStore } from './settings/forceAndCommandsStore';
export { default as useForceCommandAndAdminSelectStore } from './settings/forceCommandAndAdminSelectStore';

// Admin Settings
export { default as useAdminStore } from './settings/admin/adminStore';
export { default as useSysIdentificationStore } from './settings/admin/sysIdentificationStore';
export { default as useAddElementToBankAndSystemIdentificationStore } from './settings/admin/addElementToBankAndSystemIdentificationStore';
