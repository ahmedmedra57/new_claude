export const selectSettingsSpecificLocationHandler = (
  data,
  option,
  machineIndex,
  extraOption,
  locations,
  isSpecificLocationSelected,
  isMachineSelected,
  specificLocations,
  selectedSpecificLocations
) => {
  // 3. select specific location
  // 3.1 update isSpecificLocationSelected
  
  let index;
  specificLocations.map((el, i) => {
    if (el.includes(extraOption)) {
      return (index = i);
    }
  });
  const isSpecificLocationNewArr = isSpecificLocationSelected[index]?.map(
    (_, idx) => {
      if (idx === machineIndex) {
        return true;
      }
      return _;

    }
  );
  const arr = [...isSpecificLocationSelected];
  
  arr[index] = isSpecificLocationNewArr;

  // 3.2 update isMachineSelected
  // location index
  const locationIndex = locations.indexOf(option);
  const machineNewArr = isMachineSelected[locationIndex][machineIndex]?.map(
    (machine) => true
  );

  const deepCopyArr = JSON.parse(JSON.stringify(isMachineSelected));

  deepCopyArr[locationIndex][machineIndex] = machineNewArr;

  // for dispatch selected specific locations
  const newSelect = [...selectedSpecificLocations];
  if (!newSelect.some((el) => el === extraOption)) {
    newSelect.push(extraOption);
  }

  return {
    specificLocationList: arr,
    machineList: deepCopyArr,
    newSpecificLocations: newSelect,
  };
};
