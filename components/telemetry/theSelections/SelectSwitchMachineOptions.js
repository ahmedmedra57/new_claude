import { useEffect, useState } from 'react';
import { useMasterControlSelectStore } from '../../zustand-stores';
import styled from 'styled-components';
import {
  layerBDark,
  layerB,
  scrollbarY,
  layerA,
  justifyContentFlexStart,
} from '../../styles/commonStyles';
import {
  handleAddLocations,
  handleAddMachines,
  handleAddSpecificLocations,
  handleLocationSelect,
  handleMachineSelect,
  handleMachineSelectAlt,
  handleMachineSelectWithSpecLocationAlt,
  handleSelectAll,
  handleSelectedOne,
  handleSpecificLocationSelect,
  selectMasterControls,
} from '../../store/slices/masterControlSelectSlice';

import { handleResetAll } from '../../store/slices/selectedMachinesSlice';
import {
  tesHandleSelectIndividualMachine,
  tesHandleUnSelectIndividualMachine,
  tesSpecificLocationSelectMachinesHandler,
  tesSpecificLocationUnselectMachinesHandler,
} from '../../store/slices/tesSwitchSlice';
import {
  tgsHandleSelectIndividualMachine,
  tgsHandleUnSelectIndividualMachine,
  tgsSpecificLocationSelectMachinesHandler,
  tgsSpecificLocationUnselectMachinesHandler,
} from '../../store/slices/tgsSwitchSlice';

import {
  flexBoxCenter,
  justifyContentFlexEnd,
  justifyContentSpaceBetween,
} from '../../styles/commonStyles';
import {
  essSpecificLocationSelectMachinesHandler,
  essSpecificLocationUnselectMachinesHandler,
  handleSelectIndividualMachine,
  handleUnSelectIndividualMachine,
} from '../../store/slices/essSwitchSlice';
import SelectIndividualOptions from './SelectIndividualOptions';
import SelectionsButton from './SelectionsButton';
import {
  hpEcHandleSelectIndividualMachine,
  hpEcHandleUnSelectIndividualMachine,
} from '../../store/slices/hpElectricSwitchSlice';
import {
  hpGcHandleSelectIndividualMachine,
  hpGcHandleUnSelectIndividualMachine,
} from '../../store/slices/hpGasSwitchSlice';
import {
  tgsDataConsumptionHandleSelectIndividualMachine,
  tgsDataConsumptionHandleUnSelectIndividualMachine,
  tgsDataConsumptionSpecificLocationSelectMachineHandler,
  tgsDataConsumptionSpecificLocationUnselectMachineHandler,
} from '../../store/slices/tgsDataConsumptionSlice';
import {
  tesDataConsumptionHandleSelectIndividualMachine,
  tesDataConsumptionHandleUnSelectIndividualMachine,
  tesDataConsumptionSpecificLocationSelectMachineHandler,
  tesDataConsumptionSpecificLocationUnselectMachineHandler,
} from '../../store/slices/tesDataConsumptionSlice';
import {
  essDataConsumptionHandleSelectIndividualMachine,
  essDataConsumptionHandleUnSelectIndividualMachine,
  essDataConsumptionSpecificLocationSelectMachineHandler,
  essDataConsumptionSpecificLocationUnselectMachineHandler,
} from '../../store/slices/essDataConsumptionSlice';
import {
  hpDataConsumptionHandleSelectIndividualMachine,
  hpDataConsumptionHandleUnSelectIndividualMachine,
} from '../../store/slices/hpDataConsumptionSlice';
import { useSelectSwitchDropBoxDispatches } from '../../../hooks/useSelectSwitchesDispatches';
import { useSelectSwitchesDisplay } from '../../../hooks/useSelectSwitchesDisplay';
import { useSelectBoxArrowsState } from '../../../hooks/useSelectBoxArrowsState';
import { getAllSpecificLocationNames } from '../../../helpers/helpers';

