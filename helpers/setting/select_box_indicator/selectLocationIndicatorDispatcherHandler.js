import {
  handleSettingsAddLocations,
  handleSettingsLocationSelect,
  handleSettingsMachineSelect,
  handleSettingsSpecificLocationSelect,
} from '../../../components/store/slices/settings/force&CommandAndAdminSelectSlice';

export const selectLocationIndicatorDispatcherHandler = (
  dispatch,
  name,
  locationList,
  specificLocationList,
  machineList,
  newSelectedLocations
) => {
  // dispatch locations
  dispatch(
    handleSettingsLocationSelect({
      switch: name,
      arr: locationList,
    })
  );
  // dispatch specific locations
  if (specificLocationList.length > 0) {
    dispatch(
      handleSettingsSpecificLocationSelect({
        switch: name,
        arr: specificLocationList,
      })
    );
  }
  // dispatch machines
  dispatch(
    handleSettingsMachineSelect({
      switch: name,
      arr: machineList,
    })
  );
  // dispatch to selectedLocations
  dispatch(
    handleSettingsAddLocations({
      switch: name,
      arr: newSelectedLocations,
    })
  );
};
