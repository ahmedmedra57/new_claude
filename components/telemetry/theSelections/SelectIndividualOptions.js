import { useState } from "react";
import { useLocationsStore } from '../../zustand-stores';
import styled, { css } from "styled-components";
import {
  borderABlue,
  borderBlue,
  flexBoxCenter,
  layerA,
} from "../../styles/commonStyles";
import SelectSubOptions from "./SelectSubOptions";

import SelectSpecificLocation from "./SelectSpecificLocation";

const SelectIndividualOptions = ({
  option,
  data,
  handleSelect,
  isSelected,
  isSpecificLocationSelected,
  isMachineSelected,
  index,
  isArrowDown,
  setIsArrowDown,
  isSpecLocationArrowDown,
  setIsSpecLocationArrowDown,
  isFirst,
  isMobileTC,
  isMobileGasType,
  isMobileSelectTC,
  isTelemetry,
  isMobileValveSettings,
  allSpecificLocationsName,
}) => {
  // media query
  // const isMobile = useMediaQuery({ query: '(max-width:600px)' });
  const locations = useLocationsStore();
  const [displayMachines, setDisplayMachines] = useState(false);
  const [displaySpecificLocations, setDisplaySpecificLocations] =
    useState(false);
  // const [arrowImg, setArrowImg] = useState(false);

  const dataValue =
    data &&
    Object.entries(data).map((el) => {
      if (el[1].deviceMac) {
        return el[0];
      } else {
        return el;
      }
    });
  const machines =
    data && !data?.isSpecificLocation && Object.keys(data?.devices);

  const isMachines = !data?.isSpecificLocation;

  const handleArrowImg = () => {
    const copyIsArrowDown = [...isArrowDown];
    copyIsArrowDown[index] = !isArrowDown[index];
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
      {/* {isMobile ? (
        <>
          <Wrapper
            isMobile={isMobile}
            isFirst={isFirst}
            isMobileTC={
              isMobileTC ||
              isMobileGasType ||
              isMobileValveSettings ||
              isMobileSelectTC
            }
            // isMobileSelectTC={isMobileSelectTC}
            onClick={() => handleSelect(option)}
          >
            <RadioButton>
              <RadioIndicator isSelected={isSelected}></RadioIndicator>
            </RadioButton>
            {option === 'all' ? (
              <Option>{option}</Option>
            ) : (
              <ButtonAndOptionWrapper>
                <ArrowButton
                  src={
                    isArrowDown && isArrowDown[index]
                      ? '/images/masterCtr-select-btn.svg'
                      : '/images/white-triangle-pointing-right.svg'
                  }
                  onClick={isMachines?handleDisplaySubOptions :displaySpecificLocationsHandler}
                />
                <Option>{locations.all[option]?.locationName}</Option>
              </ButtonAndOptionWrapper>
            )}
          </Wrapper>
          {displayMachines &&
            machines?.map((machine, index) => (
              <SelectSubOptions
                key={Math.random() * 10000}
                location={option}
                machine={machine}
                handleSelect={handleSelect}
                isSelected={isMachineSelected && isMachineSelected[index]}
                isMobileTC={
                  isMobileTC ||
                  isMobileValveSettings ||
                  isMobileGasType ||
                  isMobileSelectTC
                }
              />
            ))}
        </>
      ) : ( */}
      <>
        <Wrapper isTelemetry={isTelemetry}>
          <RadioButton onClick={() => handleSelect(option)}>
            <RadioIndicator isSelected={isSelected}></RadioIndicator>
          </RadioButton>
          {option === "all" ? (
            <Option>{option}</Option>
          ) : (
            <ButtonAndOptionWrapper>
              <ArrowButton
                // src={
                //   displaySpecificLocations || displayMachines
                //     ? '/images/masterCtr-select-btn.svg'
                //     : '/images/white-triangle-pointing-right.svg'
                // }
                src={
                  isArrowDown && isArrowDown[index]
                    ? "/images/masterCtr-select-btn.svg"
                    : "/images/white-triangle-pointing-right.svg"
                }
                onClick={handleDisplaySubOptions}
              />
              <Option>{locations.all[option]?.locationName}</Option>
            </ButtonAndOptionWrapper>
          )}
        </Wrapper>

        {/* display specific locations */}
        {displaySpecificLocations &&
          !isMachines &&
          Object.entries(data?.subLocations)?.map((subLocation, idx) => {
          let specificLocationIdx;
          allSpecificLocationsName?.forEach((name, idx) => {
            if (name.includes(subLocation[0])) {
              specificLocationIdx = idx;
            }
          });
            return (
              <SelectSpecificLocation
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
                isTelemetry={isTelemetry}
                // data={data}
                isSpecificLocation={!isMachines}
                isSpecLocationArrowDown={isSpecLocationArrowDown}
                setIsSpecLocationArrowDown={setIsSpecLocationArrowDown}
              />
            );
          })}

        {/* display machines */}
        {displayMachines &&
          isMachines &&
          machines?.map((machine, index) => (
            <SelectSubOptions
              key={Math.random() * 10000}
              location={option}
              machine={machine}
              handleSelect={handleSelect}
              isSelected={isMachineSelected && isMachineSelected[index]}
              isTelemetry={isTelemetry}
            />
          ))}
      </>
      {/* )} */}
    </>
  );
};
export default SelectIndividualOptions;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 2px;
  &:last-child {
    margin-bottom: 0px;
  }

  ${({ isMobile, isTelemetry }) =>
    isMobile
      ? css`
          width: 268px;
          min-height: 32px;
          ${borderABlue}
          ${({ isFirst }) =>
            isFirst &&
            css`
              margin-top: 2px;
            `}
          ${({ isMobileTC }) =>
            isMobileTC &&
            css`
              width: 98%;
            `}
        `
      : isTelemetry
      ? css`
          width: 98.5%;
          /* width: 282px; */
          min-height: 26px;
          ${borderBlue}
        `
      : css`
          width: 98.5%;
          min-height: 26px;
          ${borderABlue}
        `}

  cursor: pointer;
  &:hover {
    ${layerA}
  }

  border-radius: 16px;

  /* padding: 0 2px;
  margin-bottom: 2px; */
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

  background-color: ${(p) => (p.isSelected ? "#95ff45" : "none")};
`;
const Option = styled.span`
  font-size: 10px;
  margin-left: 5px;
  letter-spacing: 1px;
`;

const ButtonAndOptionWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const ArrowButton = styled.img`
  margin: 3px 8px 0 8px;

  cursor: pointer;
`;
