export const selectAllHandler = (
  data,
  name,
  isLocationSelected,
  isSpecificLocationSelected
) => {
  // =======logic============
  // 2. update all locations
  const locationArr = isLocationSelected.map((location) => true);
  const locationDispatchObj = {
    controller: name,
    arr: locationArr,
  };
  // 3.update all isSpecificLocationSelected
  const specificLocationArr = isSpecificLocationSelected.map((el) =>
    el.map((specLocationState) => true)
  );
  const specLocationDispatchObj = {
    controller: name,
    arr: specificLocationArr,
  };
  // 4. update all machines

  const individualArr = Object.values(data)?.map((location, i) => {
    if (location.isSpecificLocation) {
      return Object.values(location.subLocations).map((subLocation) => {
        Object.values(subLocation.devices).map((machine) => {
          return true;
        });
      });
    } else {
      return Object.values(location.devices).map((machine) => {
        return true;
      });
    }
  });

  // const individualArr = Object.values(data)?.map((location,i) => {
  //   console.log(location,"TestInsideXX")
  //   const locationArr = Object.values(location);
  //   console.log(locationArr,i,location, "locationArr");
  //   if (!locationArr[0]) {
  //     return Object.keys(locationArr[1]).map((machine) => true)
  //   } else {
  //     return Object.keys(locationArr[1]).map((SubLocation) => {
  //       return Object.keys(locationArr[1][SubLocation]).map((machine) => true)
  //     })
  //   }
  // });

  const machineDispatchObj = {
    controller: name,
    arr: individualArr,
  };
  return {
    locationList: locationDispatchObj,
    specificLocationList: specLocationDispatchObj,
    machineList: machineDispatchObj,
  };
};
