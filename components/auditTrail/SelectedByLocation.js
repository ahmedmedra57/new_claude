import { useEffect, useMemo, useState } from "react";
import { useESSSwitchStore, useLocationsStore, useTESSwitchStore, useTGSSwitchStore } from '../zustand-stores';
import { useTranslation } from 'react-i18next';
import styled, { css } from "styled-components";
import {
  flexBoxCenter,
  flexDirectionColumn,
  justifyContentFlexStart,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerBDark,
  layerCLighter,
} from "../styles/commonStyles";
import DisplayMachine from "./DisplayMachine";
import DisplaySpecificLocation from "./DisplaySpecificLocation";
import { all } from "axios";
import testData from "../../test_data/testData";

const SelectByLocation = ({
  locationKeys,
  specificLocationsWithLocationsKeys,
  machinesSpecLocationsLocationsKeys,
  handle2ndSelect,
  isAllSelected,
  setIsAllSelected,
  // selectLocationInitialState,
  // selectSpecificLocationInitialState,
  setLocationInitStateHandler,
  setSpecificLocationInitStateHandler,
  setMachineInitStateHandler,
}) => {
  const { t } = useTranslation();
  const buttonTitles = [t('common.clear'), t('common.apply')];
  const selectLocationInitialState = setLocationInitStateHandler();
  const selectSpecificLocationInitialState =
    setSpecificLocationInitStateHandler();
  const selectMachineInitialState = setMachineInitStateHandler();
  const [trackOpenLocation, setTrackOpenLocation] = useState(
    selectLocationInitialState
  );
  const [selectionLocations, setSelectionLocations] = useState(
    selectLocationInitialState
  );
  const [selectionSpecificLocations, setSelectionSpecificLocations] = useState(
    selectSpecificLocationInitialState
  );

  const [selectionMachines, setSelectionMachines] = useState(
    selectMachineInitialState
  );

  const [saveLocationIdx, setSaveLocationIdx] = useState("");

  const locations = useLocationsStore();
  const { all: allLocations } = locations;

  useEffect(() => {
    if (saveLocationIdx || saveLocationIdx === 0) {
      checkSpecificLocationSelectionHandler(saveLocationIdx);
    }
  }, [selectionSpecificLocations]);

  // !!TEST DATA
  // const { essSwitch } = useESSSwitchStore();
  // const { tesSwitch } = useTESSwitchStore();
  // const { tgsSwitch } = useTGSSwitchStore();
  // const { testAllLocations } = testData(
  //   essSwitch,
  //   tgsSwitch,
  //   locations,
  //   tesSwitch
  // );
  // console.log('testAllLocations:', testAllLocations.all);
  // console.log('testTesSwitch:', testTesSwitch);
  // console.log('testTgsSwitch', testTgsSwitch);
  // console.log('testEssSwitch', testEssSwitch);

  // !! END OF TEST DATA

  useEffect(() => {
    if (isAllSelected) {
      const selectAll = Object.keys(locationKeys).map((_) => true);
      setSelectionLocations(selectAll);
    }
  }, [isAllSelected]);

  const selectLocationIndicatorHandler = (locationIndex) => {
    const copyArray = [...selectionLocations];
    copyArray[locationIndex] = true;
    setSelectionLocations(copyArray);
  };

  const selectSpecificLocationIndicatorHandler = (
    locationIndex,
    specificLocationIndex
  ) => {
    const copyArray = [...selectionSpecificLocations];
    // console.log(
    //   copyArray[locationIndex][specificLocationIndex],
    //   "selectSpecificLocationIndicatorHandler"
    // );
    if (specificLocationIndex >= 0) {
      copyArray[locationIndex][specificLocationIndex] = true;
    } else {
      const result = selectionSpecificLocations[locationIndex].map((_) => true);
      copyArray[locationIndex] = result;
    }
    setSelectionSpecificLocations(copyArray);
  };

  const selectMachineIndicatorHandler = (
    locationIndex,
    specificLocationIndex,
    machineIndex
  ) => {
    const copyMachineArray = [...selectionMachines];
    if (machineIndex || machineIndex === 0) {
      // machine
      if (specificLocationIndex || specificLocationIndex === 0) {
        // specific location machines
        copyMachineArray[locationIndex][specificLocationIndex][
          machineIndex
        ] = true;
      } else {
        // location machines
        copyMachineArray[locationIndex][machineIndex] = true;
      }
    } else if (specificLocationIndex || specificLocationIndex === 0) {
      // specific location
      const result = selectionMachines[locationIndex][
        specificLocationIndex
      ].map((_) => true);
      copyMachineArray[locationIndex][specificLocationIndex] = result;
    } else {
      // location
      const result = selectionMachines[locationIndex].map((machine) => {
        if (Array.isArray(machine)) {
          return machine.map((_) => true);
        } else {
          return true;
        }
      });
      copyMachineArray[locationIndex] = result;
    }
    setSelectionMachines(copyMachineArray);
  };

  const selectAllHandler = useMemo(() => {
    return () => {
      const selectAllSpecificLocation = selectionSpecificLocations.map(
        (specificLocation) => {
          if (specificLocation.length > 0) {
            return specificLocation.map((_) => true);
          } else {
            return [];
          }
        }
      );
      setSelectionSpecificLocations(selectAllSpecificLocation);
      const selectAllMachines = selectionMachines.map((machines) => {
        if (machines.length > 0) {
          return machines.map((machine) => {
            if (Array.isArray(machine)) {
              return machine.map((_) => true);
            } else {
              return true;
            }
          });
        } else {
          return [];
        }
      });
      setSelectionMachines(selectAllMachines);
    };
  }, [selectionSpecificLocations]);

  const handleSelect = (
    option,
    locationIndex,
    machineIndex,
    specificLocationIndex
  ) => {
    if (option === "all") {
      setIsAllSelected(true);
      selectAllHandler();
    } else if (option === "location") {
      // location
      selectLocationIndicatorHandler(locationIndex);
      selectSpecificLocationIndicatorHandler(locationIndex);
      selectMachineIndicatorHandler(locationIndex);
    } else if (option === "specific location") {
      selectSpecificLocationIndicatorHandler(
        locationIndex,
        specificLocationIndex
      );
      selectMachineIndicatorHandler(locationIndex, specificLocationIndex);
      setSaveLocationIdx(locationIndex);
    } else {
      selectMachineIndicatorHandler(
        locationIndex,
        specificLocationIndex,
        machineIndex
      );
      checkMachineSelectionHandler(locationIndex, specificLocationIndex);
    }
  };

  const checkMachineSelectionHandler = (
    locationIndex,
    specificLocationIndex
  ) => {
    // if all machines in location or specific location are selected, the location or specific location indicator will light up
    if (specificLocationIndex || specificLocationIndex === 0) {
      const checker = selectionMachines[locationIndex][
        specificLocationIndex
      ].every((machine) => machine === true);

      if (checker) {
        const copyArray = [...selectionSpecificLocations];
        copyArray[locationIndex][specificLocationIndex] = true;
        setSelectionSpecificLocations(copyArray);
      }
    } else {
      const checker = selectionMachines[locationIndex].every(
        (machine) => machine === true
      );
      if (checker) {
        const copyArray = [...selectionLocations];
        copyArray[locationIndex] = true;
        setSelectionLocations(copyArray);
      }
    }
  };

  const checkSpecificLocationSelectionHandler = (locationIndex) => {
    // if all specific locations in location are selected, the location indicator will light up
    const checker = selectionSpecificLocations[locationIndex].every(
      (specificLocation) => specificLocation === true
    );
    if (checker) {
      const copyArray = [...selectionLocations];
      copyArray[locationIndex] = true;
      setSelectionLocations(copyArray);
    }
  };

  const handleButtonClick = (btn) => {
    if (btn === "clear") {
      // clear to unselect all logic
      // all
      setIsAllSelected(false);
      // locations
      setSelectionLocations(selectLocationInitialState);
      // specific locations
      setSelectionSpecificLocations(selectSpecificLocationInitialState);
      // machines
      setSelectionMachines(selectMachineInitialState);
    } else {
      // apply => selected options
      const selectedMachines = [];
      Object.entries(machinesSpecLocationsLocationsKeys).forEach(
        ([locationKey, locationValue], locationIdx) => {
          if (Array.isArray(locationValue) && locationValue.length > 0) {
            selectionMachines[locationIdx].forEach(
              (machineState, machineIdx) => {
                machineState === true &&
                  selectedMachines.push({
                    location: locationKey,
                    machine:
                      machinesSpecLocationsLocationsKeys[locationKey][
                        machineIdx
                      ],
                  });
              }
            );
          } else {
            Object.keys(locationValue).length > 0 &&
              Object.entries(locationValue).forEach(
                (
                  [specificLocationKey, specificLocationValue],
                  specLocationIdx
                ) => {
                  if (specificLocationValue.length > 0) {
                    selectionMachines[locationIdx][specLocationIdx].forEach(
                      (machineState, machineIdx) => {
                        if (machineState === true) {
                          selectedMachines.push({
                            location: locationKey,
                            specificLocation: specificLocationKey,
                            specLocationIdx: specLocationIdx,
                            machineIdx: machineIdx,
                            machine:
                              machinesSpecLocationsLocationsKeys[locationKey][
                                specificLocationKey
                              ][machineIdx].device_mac,
                          });
                        }
                      }
                    );
                  }
                }
              );
          }
        }
      );
      handle2ndSelect(selectedMachines);
    }
  };

  const handleOpenMachineOption = (index) => {
    const copyTrackOpenLocation = [...trackOpenLocation];
    copyTrackOpenLocation[index] = !copyTrackOpenLocation[index];
    setTrackOpenLocation(copyTrackOpenLocation);
  };

  return (
    <Wrapper>
      <SectionSelectOption>
        <SelectOptions>
          <RadioButton onClick={() => handleSelect("all")}>
            <RadioIndicator isSelected={isAllSelected}></RadioIndicator>
          </RadioButton>
          <Option all={true}>{t('common.all')} </Option>
        </SelectOptions>
        {Object.keys(locationKeys).map((location, locationIdx) => {
          // console.log('specificLocationsWithLocationsKeys:', location);

          let specificLocationId = null;
          if (locationKeys[location]?.is_parent_location) {
            // console.log('specificLocationsWithLocationsKeys:', locationKeys[location]?.specific_location);
            locationKeys[location]?.specific_location.map(
              (specificLocation) => {
                specificLocationId = specificLocation.zone_id;
              }
            );
          }
          // outerLoop: for (const [
          //   _,
          //   outerArray,
          // ] of specificLocationsWithLocationsKeys.entries()) {
          //   for (const [innerIndex, innerArray] of outerArray.entries()) {
          //     if (innerArray.includes(location)) {
          //       specificLocationId = innerArray[innerIndex + 1];
          //       break outerLoop;
          //     }
          //   }
          // }
          // console.log(specificLocationId,"specificLocationsWithLocationsKeys")
          {
            /* TEST ONLY . need to change it for proper data*/
          }

          const locationName = specificLocationId
            ? allLocations[specificLocationId]?.locationName
            : allLocations[location]?.locationName;
          return (
            <div key={location}>
              <SelectOptions>
                <RadioButton
                  onClick={() => handleSelect("location", locationIdx)}
                >
                  <RadioIndicator
                    isSelected={selectionLocations[locationIdx]}
                  ></RadioIndicator>
                </RadioButton>
                <ArrowButton
                  onClick={() => handleOpenMachineOption(locationIdx)}
                >
                  <ArrowImg src={trackOpenLocation[locationIdx] ? "/images/masterCtr-select-btn.svg" : "images/masterCtr-select-btn-right.svg"} />
                </ArrowButton>
                <Option>{locationName}</Option>
              </SelectOptions>
              {specificLocationId && trackOpenLocation[locationIdx]
                ? // ? locationKeys[location]?.specific_location.map(
                  //     ([_, specificLocation], specificLocationIdx) => {
                  //       console.log("specificLocationsWithLocationsKeys",specificLocation)
                  //       return (
                  //         <DisplaySpecificLocation
                  //           key={specificLocation}
                  //           handleOpenMachineOption={handleOpenMachineOption}
                  //           machinesSpecLocationsLocationsKeys={
                  //             machinesSpecLocationsLocationsKeys
                  //           }
                  //           selectionSpecificLocation={selectionSpecificLocations}
                  //           handleSelect={handleSelect}
                  //           selectionMachines={selectionMachines}
                  //           allLocations={allLocations}
                  //           //!! for TEST Only
                  //           // allLocations={testAllLocations.all}
                  //           location={location}
                  //           specificLocation={specificLocation}
                  //           locationIdx={locationIdx}
                  //           specificLocationIdx={specificLocationIdx}
                  //         />
                  //       );
                  //     }
                  //   )
                  locationKeys[location]?.specific_location.map(
                    (specificLocation, specificLocationIdx) => {
                      return (
                        <DisplaySpecificLocation
                          key={specificLocation.zone_id}
                          handleOpenMachineOption={handleOpenMachineOption}
                          machinesSpecLocationsLocationsKeys={
                            machinesSpecLocationsLocationsKeys
                          }
                          selectionSpecificLocation={selectionSpecificLocations}
                          handleSelect={handleSelect}
                          selectionMachines={selectionMachines}
                          allLocations={allLocations}
                          location={location}
                          specificLocation={specificLocation}
                          locationIdx={locationIdx}
                          specificLocationIdx={specificLocationIdx}
                        />
                      );
                    }
                  )
                : trackOpenLocation[locationIdx] &&
                  machinesSpecLocationsLocationsKeys[location].map(
                    (machine, machineIdx) => (
                      <DisplayMachine
                        handleSelect={handleSelect}
                        isMachineSelected={selectionMachines}
                        allLocations={allLocations}
                        location={location}
                        machine={machine}
                        locationIdx={locationIdx}
                        machineIdx={machineIdx}
                      />
                    )
                  )}
            </div>
          );
        })}
      </SectionSelectOption>
      <SectionSelectButton isOneButton={false}>
        {buttonTitles.map((button, index) => (
          <ButtonWrapper onClick={() => handleButtonClick(button)} key={index}>
            <ButtonHole>
              <ButtonInner>
                <ButtonTop>{button}</ButtonTop>
              </ButtonInner>
            </ButtonHole>
          </ButtonWrapper>
        ))}
      </SectionSelectButton>
    </Wrapper>
  );
};

