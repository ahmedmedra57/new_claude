import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  justifyContentFlexStart,
  layerA,
} from '../styles/commonStyles';

const DisplayMachine = ({
  handleSelect,
  isMachineSelected,
  allLocations,
  location,
  specificLocation,
  machine,
  locationIdx,
  specificLocationIdx,
  machineIdx,
}) => {
  let isSelected = false;
  let locationName = '';
  let specificLocationName = '';
  let machineName = '';
  let formattedName;

  if (specificLocation) {
    isSelected =
      isMachineSelected[locationIdx][specificLocationIdx][machineIdx];
    locationName = allLocations[location].specific_location[specificLocationIdx].location_name;
    specificLocationName =
      allLocations[location].specific_location[specificLocationIdx].specific_address;
    machineName = machine.device_name;
  // console.log(machineName,"DisplayMachine");

    formattedName = `${locationName} - ${specificLocationName} - ${machineName}`;
  } else {
    isSelected = isMachineSelected[locationIdx][machineIdx];
    locationName = allLocations[location].locationName;
    machineName = allLocations[location].devices[machine].machineName;
  // console.log(machineName,"DisplayMachine");
    formattedName = `${locationName} - ${machineName}`;
  }

  return (
    <SelectMachineOptions
      onClick={() =>
        handleSelect('machine', locationIdx, machineIdx, specificLocationIdx)
      }
    >
      <RadioButtonWrapper>
        <RadioIndicator isSelected={isSelected}></RadioIndicator>
      </RadioButtonWrapper>

      <Option machine={true}>{formattedName}</Option>
    </SelectMachineOptions>
  );
};

export default DisplayMachine;

const SelectMachineOptions = styled.button`
  width: 100%;
  height: 27px;

  border: 1px solid #233a54;
  border-radius: 16px;

  ${justifyContentFlexStart};
  padding: 0 2rem;
  margin-bottom: 2rem;
  &:last-child {
    margin-bottom: 0;
  }

  :hover {
    ${layerA}
  }
`;

const RadioButtonWrapper = styled.div`
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
  background-color: ${(p) => (p.isSelected ? '#95ff45' : 'none')};
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
