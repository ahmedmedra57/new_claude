export const selectLocationHandler = (
  data,
  option,
  locations,
  isLocationSelected,
  isMachineSelected,
  selectedLocations
) => {
  // ======= select location logic =====
  // 2. select location
  // 2.1 update the isLocationSelected
  const index = locations.indexOf(option);
  const copyIsLocationSelected = [...isLocationSelected];
  copyIsLocationSelected[index] = true;
  // isSpecificLocation logic

  //   const exitingSpecLocationsValue = Object.values(data).filter(
  //   (el) => el.isSpecificLocation);
  // // console.log(exitingSpecLocationsValue[0],"exitingSpecLocationsValue")
  // // 2.2 update isSpecificLocationSelected
  // const newIsSpecificLocationSelected = [];
  // exitingSpecLocationsValue.forEach((specLocationTitle) => {
  //   console.log(specLocationTitle.subLocations, 'specLocationTitle');
  //   const tempArr = [];

  //   newIsSpecificLocationSelected.push(tempArr);

  //   Object.keys(data[option].subLocations).forEach((el,index) => {
  //     if (el === Object.keys(specLocationTitle.subLocations)[index]) {
  //       tempArr.push(true);
  //     } else {
  //       tempArr.push(false);
  //     }
  //   });
  // });

  const exitingSpecLocationsValue = Object.values(data).filter(
    (el) => el.isSpecificLocation
  );

  // 2.2 update isSpecificLocationSelected
  const newIsSpecificLocationSelected = [];
  exitingSpecLocationsValue.forEach((specLocationTitle) => {
    const tempArr = [];

    newIsSpecificLocationSelected.push(tempArr);
    if(data[option].subLocations){
      Object.keys(data[option].subLocations).forEach((el,index) => {
        if (el === Object.keys(specLocationTitle.subLocations)[index]) {
          tempArr.push(true);
        } else {
          tempArr.push(false);
        }
      });
    }
  });

  // 2.3 update isMachineSelected
  const machineNewArr = isMachineSelected[index]?.map((el) => {
    if (typeof el === "boolean") {
      return true;
    } else {
      const machineArr = el?.map((machine) => true);
      return machineArr;
    }
  });
  const copyIsMachineSelected = [...isMachineSelected];
  copyIsMachineSelected[index] = machineNewArr;

  // for dispatch selected locations
  const newSelect = [...selectedLocations];
  if (!newSelect.some((el) => el === option)) {
    newSelect.push(option);
  }

  return {
    locationList: copyIsLocationSelected,
    specificLocationList: newIsSpecificLocationSelected,
    machineList: copyIsMachineSelected,
    newSelectedLocations: newSelect,
  };
};
