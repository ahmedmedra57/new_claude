import {
  handleLocationSelectBySwitch,
  handleMachineSelectBySwitch,
  handleSelectAllBySwitch,
  handleSpecificLocationSelectBySwitch,
} from '../../../components/store/slices/masterControlBySwitchSelectSlice';
import {
  handleLocationSelectByLocation,
  handleMachineSelectByLocation,
  handleSelectAllByLocation,
  handleSpecificLocationSelectByLocation,
} from '../../../components/store/slices/masterControlSelectByLocationSlice';

export const selectAllDispatchHandler = (
  dispatch,
  scope,
  name,
  locationList,
  specificLocationList,
  machineList
) => {
  if (scope === 'switch') {
    // dispatch all
    dispatch(handleSelectAllBySwitch({ controller: name, status: true }));
    // dispatch locations
    dispatch(handleLocationSelectBySwitch(locationList));
    // dispatch specific locations
    dispatch(handleSpecificLocationSelectBySwitch(specificLocationList));
    // dispatch machines
    dispatch(handleMachineSelectBySwitch(machineList));
  } else {
    // dispatch all
    dispatch(handleSelectAllByLocation({ controller: name, status: true }));
    // dispatch locations
    dispatch(handleLocationSelectByLocation(locationList));
    // dispatch specific locations
    dispatch(handleSpecificLocationSelectByLocation(specificLocationList));
    // dispatch machines
    dispatch(handleMachineSelectByLocation(machineList));
  }
};
