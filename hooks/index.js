export * from './useSocket';
export * from './useGetScheduleQueries';
export * from './useGetAllSSRsQueries';
export * from './useGetSSRsQueries';
export * from './useDebounce';
export * from './useSetAndCurrentTemp';
export * from './useGetThermocouplesQueries';
export * from './useGetGraphQueries';
export * from './ess_tgs_tes_hooks/useSetZoneOpeningsState';
export * from './useSelectSwitchesDispatches';
export * from './useSelectSwitchesDisplay';
export * from './useGetSpecificLocationList';
export * from './useCheckControlPermsission';

// New shared hooks for ESS/TGS/TES components
export { default as useNavigationState } from './useNavigationState';
export { default as useProgramIcons } from './useProgramIcons';
export { default as useSwitchData } from './useSwitchData';
export { default as useSwitchControls } from './useSwitchControls';
export { default as useHeaderHat } from './useHeaderHat';