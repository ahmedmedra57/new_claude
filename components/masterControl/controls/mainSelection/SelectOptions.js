import { useState } from 'react';
import { useLocationsStore } from '../../../zustand-stores';
import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  justifyContentFlexStart,
  layerA,
} from '../../../styles/commonStyles';
import SelectSubOptions from './SelectSubOptions';
import SelectSpecificLocationOptions from './SelectSpecificLocationOptions';

const SelectOptions = ({
  index,
  option,
  data,
  handleSelect,
  isSelected,
  isMachineSelected,
  isSpecificLocationSelected,
  isMobile,
  isSmall,
  scope,
  isMasterControl,
  isArrowDown,
  setIsArrowDown,
  allSpecificLocationsName,
  isSpecLocationArrowDown,
  setIsSpecLocationArrowDown,
  newData,
  isHp,
  hpData,
}) => {
  const [displayMachines, setDisplayMachines] = useState(false);
  const [displaySpecificLocations, setDisplaySpecificLocations] =
    useState(false);
  const locations = useLocationsStore();

  const machines =
    data && !data?.isSpecificLocation && Object.keys(data?.devices);

  const isMachines = !data?.isSpecificLocation;

  // const handleDisplaySubOptions = (event) => {
  //   event.stopPropagation();
  //   setDisplayMachines(!displayMachines);
  // };

  const handleArrowImg = () => {
    const copyIsArrowDown = [...isArrowDown];
    copyIsArrowDown[index] = !copyIsArrowDown[index];
    setIsArrowDown(copyIsArrowDown);
  };

  const handleDisplaySubOptions = (event) => {
    event.stopPropagation();
    handleArrowImg();
    if (isMachines) {
      setDisplayMachines((prev) => !prev);
    } else {
      setDisplaySpecificLocations((prev) => !prev);
    }
  };

  return (
    <>
      <Wrapper
        isMobile={isMobile}
        isSmall={isSmall}
        isMasterControl={isMasterControl}
      >
        <RadioButton onClick={() => handleSelect(option)} isMobile={isMobile}>
          <RadioIndicator isSelected={isSelected}></RadioIndicator>
        </RadioButton>
        {option === 'all' ? (
          <Option isMobile={isMobile}>{option}</Option>
        ) : (
          <ButtonAndOptionWrapper isMobile={isMobile}>
            <ArrowButton
              isMobile={isMobile}
              src={
                displayMachines || isArrowDown[index]
                  ? '/images/masterCtr-select-btn.svg'
                  : '/images/masterCtr-select-btn-right.svg'
              }
              onClick={handleDisplaySubOptions}
            />

            <Option isMobile={isMobile}>
              {isHp
                ? hpData[option].locationName
                : locations?.all[option]?.locationName ||
                  locations?.all[option]?.specific_address}
            </Option>
          </ButtonAndOptionWrapper>
        )}
      </Wrapper>

      {/* display specific locations */}
      {displaySpecificLocations &&
        !isMachines &&
        Object.entries(data?.subLocations)?.map((subLocation, idx) => {
          let specificLocationIdx;
          allSpecificLocationsName.forEach((name, idx) => {
            if (name.includes(subLocation[0])) {
              specificLocationIdx = idx;
            }
          });

          return (
            subLocation && (
              <SelectSpecificLocationOptions
                key={Math.random() * 10000}
                location={option}
                idx={idx}
                specLocationName={subLocation[0]}
                machineData={subLocation[1]?.devices}
                handleSelect={handleSelect}
                specificLocationIdx={specificLocationIdx}
                isSelected={
                  isSpecificLocationSelected &&
                  isSpecificLocationSelected[specificLocationIdx]?.[idx]
                }
                isMachineSelected={
                  isMachineSelected.length > 0 && isMachineSelected[idx]
                }
                isSpecificLocation={!isMachines}
                isSpecLocationArrowDown={isSpecLocationArrowDown}
                setIsSpecLocationArrowDown={setIsSpecLocationArrowDown}
                isMasterControl={isMasterControl}
                isMobile={isMobile}
                scope={scope}
              />
            )
          );
        })}

      {/* display machines */}
      {displayMachines &&
        machines?.map((machine, index) => {
          return (
            <SelectSubOptions
              key={Math.random() * 10000}
              isMasterControl={isMasterControl}
              isMobile={isMobile}
              location={option}
              machine={machine}
              handleSelect={handleSelect}
              isSelected={isMachineSelected && isMachineSelected[index]}
              scope={scope}
            />
          );
        })}
    </>
  );
};
export default SelectOptions;

const Wrapper = styled.div`
  width: 98%;
  min-height: 24px;

  border: 1px solid #233a54;
  border-radius: 16px;

  ${justifyContentFlexStart}

  padding: 0 2px;
  margin-bottom: 2px;

  &:hover {
    ${layerA}
  }

  ${(p) =>
    p.isMobile &&
    css`
      min-height: 32px;
      border: 1px solid #142033;
      padding: 0 6px;

      ${(p) =>
        p.isSmall
          ? css`
              width: 282px;
            `
          : css`
              width: 293px;
            `}
    `}

  ${(p) =>
    p.isMasterControl &&
    css`
      width: 225px;
    `}
`;

const RadioButton = styled.div`
  width: 18px;
  height: 18px;
  border: 1px solid #95ff45;
  border-radius: 50%;
  ${flexBoxCenter}

  cursor: pointer;
  ${(p) =>
    p.isMobile &&
    css`
      min-width: 22px;
      min-height: 22px;
    `}
`;
const RadioIndicator = styled.div`
  width: 10rem;
  height: 10rem;
  border-radius: 50%;
  /* background-color: #95ff45; */
  background-color: ${(p) => (p.isSelected ? '#95ff45' : 'none')};
  ${(p) => p.isMobile && css``}
`;
const Option = styled.span`
  font-size: 10px;
  margin-left: 5px;

  ${(p) =>
    p.isMobile &&
    css`
      font-size: 12px;
      letter-spacing: 1.2px;
    `}
`;

const ButtonAndOptionWrapper = styled.div`
  display: flex;
  align-items: center;
  ${(p) => p.isMobile && css``}
`;
const ArrowButton = styled.img`
  margin: 3px 5px 0 5px;

  cursor: pointer;
  ${(p) => p.isMobile && css``}
`;
