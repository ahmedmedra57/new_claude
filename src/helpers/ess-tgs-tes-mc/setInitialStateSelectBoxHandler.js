export const setInitialStateSelectBoxHandler = (
  // swt,
  data
  // dispatch,
  // allDispatch,
  // locationDispatch,
  // specificLocationDispatch,
  // machineDispatch
) => {
  // isAllSelected
  // dispatch(allDispatch({ switch: swt, status: false }));

  // isLocationSelected
  const locations = Object.keys(data);
  const locationArr = locations.map((location) => false);
  // dispatch(locationDispatch({ arr: locationArr, switch: swt }));

  //isSpecificLocationSelected
  const specificLocationArr = [];
  // isMachineSelected
  const machineArr = Object.values(data).map((location) => {
    if (location.isSpecificLocation) {
      const machinesList = Object.values(location.subLocations).map(
        (specLocation) => Object.keys(specLocation.devices).map((el) => false)
      );
      const specLocation = Object.keys(location.subLocations).map(
        (el) => false
      );
      specificLocationArr.push(specLocation);
      return machinesList;
    } else {
      return Object.values(location.devices).map((value) => {
        return false;
      });
    }
  });
  let filteredSpecificLocationArr = [];
  filteredSpecificLocationArr = specificLocationArr.filter(
    (subArray) => subArray.length > 0
  );
  //isSpecificLocationSelected
  // dispatch(
  //   specificLocationDispatch({
  //     arr: specificLocationArr,
  //     switch: swt,
  //   })
  // );

  // isMachineSelected
  // dispatch(machineDispatch({ arr: machineArr, switch: swt }));
  return { locationArr:locationArr, specificLocationArr:filteredSpecificLocationArr, machineArr:machineArr };
};
