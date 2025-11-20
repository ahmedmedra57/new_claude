import { useEffect, useState } from "react";
import { useMasterControlBySwitchSelectStore, useMasterControlSelectByLocationStore } from '../zustand-stores';



import styled, { css } from "styled-components";
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerBDark,
  layerCLighter,
} from "../styles/commonStyles";

import SelectOptions from "../masterControl/controls/mainSelection/SelectOptions";
import SelectSubOptions from "../masterControl/controls/mainSelection/SelectSubOptions";
import {
  selectLocationsHandler,
  selectMachinesHandler,
  selectSpecificLocationsHandler,
  unselectAllMachinesHandler,
} from "../../hooks/useSelectSwitchesDispatches";
import { useSelectBoxArrowsState } from "../../hooks/useSelectBoxArrowsState";
import {
  getAllSpecificLocationNames,
  transformSpecificLocationData,
} from "../../helpers/helpers";
import selectBoxResetHandler from "../../helpers/ess-tgs-tes-mc/selectBoxResetHandler";
import { selectAllHandler } from "../../helpers/ess-tgs-tes-mc/select_box_logic/selectAllHandler";
import { selectAllDispatchHandler } from "../../helpers/ess-tgs-tes-mc/select_box_dispatchers/selectAllDispatchHandler";
import { selectLocationHandler } from "../../helpers/ess-tgs-tes-mc/select_box_logic/selectLocationHandler";
import { selectLocationDispatchHandler } from "../../helpers/ess-tgs-tes-mc/select_box_dispatchers/selectLocationDispatchHandler";
import { selectSpecificLocationHandler } from "../../helpers/ess-tgs-tes-mc/select_box_logic/selectSpecificLocationHandler";
import { selectSpecificLocationDispatchHandler } from "../../helpers/ess-tgs-tes-mc/select_box_dispatchers/selectSpecificLocationDispatchHandler";
import { selectMachineHandler } from "../../helpers/ess-tgs-tes-mc/select_box_logic/selectMachineHandler";
import { selectMachineDispatchHandler } from "../../helpers/ess-tgs-tes-mc/select_box_dispatchers/selectMachineDispatchHandler";
import SelectSpecificLocationOptions from "../masterControl/controls/mainSelection/SelectSpecificLocationOptions";

