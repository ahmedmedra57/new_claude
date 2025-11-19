import {
  handleAddSpecificLocationsBySwitch,
  handleMachineSelectBySwitch,
  handleSpecificLocationSelectBySwitch,
} from '../../../components/store/slices/masterControlBySwitchSelectSlice';
import {
  handleAddSpecificLocationsByLocation,
  handleMachineSelectByLocation,
  handleSpecificLocationSelectByLocation,
} from '../../../components/store/slices/masterControlSelectByLocationSlice';

export const selectSpecificLocationDispatchHandler = (
  dispatch,
  scope,
  name,
  specificLocationList,
  machineList,
  newSpecificLocations
) => {
  console.log(
    scope,
    name,
    specificLocationList,
    machineList,
    newSpecificLocations, 'selectSpecificLocationDispatchHandler');
  // ======dispatches below======
  if (scope === 'switch') {
    // dispatch specific locations
    dispatch(
      handleSpecificLocationSelectBySwitch({
        controller: name,
        arr: specificLocationList,
      })
    );
    // dispatch machines
    dispatch(
      handleMachineSelectBySwitch({ controller: name, arr: machineList })
    );
    // dispatch selected specific locations
    dispatch(
      handleAddSpecificLocationsBySwitch({
        controller: name,
        arr: newSpecificLocations,
      })
    );
  } else {
    // dispatch specific
    dispatch(
      handleSpecificLocationSelectByLocation({
        controller: name,
        arr: specificLocationList,
      })
    );
    // dispatch machines
    dispatch(
      handleMachineSelectByLocation({
        controller: name,
        arr: machineList,
      })
    );
    // dispatch selected specific locations
    dispatch(
      handleAddSpecificLocationsByLocation({
        controller: name,
        arr: newSpecificLocations,
      })
    );
  }
};
