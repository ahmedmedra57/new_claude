import { useState } from 'react';
import styled, { css } from 'styled-components';
import {
import { useForceCommandAndAdminSelectStore } from '../../zustand-stores';
  flexBoxCenter,
  justifyContentFlexEnd,
  justifyContentFlexStart,
  justifyContentSpaceBetween,
  layerA,
  layerBDark,
  scrollbarY,
} from '../../styles/commonStyles';
import SelectIndividualOptions from '../../telemetry/theSelections/SelectIndividualOptions';
import ClearApplyButton from './selectArts/ClearApplyButton';
import { useMediaQuery } from 'react-responsive';
import { useSelectBoxArrowsState } from '../../../hooks/useSelectBoxArrowsState';
import { mainSelectIndicatorHandler } from '../../../helpers/setting/select_box_indicator';
import { buttonsHandler } from '../../../helpers/setting/select_box_buttons_dispatchers';
import { useGetSpecificLocationList } from '../../../hooks';

const SelectFCSwitchMachineOptions = ({
  handleClose,
  data,
  sysIndex,
  swtName,
}) => {
  // media query
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  const locations = Object.keys(data);
  const buttons = ['clear', 'select'];

  // const trackArrowState = locations.map((el) => false);
  // const [isArrowDown, setIsArrowDown] = useState(trackArrowState);
  const FCAndAdminSelectState = useForceCommandAndAdminSelectStore();
  const swt = sysIndex === 0 ? 'ess' : sysIndex === 1 ? 'tgs' : 'tes';

  const {
    // for styling
    isAllSelected,
    isLocationSelected,
    isSpecificLocationSelected,
    isMachineSelected,
    // for dispatch
    selectedLocations,
    selectedSpecificLocations,
    selectedMachines,
  } =
    sysIndex === 0
      ? FCAndAdminSelectState.ess
      : sysIndex === 1
      ? FCAndAdminSelectState.tgs
      : sysIndex === 2
      ? FCAndAdminSelectState.tes
      : '';
  const [isSelected, setIsSelected] = useState(false);
  // const [specificLocationsNameList, setSpecificLocationsNameList] = useState(
  //   []
  // );

  const { trackArrowState, trackSpecLocationArrowState, specificLocations } =
    useSelectBoxArrowsState(data);

  const [isArrowDown, setIsArrowDown] = useState(trackArrowState);
  const [isSpecLocationArrowDown, setIsSpecLocationArrowDown] = useState(
    trackSpecLocationArrowState
  );
  
  // useEffect(() => {
  //   const specificLocationArr = Object.keys(data).map((location) =>
  //     Object.entries(data[location]).flatMap(([key, el]) => {
  //       if (el.deviceMac) {
  //         return null;
  //       } else {
  //         return key;
  //       }
  //     })
  //   );
  //   setSpecificLocationsNameList(specificLocationArr);
  // }, [data]);

  const specificLocationsNameList = useGetSpecificLocationList(data);

  // Clear and Apply Button handler
  const handleOnClick = (...props) => {
    const propsObj = {
      button: props[1],
      isAllSelected,
      isLocationSelected,
      isSpecificLocationSelected,
      isMachineSelected,
      selectedLocations,
      selectedSpecificLocations,
      selectedMachines,
      swtName,
      dispatch,
      data,
      locations,
      handleClose,
      isSelected,
      program: 'forceAndCommand',
    };

    buttonsHandler(propsObj);
  };

  //!! Clear and Apply Button handler
  // const handleOnClick = (_, button) => {
  //   if (button === 1) {
  //     if (isAllSelected) {
  //       // 1. selected All
  //       // dispatch
  //       dispatch(
  //         handleSettingsSelectedOne({ switch: swt, selectedOne: 'all' })
  //       );
  //       locations.map((location) => handleSelectLocation(location, true);
  //     } else if (isLocationSelected.indexOf(true) !== -1) {
  //       // 2. selected locations
  //       selectedLocations.map((location) =>
  //         handleSelectLocation(location, true)
  //       );

  //       let selectedSwtNumber = 0;
  //       isMachineSelected.forEach((location) =>
  //         location.forEach((machine) => {
  //           if (machine) {
  //             selectedSwtNumber += 1;
  //           }
  //         })
  //       );
  //       dispatch(
  //         handleSettingsSelectedOne({
  //           switch: swt,
  //           selectedOne: `${selectedSwtNumber} switches`,
  //         })
  //       );
  //     } else if (selectedMachines.length > 0) {
  //       // 3. selected individual machines

  //       let selectedSwtNumber = 0;
  //       isMachineSelected.forEach((location) =>
  //         location.forEach((machine) => {
  //           if (machine) {
  //             selectedSwtNumber += 1;
  //           }
  //         })
  //       );
  //       dispatch(
  //         handleSettingsSelectedOne({
  //           switch: swt,
  //           selectedOne: `${selectedSwtNumber} switches`,
  //         })
  //       );

  //       if (swt === 'ess') {
  //         selectedMachines.forEach((machine) =>
  //           dispatch(
  //             handleFCSelectIndividualMachine({
  //               swt,
  //               location: machine[0],
  //               machine: machine[1],
  //             })
  //           )
  //         );
  //       } else if (swt === 'tes') {
  //         selectedMachines.forEach((machine) =>
  //           dispatch(
  //             handleFCSelectIndividualMachine({
  //               swt,
  //               location: machine[0],
  //               machine: machine[1],
  //             })
  //           )
  //         );
  //       } else if (swt === 'tgs') {
  //         selectedMachines.forEach((machine) =>
  //           dispatch(
  //             handleFCSelectIndividualMachine({
  //               swt,
  //               location: machine[0],
  //               machine: machine[1],
  //             })
  //           )
  //         );
  //       }
  //     } else if (!isSelected) {
  //       dispatch(handleSettingsSelectedOne({ switch: swt, selectedOne: null });
  //     }
  //     handleClose();
  //   } else {
  //     // reset all selections
  //     // 1.reset all local states
  //     dispatch(handleSettingsSelectAll({ switch: swt, status: false });
  //     dispatch(handleSettingsSelectedOne({ switch: swt, selectedOne: null });

  //     // reset state for dispatch
  //     dispatch(handleSettingsAddLocations({ switch: swt, arr: [] });
  //     dispatch(handleSettingsAddMachines({ switch: swt, arr: [] });

  //     // 2. reset location
  //     const arr = locations.map((location) => false);
  //     dispatch(handleSettingsLocationSelect({ switch: swt, arr });

  //     // reset selected machines
  //     const individualArr = Object.values(data).map((location) =>
  //       Object.keys(location).map((machine) => false)
  //     );
  //     dispatch(
  //       handleSettingsMachineSelect({ switch: swt, arr: individualArr })
  //     );

  //     // dispatch
  //     locations.map((location) => handleSelectLocation(location);
  //   }
  // };

  // !!END

  // const handleSelectLocation = (option, select) => {
  //   const machines = Object.keys(data[option]);

  //   if (swt === 'ess') {
  //     if (select) {
  //       machines.map((machine) =>
  //         dispatch(
  //           handleFCSelectIndividualMachine({ swt, location: option, machine })
  //         )
  //       );
  //     } else {
  //       machines.map((machine) =>
  //         dispatch(
  //           handleFCUnSelectIndividualMachine({
  //             swt,
  //             location: option,
  //             machine,
  //           })
  //         )
  //       );
  //     }
  //   } else if (swt === 'tes') {
  //     if (select) {
  //       machines.map((machine) =>
  //         dispatch(
  //           handleFCSelectIndividualMachine({ swt, location: option, machine })
  //         )
  //       );
  //     } else {
  //       machines.map((machine) =>
  //         dispatch(
  //           handleFCUnSelectIndividualMachine({
  //             swt,
  //             location: option,
  //             machine,
  //           })
  //         )
  //       );
  //     }
  //   } else if (swt === 'tgs') {
  //     if (select) {
  //       machines.map((machine) =>
  //         dispatch(
  //           handleFCSelectIndividualMachine({ swt, location: option, machine })
  //         )
  //       );
  //     } else {
  //       machines.map((machine) =>
  //         dispatch(
  //           handleFCUnSelectIndividualMachine({
  //             swt,
  //             location: option,
  //             machine,
  //           })
  //         )
  //       );
  //     }
  //   }
  // };

  // const changeObjKeysHandler = (myObject) => {
  //   // Create a new object to store the updated keys
  //   const updatedObject = {};

  //   const keyMap = {
  //     controller: 'switch',
  //     arr: 'arr',
  //   };
  //   // Iterate over the keys and update them
  //   for (const key in myObject) {
  //     if (key in keyMap) {
  //       updatedObject[keyMap[key]] = myObject[key];
  //     } else {
  //       updatedObject[key] = myObject[key];
  //     }
  //   }

  //   return updatedObject;
  // };

  const handleSelect = (option, machine, extraOption, machineIndex) => {
    setIsSelected(true);
    const propObj = {
      dispatch,
      data,
      locations,
      swtName,
      specificLocations,
      isLocationSelected,
      isSpecificLocationSelected,
      isMachineSelected,
      selectedLocations,
      selectedSpecificLocations,
      selectedMachines,
      option,
      machine,
      extraOption,
      machineIndex,
    };
    mainSelectIndicatorHandler(propObj);
  };

  // Select handler for the indicator
  // const handleSelect = (option, machine, extraOption, machineIndex) => {
  //   setIsSelected(true);

  //   if (option === 'all') {
  //     // select all Logic
  //     const { locationList, specificLocationList, machineList } =
  //       selectAllHandler(
  //         data,
  //         swtName,
  //         isLocationSelected,
  //         isSpecificLocationSelected
  //       );

  //     const modifiedList = [
  //       locationList,
  //       specificLocationList,
  //       machineList,
  //     ].map((list) => changeObjKeysHandler(list);

  //     selectAllIndicatorDispatcherHandler(
  //       dispatch,
  //       swtName,
  //       { newLocationList: modifiedList[0] },
  //       { newSpecificLocationList: modifiedList[1] },
  //       { newMachineList: modifiedList[2] }
  //     );
  //   } else if (option !== 'all' && machine === 'isLocation') {
  //     // ======= select location logic =====
  //     const {
  //       locationList,
  //       specificLocationList,
  //       machineList,
  //       newSelectedLocations,
  //     } = selectLocationHandler(
  //       data,
  //       option,
  //       locations,
  //       isLocationSelected,
  //       isMachineSelected,
  //       selectedLocations
  //     );

  //     selectLocationIndicatorDispatcherHandler(
  //       dispatch,
  //       swtName,
  //       locationList,
  //       specificLocationList,
  //       machineList,
  //       newSelectedLocations
  //     );
  //   } else if (option !== 'all' && machine === 'isSpecificLocation') {
  //     // ======= select specific location logic =====
  //     const { specificLocationList, machineList, newSpecificLocations } =
  //       selectSpecificLocationHandler(
  //         option,
  //         machineIndex,
  //         extraOption,
  //         locations,
  //         isSpecificLocationSelected,
  //         isMachineSelected,
  //         specificLocations,
  //         selectedSpecificLocations
  //       );

  //     selectSpecificLocationIndicatorDispatcherHandler(
  //       dispatch,
  //       swtName,
  //       specificLocationList,
  //       machineList,
  //       newSpecificLocations
  //     );
  //   } else {
  //     // ======= select machine logic =====
  //     const { locationIdx, specLocationIdx, machineIdx, newSelectedMachine } =
  //       selectMachineHandler(
  //         option,
  //         machine,
  //         extraOption,
  //         data,
  //         selectedMachines
  //       );

  //     selectMachineIndicatorDispatcherHandler(
  //       dispatch,
  //       swtName,
  //       locationIdx,
  //       specLocationIdx,
  //       machineIdx,
  //       newSelectedMachine
  //     );
  //   }
  // };

  // // Select handler for the indicator
  // const handleSelect = (option, machine) => {
  //   setIsSelected(true);

  //   if (option === 'all') {
  //     // 1. select all
  //     dispatch(handleSettingsSelectAll({ switch: swt, status: true });

  //     // update all locations
  //     const locationArr = isLocationSelected.map((location) => true);

  //     dispatch(handleSettingsLocationSelect({ switch: swt, arr: locationArr });

  //     // update all machines global and local
  //     const individualArr = Object.values(data).map((location) =>
  //       Object.keys(location).map((machine) => true)
  //     );
  //     dispatch(
  //       handleSettingsMachineSelect({ switch: swt, arr: individualArr })
  //     );
  //   } else if (option !== 'all' && machine === undefined) {
  //     // 2. select location
  //     // 2-1 find index and make it true
  //     // update the location
  //     const index = locations.indexOf(option);
  //     const arr = [...isLocationSelected];
  //     arr[index] = true;
  //     dispatch(handleSettingsLocationSelect({ switch: swt, arr });

  //     // update machines in the location
  //     const machineNewArr = isMachineSelected[index]?.map((machine) => true);
  //     const copyArr = [...isMachineSelected];
  //     copyArr[index] = machineNewArr;
  //     dispatch(handleSettingsMachineSelect({ switch: swt, arr: copyArr });

  //     // for dispatch selected locations
  //     const newSelect = [...selectedLocations];
  //     newSelect.push(option);
  //     dispatch(handleSettingsAddLocations({ switch: swt, arr: newSelect });
  //   } else {
  //     // 3. select individually
  //     const locationIdx = Object.keys(data).indexOf(option);
  //     const machineIdx = Object.keys(data[option]).indexOf(machine);

  //     dispatch(
  //       handleSettingsMachineSelectAlt({ switch: swt, locationIdx, machineIdx })
  //     );

  //     // for dispatch selected machines
  //     const newSelectedMachineArr = [...selectedMachines];
  //     newSelectedMachineArr.push([option, machine]);
  //     dispatch(
  //       handleSettingsAddMachines({ switch: swt, arr: newSelectedMachineArr })
  //     );
  //   }
  // };

  return (
    <>
      {isMobile
        ? swt && (
            <Wrapper>
              <SectionOptions isMobile={true}>
                <SelectIndividualOptions
                  option='all'
                  handleSelect={handleSelect}
                  isSelected={isAllSelected}
                  isFirst={true}
                />

                {locations.map((location, index) => (
                  <SelectIndividualOptions
                    key={index}
                    index={index}
                    option={location}
                    data={data[location]}
                    handleSelect={handleSelect}
                    isSelected={isLocationSelected[index]}
                    isMachineSelected={
                      isMachineSelected[index] && isMachineSelected[index]
                    }
                    isSpecificLocationSelected={
                      isSpecificLocationSelected &&
                      isSpecificLocationSelected[index]
                    }
                    isSpecLocationArrowDown={isSpecLocationArrowDown}
                    setIsSpecLocationArrowDown={setIsSpecLocationArrowDown}
                    isArrowDown={isArrowDown}
                    setIsArrowDown={setIsArrowDown}
                    allSpecificLocationsName={specificLocationsNameList}
                    // isMobile={true}
                  />
                ))}
              </SectionOptions>
              <SectionButtons isMobile={true}>
                {buttons.map((button, index) => (
                  <div key={index}>
                    <ClearApplyButton
                      name={button}
                      handleClick={handleOnClick}
                      index={index}
                      isMobile={true}
                    />
                  </div>
                ))}
              </SectionButtons>
            </Wrapper>
          )
        : swt && (
            <Wrapper>
              <ScrollBarWrapper>
                <SectionOptions>
                  <SelectIndividualOptions
                    option='all'
                    handleSelect={handleSelect}
                    isSelected={isAllSelected}
                  />

                  {locations.map((location, index) => (
                    <SelectIndividualOptions
                      key={index}
                      index={index}
                      option={location}
                      data={data[location]}
                      handleSelect={handleSelect}
                      isSelected={isLocationSelected[index]}
                      isMachineSelected={
                        isMachineSelected[index] && isMachineSelected[index]
                      }
                      isSpecificLocationSelected={
                        isSpecificLocationSelected 
                      }
                      isSpecLocationArrowDown={isSpecLocationArrowDown}
                      setIsSpecLocationArrowDown={setIsSpecLocationArrowDown}
                      isArrowDown={isArrowDown}
                      setIsArrowDown={setIsArrowDown}
                      allSpecificLocationsName={
                        specificLocationsNameList
                      }
                    />
                  ))}
                </SectionOptions>
              </ScrollBarWrapper>
              <SectionButtons>
                {buttons.map((button, index) => (
                  <div key={index}>
                    <ClearApplyButton
                      name={button}
                      handleClick={handleOnClick}
                      index={index}
                    />
                  </div>
                ))}
              </SectionButtons>
            </Wrapper>
          )}
    </>
  );
};