const SelectMachineItems = ({
  handleClose,
  data,
  dataE,
  swtName,
  name,
  scope,
  isMobile,
  specificLocation,
}) => {
  const { trackSpecLocationArrowState, trackArrowState, specificLocations } =
    useSelectBoxArrowsState(data);

  const [isSpecLocationArrowDown, setIsSpecLocationArrowDown] = useState(
    trackSpecLocationArrowState
  );
  const [isArrowDown, setIsArrowDown] = useState(trackArrowState);
  const [specificLocationsNameList, setSpecificLocationsNameList] = useState(
    []
  );
  const [isSelected, setIsSelected] = useState(false);
  
  let locations = Object.keys(data);
  // scope has location name
  let machinesArr;
  if (data && data[scope] && !data[scope].isSpecificLocation) {
    machinesArr = Object.keys(data[scope].devices);
    // locations = null
  }
  let subLocationArr;

  const locationIndex = scope !== "switch" && locations.indexOf(scope);

  const specificLocationIdx =
    specificLocation &&
    scope !== "switch" &&
    Object.keys(data[scope]).indexOf(specificLocation);

  const buttons = isMobile
    ? name === "shutOff"
      ? ["clear", "apply"]
      : ["clear", "select"]
    : ["clear", "select"];
  const mCBySwitch = scope === 'switch'
    ? useMasterControlBySwitchSelectStore()
    : useMasterControlSelectByLocationStore();
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
    name === "instantHeat"
      ? mCBySwitch.instantHeat
      : name === "snowSensor"
      ? mCBySwitch.snowSensor
      : name === "windFactor"
      ? mCBySwitch.windFactor
      : name === "optionalConstant"
      ? mCBySwitch.optionalConstant
      : name === "heatingSchedule"
      ? mCBySwitch.heatingSchedule
      : name === "ats"
      ? mCBySwitch.ats
      : name === "shutOff"
      ? mCBySwitch.shutOff
      : mCBySwitch.fanOnly;
  useEffect(() => {
    const result = getAllSpecificLocationNames(data);
    setSpecificLocationsNameList(result);
  }, [data]);
  const switchCountHandler = (machines, selectOneFC) => {
    let selectedSwtNumber = 0;
    machines.forEach((location) =>
      location.forEach((machine) => {
        if (typeof machine === "object") {
          machine.forEach((el) => {
            if (el) {
              selectedSwtNumber += 1;
            }
          });
        } else {
          if (machine) {
            selectedSwtNumber += 1;
          }
        }
      });
    dispatch(
      selectOneFC({
        controller: name,
        selectedOne: `${selectedSwtNumber} switches`,
      });
  };

  // Clear and Apply Button handler
  const handleOnClick = (button) => {
    if (button === buttons[1]) {
      // logic for count selected machine numbers
      let switchData;
      // if (scope !== "switch") {
      //   switchData = transformSpecificLocationData(data, scope);
      // } else {
      switchData = data;

      scope === "switch"
        ? switchCountHandler(isMachineSelected, handleSelectedOneBySwitch)
        : switchCountHandler(isMachineSelected, handleSelectedOneByLocation);

      // Apply button
      //spereated scenerio for switch and location

      if (isAllSelected) {
        // 1. selected All
        // dispatch

        scope === "switch"
          ? dispatch(
              handleSelectedOneBySwitch({
                controller: name,
                selectedOne: "all",
              })
            )
          : useMasterControlSelectByLocationStore().setSelectedOne({
                controller: name,
                selectedOne: "all",
              });
        if (specificLocation) {
          // 1.1 when selected all, dispatch all machines in selected specific location
          const allMachines = Object.keys(
            switchData[scope][specificLocation]
          ).map((machineName) => [scope, specificLocation, machineName]);

          selectMachinesHandler(allMachines, swtName, switchData, dispatch);
        }
        //    else if (scope && scope !== "switch") {
        // console.log(switchData,specificLocation,"handleOnClickXXX")

        //     // 1.2 when selected all, dispatch all specific locations in  selected location
        //     const allSpecificLocation = Object.keys(switchData[scope]);
        //     selectSpecificLocationsHandler(
        //       allSpecificLocation,
        //       swtName,
        //       switchData,
        //       dispatch
        //     );
        //   } else {
        // #1.3 select locations

        selectLocationsHandler(locations, swtName, switchData, dispatch);
        // }
      } else if (isLocationSelected.indexOf(true) !== -1) {
        // 2.1 update isLocationSelected
        selectLocationsHandler(
          selectedLocations,
          swtName,
          switchData,
          dispatch
        );

        // #2.2.update isSpecificLocationSelected
        if (selectedSpecificLocations.length > 0) {
          selectSpecificLocationsHandler(
            selectedSpecificLocations,
            swtName,
            switchData,
            dispatch
          );
        }

        if (selectedMachines.length > 0) {
          // 2.3. update isMachineSelected
          selectMachinesHandler(
            selectedMachines,
            swtName,
            switchData,
            dispatch
          );
        }
      } else if (isSpecificLocationSelected.length > 0) {
        // #3. update isSpecificLocationSelected
        selectSpecificLocationsHandler(
          selectedSpecificLocations,
          swtName,
          switchData,
          dispatch
        );

        // #3.1. update isMachineSelected
        if (selectedMachines.length > 0) {
          selectMachinesHandler(
            selectedMachines,
            swtName,
            switchData,
            dispatch
          );
        }
      } else if (selectedMachines.length > 0) {
        // #4.only selected individual machines
        selectMachinesHandler(selectedMachines, swtName, switchData, dispatch);
      } else if (!isSelected) {
        scope === "switch"
          ? dispatch(
              handleSelectedOneBySwitch({ controller: name, selectedOne: null })
            )
          : useMasterControlSelectByLocationStore().setSelectedOne({
                controller: name,
                selectedOne: null,
              });
      }

      handleClose();
    } else {
      let switchData;
      // if (scope !== "switch") {
      //   switchData = transformSpecificLocationData(data, scope);
      // } else {
      switchData = data;

      const { locationList, specificLocationList, machineList } =
        selectBoxResetHandler(switchData);
      // const specificLocationArr = [];
      // const machineArr = Object.values(data).map((location) =>
      //   Object.values(location).map((value) => {
      //     if (value.machineType) {
      //       return false;
      //     } else {
      //       const machinesList = Object.values(location).flatMap(
      //         (specLocation) => Object.keys(specLocation).map((el) => false)
      //       );
      //       const specLocation = Object.keys(location).map((el) => false);
      //       specificLocationArr.push(specLocation);
      //       return machinesList;
      //     }
      //   })
      // );

      // const filteredSpecificLocationArr = specificLocationArr.filter(
      //   (subArray) => subArray.length > 0
      // );

      // const locationArr = locations.map((location) => false);

      const resetObj = { controller: name, arr: [] };
      const locationResetObj = { controller: name, arr: locationList };
      const specificLocationResetObj = {
        arr: specificLocationList,
        controller: name,
      };
      const machineResetObj = { controller: name, arr: machineList };
      // Clear button
      if (scope === "switch") {
        // 1.reset all and title (selected one)
        useMasterControlBySwitchSelectStore().selectAll({ controller: name, status: false });
        useMasterControlBySwitchSelectStore().setSelectedOne({ controller: name, selectedOne: null });

        // 2. Empty selected location names
        useMasterControlBySwitchSelectStore().addLocations(resetObj);
        // 2.1. Empty selected specific location names and machine names
        useMasterControlBySwitchSelectStore().addSpecificLocations(resetObj);
        // 2.2. Empty selected  machine names
        useMasterControlBySwitchSelectStore().addMachines(resetObj);

        // 3. reset isLocationSelected to an array of false
        useMasterControlBySwitchSelectStore().selectLocation(locationResetObj);
        // 3.1. reset isSpecificLocationSelected to an array of false
        if (specificLocationList.length > 0) {
          dispatch(
            handleSpecificLocationSelectBySwitch(specificLocationResetObj);
        }
        // 3.2. reset isMachineSelected to an array of false
        useMasterControlBySwitchSelectStore().selectMachine(machineResetObj);
      } else {
        // 1.reset all and title (selected one)
        useMasterControlSelectByLocationStore().selectAll({ controller: name, status: false });
        useMasterControlSelectByLocationStore().setSelectedOne({ controller: name, selectedOne: null });

        // 2. Empty selected location names
        useMasterControlSelectByLocationStore().addLocations(resetObj);
        // 2.2. Empty selected  specific location names
        useMasterControlSelectByLocationStore().addSpecificLocations(resetObj);
        // 2.2. Empty selected  machine names
        useMasterControlSelectByLocationStore().addMachines(resetObj);

        // 3. reset isLocationSelected to an array of false
        useMasterControlSelectByLocationStore().selectLocation(locationResetObj);

        // 3.1. reset isSpecificLocationSelected to an array of false
        if (specificLocationList.length > 0) {
          dispatch(
            handleSpecificLocationSelectByLocation(specificLocationResetObj);
        }

        // 3.2. reset isMachineSelected to an array of false
        useMasterControlSelectByLocationStore().selectMachine(machineResetObj);
      }
      // unSelect all machines of ESS,TGS or TES slice
      unselectAllMachinesHandler(locations, swtName, data, dispatch);
    }
  };

  // Select handler for the indicator
  const handleSelect = (option, machine, extraOption, machineIndex) => {
    setIsSelected(true);
    let switchData;
    // if (scope !== "switch") {
    //   switchData = transformSpecificLocationData(data, scope);
    // } else {
    switchData = data;
    // }

    if (option === "all") {
      // select all Logic
      const { locationList, specificLocationList, machineList } =
        selectAllHandler(
          switchData,
          name,
          isLocationSelected,
          isSpecificLocationSelected
        );
      

      selectAllDispatchHandler(
        dispatch,
        scope,
        name,
        locationList,
        specificLocationList,
        machineList
      );
    } else if (option !== "all" && machine === undefined) {
      // ======= select location logic =====
      // selectLocationHandler(option);
      const {
        locationList,
        specificLocationList,
        machineList,
        newSelectedLocations,
      } = selectLocationHandler(
        switchData,
        option,
        locations,
        isLocationSelected,
        isMachineSelected,
        selectedLocations
      );
      selectLocationDispatchHandler(
        dispatch,
        scope,
        name,
        locationList,
        specificLocationList,
        machineList,
        newSelectedLocations
      );
    }
    //Handle SubLocation
    else if (option !== "all" && machine === "isSpecificLocation") {
      // ======= select specific location logic =====
      const { specificLocationList, machineList, newSpecificLocations } =
        selectSpecificLocationHandler(
          option,
          machineIndex,
          extraOption,
          locations,
          isSpecificLocationSelected,
          isMachineSelected,
          specificLocations,
          selectedSpecificLocations
        );
      selectSpecificLocationDispatchHandler(
        dispatch,
        scope,
        name,
        specificLocationList,
        machineList,
        newSpecificLocations
      );
    } else {
      // ======= select machine logic =====
      const { locationIdx, specLocationIdx, machineIdx, newSelectedMachine } =
        selectMachineHandler(
          option,
          machine,
          extraOption,
          switchData,
          selectedMachines
        );
      selectMachineDispatchHandler(
        dispatch,
        scope,
        name,
        extraOption,
        locationIdx,
        specLocationIdx,
        machineIdx,
        newSelectedMachine
      );
    }
  };

  return (
    <>
      {isMobile ? (
        <Wrapper isMobile={isMobile} isSmall={scope !== "switch"}>
          <SectionOptions isMobile={isMobile} isSmall={scope !== "switch"}>
            <SelectOptions
              isSmall={scope !== "switch"}
              isMobile={isMobile}
              option="all"
              handleSelect={handleSelect}
              isSelected={isAllSelected}
            />

            {/* {scope === 'switch' &&
              locations.map((location, index) => (
                <SelectOptions
                  scope={scope}
                  isMobile={isMobile}
                  key={index}
                  option={location}
                  data={data[location]}
                  handleSelect={handleSelect}
                  isSelected={isLocationSelected[index]}
                  isMachineSelected={
                    isMachineSelected[index] && isMachineSelected[index]
                  }
                />
              ))} */}

            {scope !== "switch" &&
              locations.map((location, index) => {
                return (
                  <SelectOptions
                    isMobile={isMobile}
                    key={index}
                    index={index}
                    option={location}
                    data={data[location]}
                    newData={data}
                    handleSelect={handleSelect}
                    isSelected={isLocationSelected[index]}
                    isMachineSelected={
                      isMachineSelected[index] && isMachineSelected[index]
                    }
                    isArrowDown={isArrowDown}
                    setIsArrowDown={setIsArrowDown}
                    allSpecificLocationsName={specificLocationsNameList}
                    isSpecificLocationSelected={isSpecificLocationSelected}
                    isSpecLocationArrowDown={isSpecLocationArrowDown}
                    setIsSpecLocationArrowDown={setIsSpecLocationArrowDown}
                  />
                );
              })}

            {/* individual machine scope option
            {scope !== 'switch' &&
              machinesArr.map((machine, index) => (
                <SelectSubOptions
                  isMobile={isMobile}
                  key={Math.random() * 10000}
                  location={scope}
                  machine={machine}
                  handleSelect={handleSelect}
                  isSelected={isMachineSelected[locationIndex][index]}
                  scope={scope}
                />
              ))} */}

            {/*specific location and individual machine scope option */}
            {/* {scope !== "switch" &&
              subLocationArr.map((machine, index) => {
                return (
                  <SelectSubOptions
                    isMobile={isMobile}
                    key={Math.random() * 10000}
                    location={scope}
                    machine={specificLocation ? machine : "isSpecificLocation"}
                    handleSelect={handleSelect}
                    isSelected={
                      !specificLocation &&
                      isSpecificLocationSelected[locationIndex]
                        ? isSpecificLocationSelected[locationIndex][index]
                        : isMachineSelected.length > 0
                        ? isMachineSelected[locationIndex][specificLocationIdx][
                            index
                          ]
                        : false
                    }
                    scope={scope}
                    specificLocation={
                      specificLocation ? specificLocation : machine
                    }
                    // specLocationName={machine}
                    specificLocationIdx={index}
                  />
                );
              })} */}
          </SectionOptions>

          <SectionButtons isMobile={isMobile} isSmall={scope !== "switch"}>
            {buttons.map((button, index) => (
              <ButtonWrapper
                key={index}
                onClick={() => handleOnClick(button)}
                isMobile={isMobile}
                isSmall={scope !== "switch"}
              >
                <ButtonHole isMobile={isMobile} isSmall={scope !== "switch"}>
                  <ButtonInner isMobile={isMobile} isSmall={scope !== "switch"}>
                    <ButtonTop isMobile={isMobile} isSmall={scope !== "switch"}>
                      {button}
                    </ButtonTop>
                  </ButtonInner>
                </ButtonHole>
              </ButtonWrapper>
            ))}
          </SectionButtons>
        </Wrapper>
      ) : (
        <Wrapper isMobile={isMobile} isSmall={scope !== "switch"}>
          <ScrollWrapper>
            <SectionOptions isMobile={isMobile} isSmall={scope !== "switch"}>
              <SelectOptions
                isSmall={scope !== "switch"}
                isMobile={isMobile}
                option="all"
                handleSelect={handleSelect}
                isSelected={isAllSelected}
              />

              {locations &&
                !machinesArr &&
                locations.map((location, index) => {
                  return (
                    <SelectOptions
                      isMobile={isMobile}
                      key={index}
                      index={index}
                      option={location}
                      data={data[location]}
                      newData={data}
                      handleSelect={handleSelect}
                      isSelected={isLocationSelected[index]}
                      isMachineSelected={
                        isMachineSelected[index] && isMachineSelected[index]
                      }
                      isArrowDown={isArrowDown}
                      setIsArrowDown={setIsArrowDown}
                      allSpecificLocationsName={specificLocationsNameList}
                      isSpecificLocationSelected={isSpecificLocationSelected}
                      isSpecLocationArrowDown={isSpecLocationArrowDown}
                      setIsSpecLocationArrowDown={setIsSpecLocationArrowDown}
                    />
                  );
                })}

              {/*specific location and individual machine scope option */}
              {}
              {/* {scope !== "switch" && data[scope]?.isSpecificLocation
                ? subLocationArr?.map((subLocation, idx) => {
                    let specificLocationIdx;
                      specificLocationsNameList?.forEach((name, idx) => {
                        if (name.includes(subLocation[0])) {
                          specificLocationIdx = idx;
                        }
                      });
                    return (
                      <SelectSpecificLocationOptions
                        key={Math.random() * 10000}
                        location={scope}
                        idx={idx}
                        specLocationName={subLocation[0]}
                        machineData={subLocation[1]?.devices}
                        handleSelect={handleSelect}
                        isSelected={
                          isSpecificLocationSelected &&
                          isSpecificLocationSelected[specificLocationIdx] &&
                          isSpecificLocationSelected[specificLocationIdx][idx]
                        }
                        isMachineSelected={
                          isMachineSelected.length > 0 && isMachineSelected[idx]
                        }
                        isSpecificLocation={true}
                        isSpecificLocationSelected={isSpecificLocationSelected}
                        isSpecLocationArrowDown={isSpecLocationArrowDown}
                        setIsSpecLocationArrowDown={setIsSpecLocationArrowDown}
                        isMobile={isMobile}
                        // scope={scope}
                        //
                      />
                    );
                  })
                : machinesArr &&
                  machinesArr?.map((machine, index) => {
                    return (
                      <SelectSubOptions
                        isMobile={isMobile}
                        key={Math.random() * 10000}
                        location={scope}
                        machine={machine}
                        handleSelect={handleSelect}
                        isSelected={
                          isMachineSelected &&
                          isMachineSelected[0] &&
                          isMachineSelected[0][index]
                        }
                        scope={scope}
                      />
                    );
                  })} */}
              {machinesArr &&
                machinesArr?.map((machine, index) => {
                  return (
                    <SelectSubOptions
                      isMobile={isMobile}
                      key={Math.random() * 10000}
                      location={scope}
                      machine={machine}
                      handleSelect={handleSelect}
                      isSelected={
                        isMachineSelected &&
                        isMachineSelected[0] &&
                        isMachineSelected[0][index]
                      }
                      scope={scope}
                    />
                  );
                })}
            </SectionOptions>
          </ScrollWrapper>

          <SectionButtons isMobile={isMobile} isSmall={scope !== "switch"}>
            {buttons.map((button, index) => (
              <ButtonWrapper
                key={index}
                onClick={() => handleOnClick(button)}
                isMobile={isMobile}
                isSmall={scope !== "switch"}
              >
                <ButtonHole isMobile={isMobile} isSmall={scope !== "switch"}>
                  <ButtonInner isMobile={isMobile} isSmall={scope !== "switch"}>
                    <ButtonTop isMobile={isMobile} isSmall={scope !== "switch"}>
                      {button}
                    </ButtonTop>
                  </ButtonInner>
                </ButtonHole>
              </ButtonWrapper>
            ))}
          </SectionButtons>
        </Wrapper>
      )}
    </>
  );
};

export default SelectMachineItems;

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  margin-top: 5rem;

  ${flexDirectionColumn}

  ${(p) =>
    p.isMobile &&
    css`
      height: auto;
    `};
`;

const ScrollWrapper = styled.div`
  height: 100px;
  width: 100%;
  border-radius: 14px 8px 8px 14px;
  ${layerBDark};
  box-shadow: inset 0px 0px 6px #000000;
  padding: 2px;
  margin-bottom: 4rem;
`;
const SectionOptions = styled.div`
  height: 96px;
  width: 100%;

  scroll-behavior: smooth;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    width: 10px;
    border: 1px solid #ffffff;
    border-radius: 13px;
  }
  ::-webkit-scrollbar-track {
  }

  ::-webkit-scrollbar-thumb {
    background-color: #ffffff;
    border-radius: 13px;
    border: 1.5px solid transparent;
    background-clip: padding-box;
    height: 40%;
  }

  ::-webkit-scrollbar-button:start:decrement {
    background-repeat: no-repeat;
    background-size: 70%;
    background-position: center;
    height: 10px;

    background-image: url("/images/scrollbar-button-start.svg");
  }
  ::-webkit-scrollbar-button:end:increment {
    background-repeat: no-repeat;
    background-size: 70%;
    background-position: center;
    height: 10px;

    background-image: url("/images/scrollbar-button-end.svg");
  }

  ${(p) =>
    p.isMobile &&
    css`
      ::-webkit-scrollbar {
        display: none;
      }
      height: auto;
      max-height: 223px;
      width: ${(p) => (p.isSmall ? "287px" : `298px`)};
      border-radius: 18px;
      ${layerA}
      ${flexDirectionColumn};
      padding: 4px 0;
      margin-bottom: 4px;
    `}
`;

const SectionButtons = styled.div`
  width: 100%;
  ${justifyContentSpaceBetween}
  ${(p) =>
    p.isMobile &&
    css`
      ${(p) =>
        p.isSmall
          ? css`
              width: 287px;
            `
          : css`
              width: 298px;
            `}
    `}
`;

const ButtonWrapper = styled.button`
  width: 84px;
  height: 27px;
  border-radius: 18px;

  ${layerBDark}
  ${flexBoxCenter}
  ${(p) =>
    p.isMobile &&
    css`
      border-radius: 27px;
      ${(p) =>
        p.isSmall
          ? css`
              width: 130px;
              height: 54px;
            `
          : css`
              width: 147px;
              height: 54px;
            `}
    `}
`;
const ButtonHole = styled.div`
  width: 82px;
  height: 25px;
  border-radius: 25px;
  ${layerA180Deg}
  ${flexBoxCenter}
  ${(p) =>
    p.isMobile &&
    css`
      border-radius: 26px;
      ${(p) =>
        p.isSmall
          ? css`
              width: 128px;
              height: 52px;
            `
          : css`
              width: 145px;
              height: 52px;
            `}
    `}
`;
const ButtonInner = styled.div`
  width: 74px;
  height: 17px;
  border-radius: 18px;
  ${layerCLighter}
  ${flexBoxCenter}
  ${(p) =>
    p.isMobile &&
    css`
      border-radius: 23px;
      ${(p) =>
        p.isSmall
          ? css`
              width: 118px;
              height: 42px;
            `
          : css`
              width: 135px;
              height: 42px;
            `}
    `}
`;
const ButtonTop = styled.div`
  width: 72px;
  height: 15px;
  border-radius: 25px;
  font-size: 10px;

  ${layerA180Deg}
  ${flexBoxCenter}
  ${(p) =>
    p.isMobile &&
    css`
      border-radius: 25px;
      font-size: 14px;
      letter-spacing: 1.4px;
      ${(p) =>
        p.isSmall
          ? css`
              width: 116px;
              height: 40px;
            `
          : css`
              width: 133px;
              height: 40px;
            `}
    `}
`;
