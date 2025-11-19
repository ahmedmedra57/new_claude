export const useSelectBoxArrowsState = (data) => {
  const locations = Object.keys(data);

  const specificLocationsValues = Object.values(data)
    .filter((location) => location.isSpecificLocation)
    .filter((el) => Object.keys(el.subLocations).length > 0);
  const specificLocations = specificLocationsValues.map(
    (location) => Object.keys(location.subLocations)
  );
  const trackArrowState = locations.map((el) => false);
  const trackSpecLocationArrowState = specificLocations.map((specificLocation) => specificLocation.map((el) => false));

  const allStates = {
    trackArrowState,
    trackSpecLocationArrowState,
    specificLocations,
  };

  return allStates;
};
