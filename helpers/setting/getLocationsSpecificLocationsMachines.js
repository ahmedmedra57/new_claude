export const getLocationsSpecificLocationsMachines = (data) => {
  const result = data.flatMap(([location, locationData]) => {
    if (locationData.isSpecificLocation) {
      return Object.keys(locationData?.subLocations).flatMap((subLocation) => {
        return Object.entries(
          locationData?.subLocations[subLocation]?.devices
        ).flatMap(([key, value]) => {
          return [[location,key,subLocation]];
        });
      });
    } else {
      return Object.entries(locationData.devices).flatMap(([key, value]) => {
        return [[location, key]];
      });
    }
  });
  return result;
};
