import { useLocationsStore } from '../zustand-stores';
import styled from 'styled-components';
import {
  borderABlue,
  borderBlue,
  flexBoxCenter,
  layerA,
} from '../../../styles/commonStyles';
import SelectSubOptions from './SelectSubOptions';

const SelectSpecificLocationOptions = ({
  location,
  specificLocationIdx,
  specLocationName,
  handleSelect,
  isSelected,
  isMachineSelected,
  scope,
  machineData,
  isSpecificLocation,
  isSpecLocationArrowDown,
  setIsSpecLocationArrowDown,
  idx,
  isMasterControl,
}) => {
  const machines = machineData && Object.keys(machineData);
  const handleDisplaySubOptions = (event) => {
    event.stopPropagation();
    const copyIsSpecLocationArrowDown = [...isSpecLocationArrowDown];
    copyIsSpecLocationArrowDown[specificLocationIdx][idx] =
      !isSpecLocationArrowDown[specificLocationIdx][idx];
    setIsSpecLocationArrowDown(copyIsSpecLocationArrowDown);
  };

  const locations = useLocationsStore();
  const display = isSpecLocationArrowDown[specificLocationIdx][idx];
  return (
    <>
      <Wrapper>
        <RadioButton
          onClick={() =>
            handleSelect(location, 'isSpecificLocation', specLocationName, idx)
          }
        >
          <RadioIndicator isSelected={isSelected}></RadioIndicator>
        </RadioButton>

        <ButtonAndOptionWrapper>
          <ArrowButton
            src={
              display
                ? '/images/masterCtr-select-btn.svg'
                : '/images/white-triangle-pointing-right.svg'
            }
            onClick={handleDisplaySubOptions}
          />
          <Option>
            {locations.all[specLocationName]?.specific_address ??
              'specific location'}
          </Option>
        </ButtonAndOptionWrapper>
      </Wrapper>
      {/* individual switches */}
      {display &&
        machines?.map((machine, index) => (
          <SelectSubOptions
            key={Math.random() * 10000}
            location={location}
            machine={machine}
            handleSelect={handleSelect}
            isSelected={isMachineSelected && isMachineSelected[index]}
            scope={scope}
            isSpecificLocation={isSpecificLocation}
            specificLocation={specLocationName}
            isMasterControl={isMasterControl}
          />
        ))}
    </>
  );
};

export default SelectSpecificLocationOptions;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 2px;

  &:last-child {
    margin-bottom: 0px;
  }

  width: 98.5%;

  min-height: 26px;
  ${borderABlue}

  cursor: pointer;
  &:hover {
    ${layerA}
  }

  border-radius: 16px;
`;

const RadioButton = styled.div`
  width: 18px;
  height: 18px;
  margin-left: 4px;
  border: 1px solid #95ff45;
  border-radius: 50%;
  ${flexBoxCenter}
`;
const RadioIndicator = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;

  background-color: ${(p) => (p.isSelected ? '#95ff45' : 'none')};
`;
const Option = styled.span`
  font-size: 10px;
  margin-left: 5px;
  letter-spacing: 1px;
`;

const ButtonAndOptionWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 22px;
`;
const ArrowButton = styled.img`
  margin: 3px 8px 0 8px;

  cursor: pointer;
`;
