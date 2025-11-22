import {
  handleAddLocationsBySwitch,
  handleLocationSelectBySwitch,
  handleMachineSelectBySwitch,
  handleSpecificLocationSelectBySwitch,
} from '../../../components/store/slices/masterControlBySwitchSelectSlice';
import {
  handleAddLocationsByLocation,
  handleLocationSelectByLocation,
  handleMachineSelectByLocation,
  handleSpecificLocationSelectByLocation,
} from '../../../components/store/slices/masterControlSelectByLocationSlice';

export const selectLocationDispatchHandler = (
  dispatch,
  scope,
  name,
  locationList,
  specificLocationList,
  machineList,
  newSelectedLocations
) => {
  if (scope === 'switch') {
    // dispatch locations
    dispatch(
      handleLocationSelectBySwitch({
        controller: name,
        arr: locationList,
      })
    );
    // dispatch specific locations
    if (specificLocationList.length > 0) {
      dispatch(
        handleSpecificLocationSelectBySwitch({
          controller: name,
          arr: specificLocationList,
        })
      );
    }
    // dispatch machines
    dispatch(
      handleMachineSelectBySwitch({
        controller: name,
        arr: machineList,
      })
    );

    // dispatch selected locations
    dispatch(
      handleAddLocationsBySwitch({
        controller: name,
        arr: newSelectedLocations,
      })
    );
  } else {
    // dispatch locations
    dispatch(
      handleLocationSelectByLocation({
        controller: name,
        arr: locationList,
      })
    );
    // dispatch specific locations
    if (specificLocationList.length > 0) {
      dispatch(
        handleSpecificLocationSelectByLocation({
          controller: name,
          arr: specificLocationList,
        })
      );
    }
    // dispatch machines
    dispatch(
      handleMachineSelectByLocation({
        controller: name,
        arr: machineList,
      })
    );
    // dispatch selected locations
    dispatch(
      handleAddLocationsByLocation({
        controller: name,
        arr: newSelectedLocations,
      })
    );
  }
};