export default SelectByLocation;

{
  /* <machinesSpecLocationsLocationsKeyss
key={idx}
onClick={() => handleSelect('machine', index, idx)}
>
<RadioButtonWrapper>
  <RadioIndicator
    isSelected={selectionMachines[index][idx]}
  ></RadioIndicator>
</RadioButtonWrapper>

<Option machine={true}>
  {allLocations[option].locationName} -{' '}
  {allLocations[option].devices[machine].machineName}
</Option>
</machinesSpecLocationsLocationsKeyss> */
}

const Wrapper = styled.div`
  width: 100%;

  ${flexDirectionColumn}
`;
const SectionSelectOption = styled.section`
  width: 96%;
  height: 200px;
  border-radius: 14px;

  ${layerBDark}

  padding: 4px;
  margin: 3px 0;

  /* scroll bar */
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
`;
const SelectOptions = styled.div`
  width: 100%;
  height: 27px;

  border: 1px solid #233a54;
  border-radius: 16px;

  ${justifyContentFlexStart}
  padding: 0 2rem;
  margin-bottom: 2rem;

  &:last-child {
    margin-bottom: 0;
  }

  :hover {
    ${layerA}
  }
`;

// const machinesSpecLocationsLocationsKeyss = styled.button`
//   width: 100%;
//   height: 27px;

