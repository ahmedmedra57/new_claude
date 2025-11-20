import { useEffect } from 'react';
import { useMCIsExpandedStore } from '../../components/zustand-stores';
import { getSpecLocationHandler } from '../../helpers/helpers';

export const useSetZoneOpeningsState = (
  switchData,
  masterControl,
  machineControlHandler,
  swtSystem,
  isOpenMasterControl
) => {
  const { setOpenLocationInitialState, setOpenMasterControl } = useMCIsExpandedStore();

  useEffect(() => {
    if (masterControl) {
      // update MCIsExpandedSlice=>isLocationOpen
      const locations = Object.keys(switchData).map((_) => false);
      setOpenLocationInitialState(swtSystem, locations);

      // update MCIsExpandedSlice=>isSpecificLocationOpen
      // TODO: HANDLE CLOSE SUB-LOCATION LATER IF THERE IS A PROBLEM THERE
      // const specLocationsArr = getSpecLocationHandler(switchData);
      // const specificLocations = specLocationsArr.map((_) => false);
      // dispatch(
      //   setOpenSpecificLocationInitialStateHandler({
      //     swtSystem,
      //     specificLocations,
      //   })
      // );

      if (machineControlHandler) {
        // const specLocationNames = specLocationsArr.flatMap((specLocation) =>
        //   Object.keys(specLocation)
        // );
        // Object.keys(switchData).forEach((location) =>
        //   Object.keys(switchData[location]).forEach((el) => {
        //     const filteredSpecLocation = specLocationNames.filter(
        //       (specLocation) => el === specLocation
        //     );
        //     if (filteredSpecLocation.length > 0) {
        //       const specificLocation = filteredSpecLocation[0];
        //       Object.keys(switchData[location][specificLocation]).forEach(
        //         (machine) =>
        //           dispatch(
        //             machineControlHandler({
        //               location,
        //               specificLocation,
        //               machine,
        //               status: false,
        //             })
        //           )
        //       );
        //     } else {
        //       dispatch(
        //         machineControlHandler({ location, machine: el, status: false })
        //       );
        //     }
        //   })
        // );
      }
    } else if (isOpenMasterControl) {
      setOpenMasterControl(swtSystem, false);
    }
  }, [masterControl]);
};
