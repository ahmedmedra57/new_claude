import { useState } from "react";
import { useESSSwitchStore, useLocationsStore, useMCCommandStore, useMasterControlSelectStore, useTESSwitchStore, useTGSSwitchStore, useUserStore } from '../../zustand-stores';
import styled, { css } from "styled-components";
import {
import { useMCCommandStore, useMCStore, useMasterControlSelectStore, useUnitsStore } from '../zustand-stores';
  handleAddLocations,
  handleAddMachines,
  handleAddSpecificLocations,
  handleLocationSelect,
  handleMachineSelect,
  handleResetAllSelect,
  handleSelectAll,
  handleSelectedOne,
  handleSpecificLocationSelect,
  selectMasterControls,
import {
  handleApplyCommand,
  handleControlResetInit,
  handleCreateCommand,
  handleSearchCommand,
  handleViewCommand,
  handleViewPrevCommandAndCreateNewCommand,
  selectMCCommand,
import {
  flexBoxCenter,
  justifyContentSpaceAround,
  layerA180Deg,
  layerBDark,
} from "../../styles/commonStyles";
import CommandSelectionsApplyButton from "./CommandSelectionsApplyButton";
import ShareComponent from "./ShareComponent";
import {
  essSpecificLocationSelectMachinesHandler,
  handleSelectIndividualMachine,
  handleUnSelectIndividualMachine,
  selectEssSwitch,
import {
  selectTgsSwitch,
  tgsHandleSelectIndividualMachine,
  tgsHandleUnSelectIndividualMachine,
  tgsSpecificLocationSelectMachinesHandler,
import {
  selectTesSwitch,
  tesHandleSelectIndividualMachine,
  tesHandleUnSelectIndividualMachine,
  tesSpecificLocationSelectMachinesHandler,
import {
  AddScheduleHandlerTempo,
  constantHeatHandlerTempo,
  fanOnlyHandlerTempo,
  handleAllDeactivatePrograms,
  handleResetAll,
  instantHeatHandlerTempo,
  snowSensorHandlerTempo,
  toggleAtsHandlerTempo,
  windFactorHandlerTempo,
import { useContext } from "react";
import { MasterControlContext } from "../MaterControlContext";
import { readableTime } from "../../../helpers/helpers";
import testData from "../../../test_data/testData";
import {
  selectLocationsHandler,
  selectMachinesHandler,
  selectSpecificLocationsHandler,
  switchCountHandler,
  unselectAllMachinesHandler,
} from "../../../hooks/useSelectSwitchesDispatches";

function MasterControlCommandMain({
  handleMessageBox,
  selectedSwitches,
  setSelectedSwitches,
  handleCreateNewCommandMessageBox,
  // commandConfirmed,
}) {
  const { setSelectSystem } = useMCStore();
  const { setUnits } = useUnitsStore();
    const mCCommandState = useMCCommandStore();
  const selectSwitch = useMasterControlSelectStore();
  const viewCommandState = mCCommandState.viewCommand;
  const essSwitchState = useESSSwitchStore();
  const tgsSwitchState = useTGSSwitchStore();
  const tesSwitchState = useTESSwitchStore();

  // ess || tes || teg
  const { essSwitch, flatEssSwitch } = essSwitchState;
  const { tesSwitch, flatTesSwitch } = tesSwitchState;
  const { tgsSwitch, flatTgsSwitch } = tgsSwitchState;

  const UserState = useUserStore();
  const userID = UserState.user.user_id;

  // useContext for styling purposes
  const {
    greenDetour,
    setGreenDetour,
    setSelectPrograms,
    setIsSelectedForAts,
    setResetDialControl,
    // select,
  } = useContext(MasterControlContext);

  // these 2 states are used for CommandSelectionsApplyButton component
  const [openingSelectionBox, setOpeningSelectionBox] = useState(false);
  const [selectCommand, setSelectCommand] = useState({});

  const checkIsThereACommandSelected = Object.keys(selectCommand).length > 0;
  const userCommandInfo =
    checkIsThereACommandSelected &&
    mCCommandState.commandsInfo[selectCommand.userId];

  const title =
    checkIsThereACommandSelected === false || !viewCommandState
      ? "view commands"
      : selectCommand.command;

  const handleOpenViewCommandBox = (idx, e) => {
    e.stopPropagation();
    switch (idx) {
      case 0:
        useMCStore().resetControlInit(true);
        break;
      case 1:
        setResetDialControl(false);
        useMCStore().resetControlInit(false);
        break;
      default:
        break;
    }
    setOpeningSelectionBox(!openingSelectionBox);
  };

  const handleApplyButton = (e) => {
    e.stopPropagation();

    if (
      selectSwitch.ess.selectedOne ||
      selectSwitch.tes.selectedOne ||
      selectSwitch.tgs.selectedOne
    ) {
      useMCCommandStore().setApplyMessageBox(true);
      handleMessageBox();
      useMCCommandStore().setViewCommand(false);
      useMCStore().resetControlInit(false);
    }
  };

  const handleCreateNewCommand = () => {
    // ***this will create new command which will set everything to default and increase the command# by 1
    // useMCCommandStore().viewPrevAndCreateNew();
    useMCCommandStore().createCommand();
    useMCCommandStore().applyCommand(false);
  };

  const handleCommandResetSystem = () => {
    // ***resets all dial system selection state in selected machines slice

    useMasterControlSelectStore().resetAll();
  };

  // const dispatchSelectLocationHandler = (switchData, location, dispatchFC) => {
  //   Object.keys(switchData[location]).map((machine) =>
  //     dispatch(dispatchFC({ location, machine }))
  //   );
  // };

  // handles dispatch the selected ones to either essSwitchSlice, tgsSwitchSlice, tesSwitchSlice
  // const handleSelectLocation = (location, swt, select) => {
  //   // const machines = Object.keys(data[location]);
  //   switch (swt) {
  //     case 'ess':
  //       if (select) {
  //         dispatchSelectLocationHandler(
  //           essSwitch,
  //           location,
  //           handleSelectIndividualMachine
  //         );
  //         // Object.keys(essSwitch[location]).map((machine) =>
  //         //   dispatch(
  //         //     handleSelectIndividualMachine({ location: location, machine })
  //         //   )
  //         // );
  //       } else {
  //         dispatchSelectLocationHandler(
  //           essSwitch,
  //           location,
  //           handleUnSelectIndividualMachine
  //         );
  //         // Object.keys(essSwitch[location]).map((machine) =>
  //         //   dispatch(
  //         //     handleUnSelectIndividualMachine({ location: location, machine })
  //         //   )
  //         // );
  //       }
  //       break;
  //     case 'tgs':
  //       if (select) {
  //         // !!
  //         // dispatchSelectLocationHandler(
  //         //   tgsSwitch,
  //         //   location,
  //         //   tgsHandleSelectIndividualMachine
  //         // );
  //         // Object.keys(tgsSwitch[location]).map((machine) =>
  //         //   dispatch(
  //         //     tgsHandleSelectIndividualMachine({ location: location, machine })
  //         //   )
  //         // );
  //       } else {
  //         // !!
  //         // dispatchSelectLocationHandler(
  //         //   tgsSwitch,
  //         //   location,
  //         //   tgsHandleUnSelectIndividualMachine
  //         // );
  //         // Object.keys(tgsSwitch[location]).map((machine) =>
  //         //   dispatch(
  //         //     tgsHandleUnSelectIndividualMachine({ location: location, machine })
  //         //   )
  //         // );
  //       }
  //       break;
  //     case 'tes':
  //       if (select) {
  //         dispatchSelectLocationHandler(
  //           tesSwitch,
  //           location,
  //           tesHandleSelectIndividualMachine
  //         );
  //         // Object.keys(tesSwitch[location]).map((machine) =>
  //         //   dispatch(
  //         //     tesHandleSelectIndividualMachine({ location: location, machine })
  //         //   )
  //         // );
  //       } else {
  //         dispatchSelectLocationHandler(
  //           tesSwitch,
  //           location,
  //           tesHandleUnSelectIndividualMachine
  //         );
  //         // Object.keys(tesSwitch[location]).map((machine) =>
  //         //   dispatch(
  //         //     tesHandleUnSelectIndividualMachine({ location: location, machine })
  //         //   )
  //         // );
  //       }
  //       break;
  //     default:
  //       break;
  //   }
  // };

  // const selectLocationHandler = (switchData, swt) => {
  //   Object.keys(switchData).forEach((location) =>
  //     handleSelectLocation(location, swt, true)
  //   );
  // };

  //  this will simulate the select button function of "select switch location"
  // const handlesSelectedMachinesOfSelectedCommand = (
  //   swt,
  //   isLocationSelected,
  //   selectedLocations,
  //   isMachineSelected,
  //   selectedMachines,
  //   isAllSelected,
  //   newSpecificLocationList
  // ) => {
  //   //   logic for count selected machine numbers
  //   let selectedSwtNumber = 0;
  //   isMachineSelected.forEach((location) =>
  //     location.forEach((machine) => {
  //       if (machine) {
  //         selectedSwtNumber += 1;
  //       }
  //     })
  //   );

  //   if (isAllSelected) {
  //     // 1. selected All
  //     // dispatch
  //     useMasterControlSelectStore().setSelectedOne({ switch: swt, selectedOne: 'all' });
  //     switch (swt) {
  //       case 'ess':
  //         selectLocationHandler(essSwitch, swt);
  //         // Object.keys(essSwitch).forEach((location) =>
  //         //   handleSelectLocation(location, swt, true)
  //         // );
  //         break;
  //       case 'tgs':
  //         // !!
  //         // selectLocationHandler(tgsSwitch, swt);

  //         // Object.keys(tgsSwitch).forEach((location) =>
  //         //   handleSelectLocation(location, swt, true)
  //         // );
  //         break;
  //       case 'tes':
  //         selectLocationHandler(tesSwitch, swt);
  //         // Object.keys(tesSwitch).forEach((location) =>
  //         //   handleSelectLocation(location, swt, true)
  //         // );
  //         break;
  //       default:
  //         break;
  //     }
  //   } else if (newSpecificLocationList.length > 0) {

  //     switch (swt) {
  //       case 'ess':
  //         // selectedMachines.forEach((el) => {
  //         //   if (el.length === 2) {
  //         //     dispatchSelectedLocationMix(el, handleSelectIndividualMachine);
  //         //   } else {
  //         //     dispatch();
  //         //   }
  //         // });
  //         dispatchSelectedLocationAndLocationMix(
  //           selectedMachines,
  //           handleSelectIndividualMachine,
  //           essSpecificLocationSelectMachinesHandler
  //         );
  //         break;
  //       case 'tgs':
  //         dispatchSelectedLocationAndLocationMix(
  //           selectedMachines,
  //           tgsHandleSelectIndividualMachine,
  //           tgsSpecificLocationSelectMachinesHandler
  //         );

  //         break;
  //       case 'tes':
  //         dispatchSelectedLocationAndLocationMix(
  //           selectedMachines,
  //           tesHandleSelectIndividualMachine,
  //           tesSpecificLocationSelectMachinesHandler
  //         );

  //         break;
  //       default:
  //         break;
  //     }
  //   } else if (isLocationSelected.indexOf(true) !== -1) {
  //     // 2. selected locations
  //     selectedLocations.forEach((location) =>
  //       handleSelectLocation(location, swt, true)
  //     );

  //     if (selectedMachines.length > 0) {
  //       // 3. selected individual machines
  //       if (swt === 'ess') {
  //         dispatchHandler(selectedMachines, handleSelectIndividualMachine);
  //         // selectedMachines.forEach((machine) =>
  //         //   dispatch(
  //         //     handleSelectIndividualMachine({
  //         //       location: machine[0],
  //         //       machine: machine[1],
  //         //     })
  //         //   )
  //         // );
  //       } else if (swt === 'tes') {
  //         dispatchHandler(selectedMachines, tesHandleSelectIndividualMachine);
  //         // selectedMachines.forEach((machine) =>
  //         //   dispatch(
  //         //     tesHandleSelectIndividualMachine({
  //         //       location: machine[0],
  //         //       machine: machine[1],
  //         //     })
  //         //   )
  //         // );
  //       } else {
  //         // tgs option
  //         // !!
  //         // dispatchHandler(selectedMachines, tgsHandleSelectIndividualMachine);
  //         // selectedMachines.forEach((machine) =>
  //         //   dispatch(
  //         //     tgsHandleSelectIndividualMachine({
  //         //       location: machine[0],
  //         //       machine: machine[1],
  //         //     })
  //         //   )
  //         // );
  //       }
  //     }

  //     // dispatch(
  //     //   handleSelectedOne({
  //     //     switch: swt,
  //     //     selectedOne: `${selectedSwtNumber} switches`,
  //     //   })
  //     // );
  //   } else if (selectedMachines.length > 0) {
  //     // 3. selected individual machines
  //     if (swt === 'ess') {
  //       dispatchHandler(selectedMachines, handleSelectIndividualMachine);
  //       // selectedMachines.forEach((machine) =>
  //       //   dispatch(
  //       //     handleSelectIndividualMachine({
  //       //       location: machine[0],
  //       //       machine: machine[1],
  //       //     })
  //       //   )
  //       // );
  //     } else if (swt === 'tes') {
  //       dispatchHandler(selectedMachines, tesHandleSelectIndividualMachine);

  //       // selectedMachines.forEach((machine) =>
  //       //   dispatch(
  //       //     tesHandleSelectIndividualMachine({
  //       //       location: machine[0],
  //       //       machine: machine[1],
  //       //     })
  //       //   )
  //       // );
  //     } else {
  //       // tgs option
  //       // !!
  //       // dispatchHandler(selectedMachines, tgsHandleSelectIndividualMachine);
  //       // selectedMachines.forEach((machine) =>
  //       //   dispatch(
  //       //     tgsHandleSelectIndividualMachine({
  //       //       location: machine[0],
  //       //       machine: machine[1],
  //       //     })
  //       //   )
  //       // );
  //     }
  //   }
  //   dispatch(
  //     handleSelectedOne({
  //       switch: swt,
  //       selectedOne: `${selectedSwtNumber} switches`,
  //     })
  //   );
  //   // **if no machines were selected then dispatch the code below
  //   // else if (!isSelected) {
  //   //   useMasterControlSelectStore().setSelectedOne({ switch: swt, selectedOne: null });
  //   // }
  // };

  const handlesSelectedMachinesOfSelectedCommand = (
    swt,
    isSelected,
    data,
    isAllSelected,
    isLocationSelected,
    isSpecificLocationSelected,
    isMachineSelected,
    selectedSpecificLocations,
    selectedMachines,
    selectedLocations
  ) => {
    const locations = Object.keys(data);
    //  switches/machines count
    switchCountHandler(isMachineSelected, swt, dispatch);

    if (isAllSelected) {
      // 1. selected All
      // dispatch
      useMasterControlSelectStore().setSelectedOne({ switch: swt, selectedOne: "all" });
      // #1.1. select locations
      selectLocationsHandler(locations, swt, data, dispatch);
    } else if (isLocationSelected.indexOf(true) !== -1) {
      // #2.1. selected locations
      selectLocationsHandler(selectedLocations, swt, data, dispatch);

      // #2.2. selected specific locations
      if (selectedSpecificLocations.length > 0) {
        selectSpecificLocationsHandler(
          selectedSpecificLocations,
          swt,
          data,
          dispatch
        );
      }

      // #2.3. selected individual machines
      if (selectedMachines.length > 0) {
        selectMachinesHandler(selectedMachines, swt, data, dispatch);
      }

      // #2.4. switches/machines count
      // switchCountHandler(isMachineSelected);
    } else if (isSpecificLocationSelected.indexOf(true) !== -1) {
      // #3. selected specific locations
      selectSpecificLocationsHandler(
        selectedSpecificLocations,
        swt,
        data,
        dispatch
      );

      // #3.1.selected machines
      if (selectedMachines.length > 0) {
        selectMachinesHandler(selectedMachines, swt, data, dispatch);
      }

      // #3.2.switches/machines count
      // switchCountHandler(isMachineSelected);
    } else if (selectedMachines.length > 0) {
      // #4.only selected individual machines
      selectMachinesHandler(selectedMachines, swt, data, dispatch);

      // #4.1.switches/machines count
      // switchCountHandler(isMachineSelected);
    } else if (!isSelected) {
      useMasterControlSelectStore().setSelectedOne({ switch: swt, selectedOne: null });
    }
  };

  // const dispatchSelectedLocationAndLocationMix = (
  //   selectedMachines,
  //   dispatchLocation,
  //   dispatchSpecificLocation
  // ) => {
  //   selectedMachines.forEach((el) => {
  //     if (el.length === 2) {
  //       dispatch(dispatchLocation({ location: el[0], machine: el[1] });
  //     } else {
  //       dispatch(
  //         dispatchSpecificLocation({
  //           location: el[0],
  //           specificLocation: el[1],
  //           machine: el[2],
  //         })
  //       );
  //     }
  //   });
  // };

  // const dispatchHandler = (selectedMachines, swtDispatch) => {
  //   selectedMachines.forEach((machine) =>
  //     dispatch(
  //       swtDispatch({
  //         location: machine[0],
  //         machine: machine[1],
  //       })
  //     )
  //   );
  // };

  // TODO: implement specific locations
  const commandSelectMachinesHandler = (
    selectedLocations,
    selectedSpecificLocations,
    selectedMachines,
    selectedSystemAbr,
    switchesData
  ) => {
    if (!selectSwitch[selectedSystemAbr].selectedOne) {
      // 1. select all
      // check if all the locations were selected in selected command. eg: if all locations were selected that dispatch true else false.
      const locations = Object.keys(switchesData);
      const isAllSelected =
        selectedLocations.length === locations.length ? true : false;
      useMasterControlSelectStore().selectAll({
          switch: selectedSystemAbr,
          status: isAllSelected,
        });
      // 2. select locations
      // update isLocationSelected
      //  Each saved location from selected command will set a TRUE to Array to be ready for a dispatch to modify isLocationSelected
      const locationArr = locations.map((location) =>
        selectedLocations.some(
          (selectedLocation) => selectedLocation === location
        );
      useMasterControlSelectStore().selectLocation({ arr: locationArr, switch: selectedSystemAbr });

      // update selected location
      // push all the names of the locations that were saved in the selected command to be ready for dispatch
      const newSelectLocations = [];
      locationArr.forEach((location, idx) => {
        if (location) {
          newSelectLocations.push(locations[idx]);
        }
      });

      useMasterControlSelectStore().addLocations({
          switch: selectedSystemAbr,
          arr: newSelectLocations,
        });

      // 3. select specific locations
      // format of specific location saved in command:
      //  specificLocations:[['specLocation1'],[],['specLocation2']],
      let newSpecificLocationList = [];
      let isSpecificLocationSelected = [];

      if (selectedSpecificLocations) {
        // update isSpecificLocationSelected state
        const specificLocationState = selectedSpecificLocations
          .filter((specLocation) => specLocation.length > 0)
          .map((el) => el.map((_) => true);

        useMasterControlSelectStore().selectSpecificLocation({
            arr: specificLocationState,
            switch: selectedSystemAbr,
          });

        // update selectedSpecificLocations
        const newSpecLocation = [];
        selectedSpecificLocations.forEach((specLocation) =>
          specLocation.forEach((el) => newSpecLocation.push(el);
        useMasterControlSelectStore().addSpecificLocations({
            arr: newSpecLocation,
            switch: selectedSystemAbr,
          });
        newSpecificLocationList = newSpecLocation;
        isSpecificLocationSelected = specificLocationState;
      }

      // 4 select machines
      // Each saved machine from selected command will set a TRUE to Array to be ready for a dispatch to modify isMachineSelected
      const machines = Object.values(switchesData);
      const machineNewArr = [];
      const machineArr = machines.map((location) => {
        const machineNamesArr = [];
        machineNewArr.push(machineNamesArr);
        return Object.entries(location).map(([key, value]) => {
          const specificLocationMachines = [];
          if (value?.deviceMac) {
            machineNamesArr.push(key);
            return selectedMachines.some(
              (selectedMachine) => selectedMachine === key
            );
          } else {
            machineNamesArr.push(specificLocationMachines);
            return Object.keys(value).map((el) => {
              specificLocationMachines.push(key, el);
              return selectedMachines.some(
                (selectedMachine) => selectedMachine === el
              );
            });
          }
        });
      });

      // update isMachineSelected state
      useMasterControlSelectStore().selectMachine({ arr: machineArr, switch: selectedSystemAbr });

      // push all the names of the machines that were saved in the selected command to be ready for dispatch
      const newSelectedMachineArr = [];
      machineArr.forEach((location, locationIdx) => {
        if (location.length > 0) {
          location.forEach((el, elIdx) => {
            if (typeof el === "object") {
              el.forEach((machine) => {
                if (machine) {
                  newSelectedMachineArr.push([
                    locations[locationIdx],
                    machineNewArr[locationIdx][elIdx][0],
                    machineNewArr[locationIdx][elIdx][1],
                  ]);
                }
              });
            } else if (el) {
              newSelectedMachineArr.push([
                locations[locationIdx],
                machineNewArr[locationIdx][elIdx],
              ]);
            }
          });
        }
      });

      useMasterControlSelectStore().addMachines({
          switch: selectedSystemAbr,
          arr: newSelectedMachineArr,
        });

      const machinesArrLength = newSelectedMachineArr.length;

      handlesSelectedMachinesOfSelectedCommand(
        selectedSystemAbr,
        machinesArrLength,
        switchesData,
        isAllSelected,
        locationArr,
        isSpecificLocationSelected,
        machineArr,
        newSpecificLocationList,
        newSelectedMachineArr,
        newSelectLocations
      );

      // handlesSelectedMachinesOfSelectedCommand(
      //   selectedSystemAbr,
      //   locationArr,
      //   newSelect,
      //   machineArr,
      //   newSelectedMachineArr,
      //   isAllSelected,
      //   newSpecificLocationList
      // );
    }
  };

  // const tgsSelect = useMasterControlSelectStore();

  // !! TEST DATA!!
  // const locations = useLocationsStore();
  // const { testEssSwitch, testTgsSwitch } = testData(
  //   essSwitch,
  //   tgsSwitch,
  //   locations
  // );

  // TODO: implement specific locations
  // this set all the indicator ready for the select box of select switch location for it to be use.
  const handleSetPrevCommandSelectedMachines = (
    selectedSystemAbr,
    commandInfo
  ) => {
    const selectedLocations = commandInfo.locations;
    const selectedSpecificLocations = commandInfo?.specificLocations;
    const selectedMachines = commandInfo.machines
      .reduce((prev, curr) => prev.concat(curr), [])
      .map((el) => el);

    // !! TEST DATA!!
    // const switchesData =
    //   selectedSystemAbr === 'ess'
    //     ? testEssSwitch
    //     : selectedSystemAbr === 'tes'
    //     ? tesSwitch
    //     : testTgsSwitch;
    const switchesData =
      selectedSystemAbr === "ess"
        ? flatEssSwitch
        : selectedSystemAbr === "tes"
        ? flatTesSwitch
        : flatTgsSwitch;
    commandSelectMachinesHandler(
      selectedLocations,
      selectedSpecificLocations,
      selectedMachines,
      selectedSystemAbr,
      switchesData
    );
    // switch (selectedSystemAbr) {
    //   case 'ess':
    //     if (!selectSwitch.ess.selectedOne) {
    //       // check if all the locations were selected in selected command. eg: if all locations were selected that dispatch true else false.
    //       const essLocations = Object.keys(essSwitch);
    //       const isAllSelected =
    //         selectedLocations.length === essLocations.length ? true : false;
    //       dispatch(
    //         handleSelectAll({
    //           switch: selectedSystemAbr,
    //           status: isAllSelected,
    //         })
    //       );
    //       //  Each saved location from selected command will set a TRUE to Array to be ready for a dispatch to modify isLocationSelected
    //       const locationArr = essLocations.map((location) =>
    //         selectedLocations.some(
    //           (selectedLocation) => selectedLocation === location
    //         )
    //       );
    //       useMasterControlSelectStore().selectLocation({ arr: locationArr, switch: 'ess' });

    //       // push all the names of the locations that were saved in the selected command to be ready for dispatch
    //       const newSelect = [];
    //       locationArr.forEach((location, idx) => {
    //         if (location) {
    //           newSelect.push(essLocations[idx]);
    //         }
    //       });
    //       dispatch(
    //         handleAddLocations({ switch: selectedSystemAbr, arr: newSelect })
    //       );

    //       // Each saved machine from selected command will set a TRUE to Array to be ready for a dispatch to modify isMachineSelected
    //       const essMachines = Object.values(essSwitch);
    //       const machineNewArr = [];
    //       const machineArr = essMachines.map((location) => {
    //         const machineNamesArr = [];
    //         machineNewArr.push(machineNamesArr);
    //         return Object.keys(location).map((machine) => {
    //           machineNamesArr.push(machine);
    //           return selectedMachines.some(
    //             (selectedMachine) => selectedMachine === machine
    //           );
    //         });
    //       });
    //       useMasterControlSelectStore().selectMachine({ arr: machineArr, switch: 'ess' });

    //       // push all the names of the machines that were saved in the selected command to be ready for dispatch
    //       const newSelectedMachineArr = [];
    //       machineArr.forEach((location, locationIdx) => {
    //         if (location.length > 0) {
    //           location.forEach((machine, machineIdx) => {
    //             if (machine) {
    //               newSelectedMachineArr.push([
    //                 essLocations[locationIdx],
    //                 machineNewArr[locationIdx][machineIdx],
    //               ]);
    //             }
    //           });
    //         }
    //       });
    //       dispatch(
    //         handleAddMachines({
    //           switch: selectedSystemAbr,
    //           arr: newSelectedMachineArr,
    //         })
    //       );

    //       handlesSelectedMachinesOfSelectedCommand(
    //         selectedSystemAbr,
    //         locationArr,
    //         newSelect,
    //         machineArr,
    //         newSelectedMachineArr,
    //         isAllSelected
    //       );
    //     }
    //     break;
    //   case 'tgs':
    //     if (!selectSwitch.tgs.selectedOne) {
    //       // check if all the locations were selected in selected command. eg: if all locations were selected that dispatch true else false.
    //       const tgsLocations = Object.keys(tgsSwitch);
    //       const isAllSelected =
    //         selectedLocations.length === tgsLocations.length ? true : false;
    //       dispatch(
    //         handleSelectAll({
    //           status: isAllSelected,
    //           switch: selectedSystemAbr,
    //         })
    //       );
    //       //  Each saved location from selected command will set a TRUE to Array to be ready for a dispatch to modify isLocationSelected
    //       const locationArr = tgsLocations.map((location) =>
    //         selectedLocations.some(
    //           (selectedLocation) => selectedLocation === location
    //         )
    //       );
    //       useMasterControlSelectStore().selectLocation({ arr: locationArr, switch: 'tgs' });

    //       // push all the names of the locations that were saved in the selected command to be ready for dispatch
    //       const newSelect = [];
    //       locationArr.forEach((location, idx) => {
    //         if (location) {
    //           newSelect.push(tgsLocations[idx]);
    //         }
    //       });
    //       dispatch(
    //         handleAddLocations({ switch: selectedSystemAbr, arr: newSelect })
    //       );

    //       // Each saved machine from selected command will set a TRUE to Array to be ready for a dispatch to modify isMachineSelected
    //       const machineNewArr = [];
    //       const machineArr = Object.values(tgsSwitch).map((location) => {
    //         const machineNamesArr = [];
    //         machineNewArr.push(machineNamesArr);
    //         return Object.keys(location).map((machine) => {
    //           machineNamesArr.push(machine);
    //           return selectedMachines.some(
    //             (selectedMachine) => selectedMachine === machine
    //           );
    //         });
    //       });
    //       useMasterControlSelectStore().selectMachine({ arr: machineArr, switch: 'tgs' });

    //       // push all the names of the machines that were saved in the selected command to be ready for dispatch
    //       const newSelectedMachineArr = [];
    //       machineArr.forEach((location, locationIdx) => {
    //         if (location.length > 0) {
    //           location.forEach((machine, machineIdx) => {
    //             if (machine) {
    //               newSelectedMachineArr.push([
    //                 tgsLocations[locationIdx],
    //                 machineNewArr[locationIdx][machineIdx],
    //               ]);
    //             }
    //           });
    //         }
    //       });
    //       dispatch(
    //         handleAddMachines({
    //           switch: selectedSystemAbr,
    //           arr: newSelectedMachineArr,
    //         })
    //       );
    //       handlesSelectedMachinesOfSelectedCommand(
    //         selectedSystemAbr,
    //         locationArr,
    //         newSelect,
    //         machineArr,
    //         newSelectedMachineArr,
    //         isAllSelected
    //       );
    //     }
    //     break;
    //   case 'tes':
    //     if (!selectSwitch.tes.selectedOne) {
    //       // check if all the locations were selected in selected command. eg: if all locations were selected that dispatch true else false.
    //       const tesLocations = Object.keys(tesSwitch);
    //       const isAllSelected =
    //         selectedLocations.length === tesLocations.length ? true : false;
    //       dispatch(
    //         handleSelectAll({
    //           status: isAllSelected,
    //           switch: selectedSystemAbr,
    //         })
    //       );
    //       //  Each saved location from selected command will set a TRUE to Array to be ready for a dispatch to modify isLocationSelected
    //       const locationArr = tesLocations.map((location) =>
    //         selectedLocations.some(
    //           (selectedLocation) => selectedLocation === location
    //         )
    //       );
    //       useMasterControlSelectStore().selectLocation({ arr: locationArr, switch: 'tes' });

    //       // push all the names of the locations that were saved in the selected command to be ready for dispatch
    //       const newSelect = [];
    //       locationArr.forEach((location, idx) => {
    //         if (location) {
    //           newSelect.push(tesLocations[idx]);
    //         }
    //       });
    //       dispatch(
    //         handleAddLocations({ switch: selectedSystemAbr, arr: newSelect })
    //       );

    //       // Each saved machine from selected command will set a TRUE to Array to be ready for a dispatch to modify isMachineSelected
    //       const machineNewArr = [];
    //       const machineArr = Object.values(tesSwitch).map((location) => {
    //         const machineNamesArr = [];
    //         machineNewArr.push(machineNamesArr);
    //         return Object.keys(location).map((machine) => {
    //           machineNamesArr.push(machine);
    //           return selectedMachines.some(
    //             (selectedMachine) => selectedMachine === machine
    //           );
    //         });
    //       });
    //       useMasterControlSelectStore().selectMachine({ arr: machineArr, switch: 'tes' });

    //       // push all the names of the machines that were saved in the selected command to be ready for dispatch
    //       const newSelectedMachineArr = [];
    //       machineArr.forEach((location, locationIdx) => {
    //         if (location.length > 0) {
    //           location.forEach((machine, machineIdx) => {
    //             if (machine) {
    //               newSelectedMachineArr.push([
    //                 tesLocations[locationIdx],
    //                 machineNewArr[locationIdx][machineIdx],
    //               ]);
    //             }
    //           });
    //         }
    //       });
    //       dispatch(
    //         handleAddMachines({
    //           switch: selectedSystemAbr,
    //           arr: newSelectedMachineArr,
    //         })
    //       );
    //       handlesSelectedMachinesOfSelectedCommand(
    //         selectedSystemAbr,
    //         locationArr,
    //         newSelect,
    //         machineArr,
    //         newSelectedMachineArr,
    //         isAllSelected
    //       );
    //     }

    //     break;
    //   default:
    //     break;
    // }
  };

  // handles the select box of "select ATS"
  const handleSetPrevCommandSelectedAts = (selectedSysAbr, commandInfo) => {
    useESSSwitchStore().toggleAts({
        swt: selectedSysAbr,
        selections: [
          commandInfo.ats.reactivate,
          commandInfo.ats.block,
          commandInfo.ats?.activateTgs ? commandInfo.ats?.activateTgs : false,
        ],
      });

    if (commandInfo.ats.reactivate) {
      setIsSelectedForAts([true, false, false]);
    } else if (commandInfo.ats.block) {
      setIsSelectedForAts([false, true, false]);
    } else if (commandInfo.ats?.activateTgs) {
      setIsSelectedForAts([false, false, true]);
    }
  };

  const handleSetPrevCommandSelectedDeactivate = (commandInfo) => {
    useMCStore().deactivateAllPrograms(commandInfo.deactivate);

    // for styling
    // sets the circle to solid green of selected program
    setSelectPrograms(commandInfo.deactivate);

    // check if one the deactivated program was selected in the selected command. if so, set the border to green color of the deactivate button
    const copyGreenDetourArr = [...greenDetour];
    if (Object.values(commandInfo.deactivate).some((value) => value)) {
      copyGreenDetourArr[1] = true;
    }
    // check if one of the options of SELECT ATS program was selected in the selected command. if so, set the border to green color of the SELECT ATS button
    if (
      commandInfo.ats.reactivate ||
      commandInfo.ats.block ||
      commandInfo.ats?.activateTgs
    ) {
      copyGreenDetourArr[0] = true;
    } else {
      copyGreenDetourArr[0] = false;
    }
    setGreenDetour(copyGreenDetourArr);
  };

  const handleSetPrevSelectedCommandDialControl = (commandInfo) => {
    const {
      instantHeat,
      snowSensor,
      optionalConstantTemp,
      heatingSchedule,
      windFactor,
      fanOnly = null,
    } = commandInfo.parameters;
    // sets the unit measure to the previous selected command unit
    const { isF } = commandInfo;
    useUnitsStore().setUnits(isF);
    // sets the dial control style and the input temp fields
    if (instantHeat) {
      // select(1, true);
      // extract numbers out of the instantHeat
      const InstantHeatTempNumbers = instantHeat.match(/\d+/)[0];

      useESSSwitchStore().setInstantHeat({
          temp: InstantHeatTempNumbers,
          state: true,
          isF,
        });
    }
    if (snowSensor) {
      useESSSwitchStore().setSnowSensor(true);
    }
    if (optionalConstantTemp) {
      const optionalConstantTempNumbers = optionalConstantTemp.match(/\d+/)[0];
      useESSSwitchStore().setConstantTemp({ temp: optionalConstantTempNumbers, isF });
    }
    // ! this is not doable because we cannot set a previous schedule of past dates.
    if (heatingSchedule) {
      const newHeatingSchedule = heatingSchedule.split("|");
      const heatingScheduleTempNumbers = +newHeatingSchedule[0].match(/\d+/)[0];
      useESSSwitchStore().addHeatingSchedule({
          inputTemp: heatingScheduleTempNumbers,
          start: readableTime(newHeatingSchedule[1]),
          end: readableTime(newHeatingSchedule[2]),
          isF,
        });
    }
    if (windFactor) {
      useESSSwitchStore().setWindFactor(true);
    }
    if (fanOnly) {
      useTGSSwitchStore().setFanOnly(true);
    }
    setResetDialControl(false);
  };

  const handleSetPrevCommandSelectedSys = () => {
    // finds the command that's chosen
    const searchedCommand = userCommandInfo.filter(
      (userCommand) => Object.keys(userCommand)[0] === selectCommand.command
    );

    // finds the command's short name. eg: ESS, TGS, TES
    const selectedSystem =
      searchedCommand[0][selectCommand.command].system.split("-")[0];

    // dispatch to select the system of the selected command. eg: ess, tgs or tes
    useMCStore().setSelectSystem(selectedSystem);

    const commandInfo = Object.values(searchedCommand[0])[0];
    // ***set all the previous command's locations and machines
    handleSetPrevCommandSelectedMachines(selectedSystem, commandInfo);

    // ***set select ats
    handleSetPrevCommandSelectedAts(selectedSystem, commandInfo);

    // ***set deactivate
    handleSetPrevCommandSelectedDeactivate(commandInfo);

    // ** set Dial Control
    handleSetPrevSelectedCommandDialControl(commandInfo);
  };

  const handleDisplayViewCommand = () => {
    if (checkIsThereACommandSelected) {
      // to reset system to initial state.
      handleCommandResetSystem();
      // to create a new command.
      handleCreateNewCommand();
      // set previous command's system
      handleSetPrevCommandSelectedSys();

      useMCCommandStore().setSearchCommand(selectCommand);
      setOpeningSelectionBox(false);
    }
  };

  const handleSelectCommand = (el) => {
    setSelectCommand({ command: el, userId: userID });
    // ***resets all select switch location state in master control select slice
    useMasterControlSelectStore().resetAllSelect();
    useMasterControlSelectStore().resetAll();
    setResetDialControl(true);

    // finds the command that's chosen depending on the userID given by the backend
    const searchedCommand = mCCommandState.commandsInfo[userID].filter(
      (userCommand) => Object.keys(userCommand)[0] === el
    );

    // finds the command's short name. eg: ESS, TGS, TES
    const selectedSystem = searchedCommand[0][el].system.split("-")[0];

    // dispatch to unSelect all the machines of depending the system chosen. it will either change all isSelected to false of essSwitchSlice, tgsSwitchSlice or tesSwitchSlice
    let locations = [];
    switch (selectedSystem) {
      case "ess":
        locations = Object.keys(essSwitch);
        unselectAllMachinesHandler(
          locations,
          selectedSystem,
          essSwitch,
          dispatch
        );
        // Object.keys(essSwitch).map((location) =>
        //   handleSelectLocation(location, selectedSystem)
        // );
        break;
      case "tgs":
        locations = Object.keys(tgsSwitch);
        unselectAllMachinesHandler(
          locations,
          selectedSystem,
          tgsSwitch,
          dispatch
        );
        // Object.keys(tgsSwitch).map((location) =>
        //   handleSelectLocation(location, selectedSystem)
        // );
        break;
      case "tes":
        locations = Object.keys(tesSwitch);
        unselectAllMachinesHandler(
          locations,
          selectedSystem,
          tesSwitch,
          dispatch
        );
        // Object.keys(tesSwitch).map((location) =>
        //   handleSelectLocation(location, selectedSystem)
        // );
        break;
      default:
        break;
    }
  };

  return (
    <WrapperBase>
      <Wrapper>
        <ShareComponent
          selectedSwitches={selectedSwitches}
          setSelectedSwitches={setSelectedSwitches}
        />
        <CommandSelectionsApplyButton
          viewCommandTitle={title}
          buttonsTitle={"apply"}
          // handleViewCommandsList={setOpeningSelectionBox}
          handleViewCommandsList={handleOpenViewCommandBox}
          openingSelectionBox={openingSelectionBox}
          handleApplyButton={handleApplyButton}
          selectCommand={selectCommand}
          handleDisplayViewCommand={handleDisplayViewCommand}
          handleSelectCommand={handleSelectCommand}
          handleCreateNewCommandMessageBox={handleCreateNewCommandMessageBox}
          // commandConfirmed={commandConfirmed}
        />
      </Wrapper>
    </WrapperBase>
  );
}

export default MasterControlCommandMain;

const WrapperBase = styled.div`
  width: 304px;
  height: 557px;

  ${layerBDark}

  border-radius: 7px;

  ${flexBoxCenter}
`;

const Wrapper = styled.div`
  width: 302px;
  height: 557px;

  ${layerA180Deg}

  border-radius: 6px;

  ${justifyContentSpaceAround}
  flex-direction: column;
`;
