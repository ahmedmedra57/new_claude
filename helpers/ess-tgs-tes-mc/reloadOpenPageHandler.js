import { setOpenSpecificLocationInitialStateHandler } from '../../components/store/slices/MCIsExpandedSlice';
import { getSpecLocationHandler } from '../helpers';

const reloadOpenPageHandler = (
  dispatch,
  handleOpenMasterControl,
  handleOpenMachineController,
  swtInitialStateHandler,
  swtName,
  swtData,
  locationId,
  machineId,
  specificLocationId
) => {
  dispatch(handleOpenMasterControl({ swtName, status: false }));

  const locationArr = Object.keys(swtData).map(
    (location) => location === locationId
  );
  dispatch(
    swtInitialStateHandler({ swtSystem: swtName, locations: locationArr })
  );

  if (specificLocationId) {
    const specLocationArr = getSpecLocationHandler(swtData).map(
      (specLocation) => Object.keys(specLocation)[0] === specificLocationId
    );
    dispatch(
      setOpenSpecificLocationInitialStateHandler({
        swtSystem: swtName,
        specificLocations: specLocationArr,
      })
    );
  }

  Object.keys(swtData).forEach((location) =>
    Object.entries(swtData[location]).forEach(([key, value]) => {
      if (value.deviceMac) {
        dispatch(
          handleOpenMachineController({ location, machine: key, status: false })
        );
      } else {
        Object.keys(value).forEach((machine) => {
          dispatch(
            handleOpenMachineController({
              location,
              specificLocation: key,
              machine,
              status: false,
            })
          );
        });
      }
    })
  );

  if (machineId) {
    dispatch(
      handleOpenMachineController({
        location: locationId,
        specificLocation: specificLocationId,
        machine: machineId,
        status: true,
      })
    );
  }

  // dispatch(handleOpenMasterControl({ swtName, status: false }));
  // const locationArr = Object.keys(swtData).map(
  //   (location) => location === locationId
  // );
  // dispatch(swtInitialStateHandler(locationArr));
  // Object.keys(swtData).forEach((location) =>
  //   Object.entries(swtData[location]).forEach(([key, value]) => {
  //     if (value.deviceMac) {
  //       dispatch(
  //         handleOpenMachineController({ location, machine: key, status: false })
  //       );
  //     } else {
  //       Object.keys(value).forEach((machine) => {
  //         dispatch(
  //           handleOpenMachineController({
  //             location,
  //             specificLocation: key,
  //             machine,
  //             status: false,
  //           })
  //         );
  //       });
  //     }
  //   })
  // );

  // if (machineId) {
  //   dispatch(
  //     handleOpenMachineController({
  //       location: locationId,
  //       specificLocation: specificLocationId,
  //       machine: machineId,
  //       status: true,
  //     })
  //   );
  // }
};

export default reloadOpenPageHandler;
