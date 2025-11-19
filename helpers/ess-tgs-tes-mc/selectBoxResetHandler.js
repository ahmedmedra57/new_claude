import { getAllSpecificLocationNames } from "../helpers";

const selectBoxResetHandler = (data, program) => {
  // isLocationSelected
  const locations = Object.keys(data);
  const locationArr = locations.map((location) => false);

  // isMachineSelected
  const specificLocationArr = [];
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

  
  return {
    locationList: locationArr,
    specificLocationList: filteredSpecificLocationArr,
    machineList: machineArr,
  };
};

export default selectBoxResetHandler;
