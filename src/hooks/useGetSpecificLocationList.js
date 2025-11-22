import { useState } from 'react';
import { useEffect } from 'react';

export const useGetSpecificLocationList = (data) => {
  const [specificLocationsNameList, setSpecificLocationsNameList] = useState(
    []
  );
  useEffect(() => {
    let specificLocationArr = [];
    Object.values(data).forEach((value) => {
      if (value.isSpecificLocation) {
        specificLocationArr.push(Object.keys(value.subLocations));
      }
    });
    setSpecificLocationsNameList(specificLocationArr);
  }, [data]);
  return specificLocationsNameList;
};