export default SelectFCSwitchMachineOptions;

// const Wrapper = styled.div`
//   width: 100%;
//   height: 100%;
//   ${justifyContentSpaceBetween}
//   flex-direction: column;
// `;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  ${justifyContentSpaceBetween}
  flex-direction: column;
`;

const ScrollBarWrapper = styled.div`
  width: 252px;
  min-height: 120px;
  max-height: 186px;
  padding: 4px;
  margin-bottom: 4px;
  border-radius: 14px 8px 8px 14px;
  ${layerA}
  ${justifyContentFlexStart}
`;

const SectionOptions = styled.div`
  ${scrollbarY}
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 273px;
          max-height: 184px;
          margin-top: 4px;
          ${layerA}
          border-radius: 18px;
          ::-webkit-scrollbar {
            display: none;
          }
          ${justifyContentFlexStart}
        `
      : css`
          min-height: 112px;
          max-height: 178px;
          width: 100%;
          display: flex;
          justify-items: flex-start;
          align-items: flex-start;
          /* padding: 2px; */
          /* width: 252px; */
          /* max-height: 184px; */
        `}

  flex-direction: column;
`;

const SectionButtons = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 98%;
          gap: 12px;
          margin-top: 10px;
          margin-bottom: 8px;
          ${flexBoxCenter}
        `
      : css`
          width: 100%;
          margin-bottom: 2px;
          ${justifyContentFlexEnd};
          gap: 8px;
        `}

  height: auto;
`;