const SelectSwitchMachineOptions = ({
  handleClose,
  data,
  swt,
  isTelemetry,
}) => {
  const locations = Object.keys(data);
  const buttons = ['clear', 'apply'];
  const masterControlSelects = useMasterControlSelectStore();
  
  const [isSelected, setIsSelected] = useState(false);

  const [specificLocationsNameList, setSpecificLocationsNameList] = useState(
    []
  );

  const { trackArrowState, trackSpecLocationArrowState, specificLocations } =
    useSelectBoxArrowsState(data);

  const [isArrowDown, setIsArrowDown] = useState(trackArrowState);
  const [isSpecLocationArrowDown, setIsSpecLocationArrowDown] = useState(
    trackSpecLocationArrowState
  );

  const {
    // for styling
    isAllSelected,
    isLocationSelected,
    isSpecificLocationSelected,
    isMachineSelected,
    // for dispatch
    selectedSpecificLocations,
    selectedMachines,
    selectedLocations,
  } =
    swt === 'ess'
      ? masterControlSelects.ess
      : swt === 'tes'
      ? masterControlSelects.tes
      : swt === 'tgs'
      ? masterControlSelects.tgs
      : swt === 'essDc'
      ? masterControlSelects.essDc
      : swt === 'tgsTesDc'
      ? masterControlSelects.tgsTesDc
      : swt === 'hpDc'
      ? masterControlSelects.hpDc
      : swt === 'hpEc'
      ? masterControlSelects.hpEc
      : swt === 'hpGc' && masterControlSelects.hpGc;

  const allSelectBoxData = {
    isAllSelected,
    isLocationSelected,
    isSpecificLocationSelected,
    isMachineSelected,
    selectedSpecificLocations,
    selectedMachines,
    selectedLocations,
  };

  useEffect(() => {
    // const allSpecificLocationsName = [];
    // data &&
    //   Object.values(data).forEach((value) => {
    //     if (
    //       !Object.values(value)[0]?.machineType &&
    //       Object.keys(value).length > 0
    //     ) {
    //       allSpecificLocationsName.push(Object.keys(value)[0]);
    //     }
    //   });
    const result = getAllSpecificLocationNames(data);
    setSpecificLocationsNameList(result);
  }, [data]);

  // !!TEST!!
  // Select handler for the green indicator for Select Switches
  const useHandleSelect = (option, machine, extraOption, machineIndex) => {
    setIsSelected(true);
    useSelectSwitchesDisplay(
      option,
      machine,
      extraOption,
      machineIndex,
      specificLocations,
      swt,
      data,
      allSelectBoxData,
      dispatch
    );
  };

  // handles clear and apply buttons of select switches
  const useHandleOnClick = (button) => {
    useSelectSwitchDropBoxDispatches(
      button,
      allSelectBoxData,
      swt,
      isSelected,
      handleClose,
      data,
      dispatch
    );
  };

  // const verifyNoSpecificLocations = (location) => {
  //   const locationData = data[location];

  //   return Object.values(locationData).some((el) => el?.machineType);
  // };

  // const selectLocationsHandler = (locations) => {
  //   locations.forEach((location) => {
  //     if (verifyNoSpecificLocations(location)) {
  //       handleSelectLocation(location, true);
  //     } else {
  //       Object.keys(data[location]).forEach((specificLocation) =>
  //         handleSelectLocation(location, true, specificLocation)
  //       );
  //     }
  //   });
  // };

  // const selectSpecificLocationsHandler = (specificLocations) => {
  //   specificLocations.forEach((specificLocation) => {
  //     const location = Object.entries(data).filter(
  //       ([key, value]) => Object.keys(value)[0] === specificLocation
  //     )[0][0];

  //     handleSelectLocation(location, true, specificLocation);
  //   });
  // };

  // const selectMachinesHandler = (machines) => {
  //   machines.forEach((machine) => {
  //     if (machine[2]) {
  //       handleSelectLocation(machine[0], true, machine[1], [machine[2]]);
  //     } else {
  //       handleSelectLocation(machine[0], true, null, [machine[1]]);
  //     }
  //   });
  // };

  // const switchCountHandler = (machines) => {
  //   let selectedSwtNumber = 0;
  //   machines.forEach((location) =>
  //     location.forEach((machine) => {
  //       if (typeof machine === 'object') {
  //         machine.forEach((el) => {
  //           if (el) {
  //             selectedSwtNumber += 1;
  //           }
  //         });
  //       } else {
  //         if (machine) {
  //           selectedSwtNumber += 1;
  //         }
  //       }
  //     })
  //   );
  //   dispatch(
  //     handleSelectedOne({
  //       switch: swt,
  //       selectedOne: `${selectedSwtNumber} switches`,
  //     })
  //   );
  // };

  // Clear and Apply Button handler
  // const handleOnClick = (button) => {
  //   if (button === 1) {
  //     if (isAllSelected) {
  //       // 1. selected All
  //       // dispatch
  //       dispatch(handleSelectedOne({ switch: swt, selectedOne: 'all' });
  //       // #1.1. select locations
  //       selectLocationsHandler(locations);
  //     } else if (isLocationSelected.indexOf(true) !== -1) {
  //       // #2.1. selected locations
  //       selectLocationsHandler(selectedLocations);

  //       // #2.2. selected specific locations
  //       if (selectedSpecificLocations.length > 0) {
  //         selectSpecificLocationsHandler(selectedSpecificLocations);
  //       }

  //       // #2.3. selected individual machines
  //       if (selectedMachines.length > 0) {
  //         selectMachinesHandler(selectedMachines);
  //       }

  //       // #2.4. switches/machines count
  //       switchCountHandler(isMachineSelected);
  //     } else if (isSpecificLocationSelected.indexOf(true) !== -1) {
  //       // #3. selected specific locations
  //       selectSpecificLocationsHandler(selectedSpecificLocations);

  //       // #3.1.selected machines
  //       if (selectedMachines.length > 0) {
  //         selectMachinesHandler(selectedMachines);
  //       }

  //       // #3.2.switches/machines count
  //       switchCountHandler(isMachineSelected);
  //     } else if (selectedMachines.length > 0) {
  //       // #4.only selected individual machines
  //       selectMachinesHandler(selectedMachines);

  //       // #4.1.switches/machines count
  //       switchCountHandler(isMachineSelected);
  //     } else if (!isSelected) {
  //       dispatch(handleSelectedOne({ switch: swt, selectedOne: null });
  //     }

  //     // close select box
  //     handleClose();
  //   } else {
  //     // reset all selections
  //     // 1.reset all local states
  //     dispatch(handleSelectAll({ switch: swt, status: false });
  //     dispatch(handleSelectedOne({ switch: swt, selectedOne: null });

  //     // 1.1.reset state for dispatch
  //     dispatch(handleAddLocations({ switch: swt, arr: [] });
  //     dispatch(handleAddSpecificLocations({ switch: swt, arr: [] });
  //     dispatch(handleAddMachines({ switch: swt, arr: [] });

  //     // 2. reset location
  //     const arr = locations.map((location) => false);
  //     dispatch(handleLocationSelect({ switch: swt, arr });

  //     // 2.1 reset specific location
  //     const specificLocationArr = [];
  //     const machineArr = Object.values(data).map((location) =>
  //       Object.values(location).map((value) => {
  //         if (value.machineType) {
  //           return false;
  //         } else {
  //           return Object.keys(value).map((el) => {
  //             specificLocationArr.push(false);
  //             return false;
  //           });
  //         }
  //       })
  //     );

  //     dispatch(
  //       handleSpecificLocationSelect({
  //         arr: specificLocationArr,
  //         switch: swt,
  //       })
  //     );

  //     // 2.2reset selected machines
  //     dispatch(handleMachineSelect({ switch: swt, arr: machineArr });

  //     // dispatch the selected switch slice
  //     locations.forEach((location) => {
  //       if (verifyNoSpecificLocations(location)) {
  //         handleSelectLocation(location);
  //       } else {
  //         Object.keys(data[location]).map((specificLocation) =>
  //           handleSelectLocation(location, null, specificLocation)
  //         );
  //       }
  //     });

  //     // close select box
  //     handleClose();
  //   }
  // };

  // const handleSelectLocation = (
  //   option,
  //   select,
  //   extraOption,
  //   selectedMachines
  // ) => {
  //   let machines;

  //   if (selectedMachines) {
  //     machines = selectedMachines;
  //   } else if (extraOption) {
  //     machines = Object.keys(data[option][extraOption]);
  //   } else {
  //     machines = Object.keys(data[option]);
  //   }

  //   if (swt === 'ess') {
  //     if (select) {
  //       if (extraOption) {
  //         machines.forEach((machine) =>
  //           dispatch(
  //             essSpecificLocationSelectMachinesHandler({
  //               location: option,
  //               machine,
  //               specificLocation: extraOption,
  //             })
  //           )
  //         );
  //       } else {
  //         machines.forEach((machine) =>
  //           dispatch(
  //             handleSelectIndividualMachine({
  //               location: option,
  //               machine,
  //             })
  //           )
  //         );
  //       }
  //     } else {
  //       if (extraOption) {
  //         machines.forEach((machine) =>
  //           dispatch(
  //             essSpecificLocationUnselectMachinesHandler({
  //               location: option,
  //               machine,
  //               specificLocation: extraOption,
  //             })
  //           )
  //         );
  //       } else {
  //         machines.forEach((machine) =>
  //           dispatch(
  //             handleUnSelectIndividualMachine({
  //               location: option,
  //               machine,
  //             })
  //           )
  //         );
  //       }
  //     }
  //   } else if (swt === 'tes') {
  //     if (select) {
  //       if (extraOption) {
  //         machines.forEach((machine) =>
  //           dispatch(
  //             tesSpecificLocationSelectMachinesHandler({
  //               location: option,
  //               machine,
  //               specificLocation: extraOption,
  //             })
  //           )
  //         );
  //       } else {
  //         machines.forEach((machine) =>
  //           dispatch(
  //             tesHandleSelectIndividualMachine({
  //               location: option,
  //               machine,
  //             })
  //           )
  //         );
  //       }
  //     } else {
  //       if (extraOption) {
  //         machines.forEach((machine) =>
  //           dispatch(
  //             tesSpecificLocationUnselectMachinesHandler({
  //               location: option,
  //               machine,
  //               specificLocation: extraOption,
  //             })
  //           )
  //         );
  //       } else {
  //         machines.forEach((machine) =>
  //           dispatch(
  //             tesHandleUnSelectIndividualMachine({
  //               location: option,
  //               machine,
  //             })
  //           )
  //         );
  //       }
  //     }
  //   } else if (swt === 'tgs') {
  //     if (select) {
  //       if (extraOption) {
  //         machines.forEach((machine) =>
  //           dispatch(
  //             tgsSpecificLocationSelectMachinesHandler({
  //               location: option,
  //               machine,
  //               specificLocation: extraOption,
  //             })
  //           )
  //         );
  //       } else {
  //         machines.forEach((machine) =>
  //           dispatch(
  //             tgsHandleSelectIndividualMachine({
  //               location: option,
  //               machine,
  //             })
  //           )
  //         );
  //       }
  //     } else {
  //       if (extraOption) {
  //         machines.forEach((machine) =>
  //           dispatch(
  //             tgsSpecificLocationUnselectMachinesHandler({
  //               location: option,
  //               machine,
  //               specificLocation: extraOption,
  //             })
  //           )
  //         );
  //       } else {
  //         machines.forEach((machine) =>
  //           dispatch(
  //             tgsHandleUnSelectIndividualMachine({
  //               location: option,
  //               machine,
  //             })
  //           )
  //         );
  //       }
  //     }
  //   } else if (swt === 'hpEc') {
  //     if (select) {
  //       machines.forEach((machine) =>
  //         dispatch(
  //           hpEcHandleSelectIndividualMachine({
  //             location: option,
  //             machine,
  //             specificLocation: extraOption,
  //           })
  //         )
  //       );
  //     } else {
  //       machines.forEach((machine) =>
  //         dispatch(
  //           hpEcHandleUnSelectIndividualMachine({
  //             location: option,
  //             machine,
  //             specificLocation: extraOption,
  //           })
  //         )
  //       );
  //     }
  //   } else if (swt === 'hpGc') {
  //     if (select) {
  //       machines.forEach((machine) =>
  //         dispatch(
  //           hpGcHandleSelectIndividualMachine({
  //             location: option,
  //             machine,
  //             specificLocation: extraOption,
  //           })
  //         )
  //       );
  //     } else {
  //       machines.forEach((machine) =>
  //         dispatch(
  //           hpGcHandleUnSelectIndividualMachine({
  //             location: option,
  //             machine,
  //             specificLocation: extraOption,
  //           })
  //         )
  //       );
  //     }
  //   } else if (swt === 'essDc') {
  //     if (select) {
  //       if (extraOption) {
  //         machines.forEach((machine) =>
  //           dispatch(
  //             essDataConsumptionSpecificLocationSelectMachineHandler({
  //               location: option,
  //               machine,
  //               specificLocation: extraOption,
  //             })
  //           )
  //         );
  //       } else {
  //         machines.forEach((machine) =>
  //           dispatch(
  //             essDataConsumptionHandleSelectIndividualMachine({
  //               location: option,
  //               machine,
  //             })
  //           )
  //         );
  //       }
  //     } else {
  //       if (extraOption) {
  //         machines.forEach((machine) =>
  //           dispatch(
  //             essDataConsumptionSpecificLocationUnselectMachineHandler({
  //               location: option,
  //               machine,
  //               specificLocation: extraOption,
  //             })
  //           )
  //         );
  //       } else {
  //         machines.forEach((machine) =>
  //           dispatch(
  //             essDataConsumptionHandleUnSelectIndividualMachine({
  //               location: option,
  //               machine,
  //             })
  //           )
  //         );
  //       }
  //     }
  //   } else if (swt === 'tesDc') {
  //     if (select) {
  //       if (extraOption) {
  //         machines.forEach((machine) =>
  //           dispatch(
  //             tesDataConsumptionSpecificLocationSelectMachineHandler({
  //               location: option,
  //               machine,
  //               specificLocation: extraOption,
  //             })
  //           )
  //         );
  //       } else {
  //         machines.forEach((machine) =>
  //           dispatch(
  //             tesDataConsumptionHandleSelectIndividualMachine({
  //               location: option,
  //               machine,
  //             })
  //           )
  //         );
  //       }
  //     } else {
  //       if (extraOption) {
  //         machines.forEach((machine) =>
  //           dispatch(
  //             tesDataConsumptionSpecificLocationUnselectMachineHandler({
  //               location: option,
  //               machine,
  //               specificLocation: extraOption,
  //             })
  //           )
  //         );
  //       } else {
  //         machines.forEach((machine) =>
  //           dispatch(
  //             tesDataConsumptionHandleUnSelectIndividualMachine({
  //               location: option,
  //               machine,
  //             })
  //           )
  //         );
  //       }
  //     }
  //   } else if (swt === 'tgsDc') {
  //     if (select) {
  //       if (extraOption) {
  //         machines.forEach((machine) =>
  //           dispatch(
  //             tgsDataConsumptionSpecificLocationSelectMachineHandler({
  //               location: option,
  //               machine,
  //               specificLocation: extraOption,
  //             })
  //           )
  //         );
  //       } else {
  //         machines.forEach((machine) =>
  //           dispatch(
  //             tgsDataConsumptionHandleSelectIndividualMachine({
  //               location: option,
  //               machine,
  //             })
  //           )
  //         );
  //       }
  //     } else {
  //       if (extraOption) {
  //         machines.forEach((machine) =>
  //           dispatch(
  //             tgsDataConsumptionSpecificLocationUnselectMachineHandler({
  //               location: option,
  //               machine,
  //               specificLocation: extraOption,
  //             })
  //           )
  //         );
  //       } else {
  //         machines.forEach((machine) =>
  //           dispatch(
  //             tgsDataConsumptionHandleUnSelectIndividualMachine({
  //               location: option,
  //               machine,
  //             })
  //           )
  //         );
  //       }
  //     }
  //   } else if (swt === 'hpDc') {
  //     if (select) {
  //       machines.forEach((machine) =>
  //         dispatch(
  //           hpDataConsumptionHandleSelectIndividualMachine({
  //             location: option,
  //             machine,
  //             specificLocation: extraOption,
  //           })
  //         )
  //       );
  //     } else {
  //       machines.forEach((machine) =>
  //         dispatch(
  //           hpDataConsumptionHandleUnSelectIndividualMachine({
  //             location: option,
  //             machine,
  //             specificLocation: extraOption,
  //           })
  //         )
  //       );
  //     }
  //   }
  // };

  // Select handler for the indicator for Select Switches
  // const handleSelect = (option, machine, extraOption, machineIndex) => {
  //   setIsSelected(true);

  //   if (option === 'all') {
  //     // 1. select all
  //     dispatch(handleSelectAll({ switch: swt, status: true });

  //     // update all locations
  //     const locationArr = isLocationSelected.map((location) => true);
  //     dispatch(handleLocationSelect({ switch: swt, arr: locationArr });

  //     // update all specific locations
  //     const specificLocationArr = isSpecificLocationSelected.map((el) => true);
  //     dispatch(
  //       handleSpecificLocationSelect({ switch: swt, arr: specificLocationArr })
  //     );

  //     // update all machines
  //     const individualArr = Object.values(data)?.map((location) => {
  //       const locationArr = Object.values(location);
  //       if (locationArr[0]?.machineType) {
  //         return locationArr.map((machine) => true);
  //       } else {
  //         return locationArr.map((specLocation) =>
  //           Object.keys(specLocation).map((machine) => true)
  //         );
  //       }
  //     });

  //     dispatch(handleMachineSelect({ switch: swt, arr: individualArr });
  //   } else if (option !== 'all' && machine === undefined) {
  //     // 2. select location
  //     // update the location
  //     const index = locations.indexOf(option);
  //     const arr = [...isLocationSelected];
  //     arr[index] = true;
  //     dispatch(handleLocationSelect({ switch: swt, arr });

  //     // update specific locations
  //     const exitingSpecLocationsValue = Object.values(data).filter(
  //       (el) =>
  //         !Object.values(el)[0]?.machineType && Object.keys(el).length !== 0
  //     );

  //     const tempArr = [];
  //     exitingSpecLocationsValue.forEach((specLocationTitle) => {
  //       Object.keys(data[option]).forEach((el) => {
  //         if (el === Object.keys(specLocationTitle)[0]) {
  //           tempArr.push(true);
  //         } else {
  //           tempArr.push(false);
  //         }
  //       });
  //     });

  //     if (tempArr.length > 0) {
  //       dispatch(handleSpecificLocationSelect({ switch: swt, arr: tempArr });
  //     }

  //     // update machines in the location

  //     const machineNewArr = isMachineSelected[index]?.map((el) => {
  //       if (typeof el === 'boolean') {
  //         return true;
  //       } else {
  //         const machineArr = el?.map((machine) => true);
  //         return machineArr;
  //       }
  //     });
  //     const copyArr = [...isMachineSelected];
  //     copyArr[index] = machineNewArr;
  //     dispatch(handleMachineSelect({ switch: swt, arr: copyArr });

  //     // for dispatch selected locations
  //     const newSelect = [...selectedLocations];
  //     newSelect.push(option);
  //     dispatch(handleAddLocations({ switch: swt, arr: newSelect });
  //   } else if (option !== 'all' && machine === 'isSpecificLocation') {
  //     // 3. select specific location
  //     // location index
  //     const locationIndex = locations.indexOf(option);
  //     // update the location
  //     const index = specificLocations.indexOf(extraOption);
  //     const arr = [...isSpecificLocationSelected];
  //     arr[index] = true;
  //     dispatch(handleSpecificLocationSelect({ switch: swt, arr });

  //     // update machines in the specific location

  //     const machineNewArr = isMachineSelected[locationIndex][machineIndex]?.map(
  //       (machine) => true
  //     );

  //     const deepCopyArr = JSON.parse(JSON.stringify(isMachineSelected);

  //     deepCopyArr[locationIndex][machineIndex] = machineNewArr;
  //     dispatch(handleMachineSelect({ switch: swt, arr: deepCopyArr });

  //     // for dispatch selected locations
  //     const newSelect = [...selectedSpecificLocations];
  //     newSelect.push(extraOption);
  //     dispatch(handleAddSpecificLocations({ switch: swt, arr: newSelect });
  //   } else {
  //     // 4. select individually
  //     const locationIdx = Object.keys(data).indexOf(option);

  //     const newSelectedMachineArr = [...selectedMachines];

  //     if (extraOption) {
  //       const specLocationIdx = Object.keys(data[option]).indexOf(extraOption);
  //       const machineIdx = Object.values(data[option])
  //         .map((el) => Object.keys(el)[0])
  //         .indexOf(machine);

  //       dispatch(
  //         handleMachineSelectWithSpecLocationAlt({
  //           switch: swt,
  //           locationIdx,
  //           specLocationIdx,
  //           machineIdx,
  //         })
  //       );

  //       newSelectedMachineArr.push([option, extraOption, machine]);
  //     } else {
  //       const machineIdx = Object.keys(data[option]).indexOf(machine);

  //       dispatch(
  //         handleMachineSelectAlt({ switch: swt, locationIdx, machineIdx })
  //       );

  //       newSelectedMachineArr.push([option, machine]);
  //     }

  //     // for dispatch selected machines

  //     dispatch(handleAddMachines({ switch: swt, arr: newSelectedMachineArr });
  //   }
  // };

  //   const specificLocationsValues = Object.values(data)
  //   .filter((location) => !Object.values(location)[0]?.machineType)
  //   .filter((el) => Object.keys(el).length > 0);
  // const specificLocations = specificLocationsValues.map(
  //   (location) => Object.keys(location)[0]
  // );

  //   const trackArrowState = locations.map((el) => false);
  //   const trackSpecLocationArrowState = specificLocations.map((el) => false);

  return (
    <>
      {swt && (
        <Wrapper>
          <ScrollBarWrapper>
            <SectionOptions>
              <SelectIndividualOptions
                option='all'
                // handleSelect={handleSelect}
                handleSelect={useHandleSelect}
                isSelected={isAllSelected}
                isTelemetry={isTelemetry}
              />

              {locations.map((location, index) => {
                return (
                  <SelectIndividualOptions
                    key={index}
                    index={index}
                    option={location}
                    data={data[location]}
                    // handleSelect={handleSelect}
                    handleSelect={useHandleSelect}
                    isSelected={isLocationSelected[index]}
                    allSpecificLocationsName={specificLocationsNameList}
                    isSpecificLocationSelected={isSpecificLocationSelected}
                    isMachineSelected={
                      isMachineSelected[index] && isMachineSelected[index]
                    }
                    isArrowDown={isArrowDown}
                    setIsArrowDown={setIsArrowDown}
                    isSpecLocationArrowDown={isSpecLocationArrowDown}
                    setIsSpecLocationArrowDown={setIsSpecLocationArrowDown}
                    isTelemetry={isTelemetry}
                  />
                );
              })}
            </SectionOptions>
          </ScrollBarWrapper>
          <SectionButtons>
            <ButtonWrapper>
              {buttons.map((button, index) => (
                <div key={index}>
                  <SelectionsButton
                    title={button}
                    onClickButton={useHandleOnClick}
                    index={index}
                  />
                </div>
              ))}
            </ButtonWrapper>
          </SectionButtons>
        </Wrapper>
      )}
    </>
  );
};

export default SelectSwitchMachineOptions;

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  margin-top: 5px;
  ${flexBoxCenter} /* ${justifyContentSpaceBetween} */
  flex-direction: column;
`;

const ScrollBarWrapper = styled.div`
  width: 99.5%;
  min-height: 68px;
  max-height: 184px;
  padding: 4px;
  margin-bottom: 4px;
  border-radius: 14px 8px 8px 14px;
  ${layerBDark}

  ${justifyContentFlexStart}
`;

const SectionOptions = styled.div`
  width: 100%;
  min-height: 60px;
  max-height: 176px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;

  ${scrollbarY}
`;

const SectionButtons = styled.div`
  width: 98%;
  height: 45px;

  ${justifyContentFlexEnd}
`;

const ButtonWrapper = styled.div`
  width: 174px;
  height: 45px;
  padding-left: 2px;
  padding-right: 2px;

  ${layerB}

  border-radius: 23px;
  opacity: 1;
  z-index: 10;
  ${justifyContentSpaceBetween}
`;
