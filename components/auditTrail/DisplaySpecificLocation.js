import React, { useEffect, useState } from 'react';
import { useESSSwitchStore, useLocationsStore, useTESSwitchStore, useTGSSwitchStore } from '../zustand-stores';
import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  justifyContentFlexStart,
  layerA,
} from '../styles/commonStyles';
import DisplayMachine from './DisplayMachine';
import { useSelector } from 'react-redux';
import testData from '../../test_data/testData';

const DisplaySpecificLocation = ({
  locationIdx,
  specificLocationIdx,
  location,
  specificLocation,
  handleSelect,
  // isSelected,
  machinesSpecLocationsLocationsKeys,
  handleOpenMachineOption,
  allLocations,
  selectionMachines,
  openMachineSelect,
  isMachineSelected,
  selectionSpecificLocation,
}) => {
  // console.log(machinesSpecLocationsLocationsKeys,"specificLocationsWithLocationsKeys")
  // const [selectionSpecificLocation, setSelectionSpecificLocation] = useState(
  //   []
  // );

  const [trackOpenSpecificLocation, setTrackOpenSpecificLocation] =
    useState(false);

  // const locations = useLocationsStore();
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

  // useEffect(() => {
  //   // Initialize selection for specific location
  //   const specificLocationsInitStates = Object.entries(
  //     testAllLocations.all
  //   ).map(([key, value]) => {
  //     if (value?.zoneId) {
  //       return [];
  //     } else {
  //       return Object.keys(value).map((_) => false);
  //     }
  //   });
  //   setSelectionSpecificLocation(specificLocationsInitStates);
  //   setTrackOpenSpecificLocation(specificLocationsInitStates);
  // }, []);

  const selectIndicatorHandler = () => {
    handleSelect('specific location', locationIdx, null, specificLocationIdx);
  };

  const OpenMachineHandler = () => {
    // handleOpenMachineOption(locationIdx, specificLocationIdx);
    setTrackOpenSpecificLocation((prev) => !prev);
  };

  return (
    <div>
      <SelectOptions>
        <RadioButton onClick={selectIndicatorHandler}>
          <RadioIndicator
            isSelected={
              selectionSpecificLocation[locationIdx][specificLocationIdx]
            }
          ></RadioIndicator>
        </RadioButton>
        <ArrowButton onClick={OpenMachineHandler}>
          <ArrowImg src={trackOpenSpecificLocation? '/images/masterCtr-select-btn.svg' : "images/masterCtr-select-btn-right.svg"} />
        </ArrowButton>

        <Option>
          {specificLocation.specific_address}
        </Option>
      </SelectOptions>

      {trackOpenSpecificLocation &&
        machinesSpecLocationsLocationsKeys[location][specificLocation.zone_id].map(
          (machine, machineIdx) => (
            <div key={machine}>
              <DisplayMachine
                handleSelect={handleSelect}
                isMachineSelected={selectionMachines}
                allLocations={allLocations}
                location={location}
                specificLocation={specificLocation}
                machine={machine}
                locationIdx={locationIdx}
                specificLocationIdx={specificLocationIdx}
                machineIdx={machineIdx}
              />
            </div>
          )
        )}
    </div>
  );
};

export default DisplaySpecificLocation;

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

const RadioButton = styled.button`
  width: 18rem;
  height: 18rem;
  border: 1px solid #95ff45;
  border-radius: 50%;
  ${flexBoxCenter}
`;

const RadioIndicator = styled.div`
  width: 12rem;
  height: 12rem;
  border-radius: 50%;
  /* background-color: #95ff45; */
  background-color: ${(p) => (p.isSelected ? '#95ff45' : 'none')};
`;

const ArrowButton = styled.button`
  ${flexBoxCenter}
  margin-left: 24px;
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