//   border: 1px solid #233a54;
//   border-radius: 16px;

//   ${justifyContentFlexStart};
//   padding: 0 2rem;
//   margin-bottom: 2rem;
//   &:last-child {
//     margin-bottom: 0;
//   }

//   :hover {
//     ${layerA}
//   }
// `;

const RadioButton = styled.button`
  width: 18rem;
  height: 18rem;
  border: 1px solid #95ff45;
  border-radius: 50%;
  ${flexBoxCenter}
`;

// const RadioButtonWrapper = styled.div`
//   width: 18rem;
//   height: 18rem;
//   border: 1px solid #95ff45;
//   border-radius: 50%;
//   ${flexBoxCenter}
// `;

const RadioIndicator = styled.div`
  width: 12rem;
  height: 12rem;
  border-radius: 50%;
  /* background-color: #95ff45; */
  background-color: ${(p) => (p.isSelected ? "#95ff45" : "none")};
`;

const ArrowButton = styled.button`
  ${flexBoxCenter}
  margin-left: 8px;
  height: 100%;
`;
const ArrowImg = styled.img`
  margin-top: 4px;
  height: 55%;
`;

const Option = styled.span`
  font-size: 8px;
  margin-left: 5px;
  ${(p) =>
    p.all &&
    css`
      margin-left: 10px;
    `}

  ${(p) =>
    p.machine &&
    css`
      margin-left: 25px;
    `}
`;

const SectionSelectButton = styled.section`
  width: 96%;
  ${justifyContentSpaceBetween};
  ${(p) =>
    p.isOneButton &&
    css`
      justify-content: flex-end;
    `}
`;

const ButtonWrapper = styled.button`
  width: 120px;
  height: 54px;
  border-radius: 27px;

  ${layerBDark}
  ${flexBoxCenter}
`;
const ButtonHole = styled.div`
  width: 116px;
  height: 50px;
  border-radius: 25px;

  ${layerA180Deg};
  ${flexBoxCenter}
`;
const ButtonInner = styled.div`
  width: 101px;
  height: 36px;
  border-radius: 20px;

  ${layerCLighter};
  ${flexBoxCenter};
`;
const ButtonTop = styled.div`
  width: 99px;
  height: 34px;
  border-radius: 25px;
  font-size: 10px;

  ${layerA180Deg}
  ${flexBoxCenter}
`;
