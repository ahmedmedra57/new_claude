import {
  handleSettingsAddSpecificLocations,
  handleSettingsMachineSelect,
  handleSettingsSpecificLocationSelect,
} from '../../../components/store/slices/settings/force&CommandAndAdminSelectSlice';

export const selectSpecificLocationIndicatorDispatcherHandler = (
  dispatch,
  name,
  specificLocationList,
  machineList,
  newSpecificLocations
) => {
  dispatch(
    // dispatch specific locations
    handleSettingsSpecificLocationSelect({
      switch: name,
      arr: specificLocationList,
    })
  );
  // dispatch machines
  dispatch(
    handleSettingsMachineSelect({
      switch: name,
      arr: machineList,
    })
  );
  // dispatch selected specific locations
  dispatch(
    handleSettingsAddSpecificLocations({
      switch: name,
      arr: newSpecificLocations,
    })
  );
};
