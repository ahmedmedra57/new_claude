import styled, { css } from 'styled-components';
import {
  borderBlue,
  justifyContentSpaceBetween,
} from '../../../styles/commonStyles';
import SelectedSwitch from './SelectedSwitch';
import { useEffect, useState } from 'react';

const SelectedSpecificLocation = ({
  locationIdx,
  specificLocationIdx,
  energySymbol,
  specificLocationValues,
  telemetryData,
  specificLocationsOpeningControl,
  expandSpecificLocationHandler,
  isSearched,
}) => {
  const closeArrow = './images/white-triangle-pointing-right.svg';
  const openArrow = './images/white-triangle-pointing-down.svg';

  const displayArrow = specificLocationsOpeningControl[locationIdx][
    specificLocationIdx
  ]
    ? openArrow
    : closeArrow;

  const [totalSwitches, setTotalSwitches] = useState();
  const [totalHours, setTotalHours] = useState();
  const [totalConsumption, setTotalConsumption] = useState();

  useEffect(() => {
    let numSwitches = 0;
    let numHours = 0;
    let numEnergyConsumptions = 0;
    telemetryData.forEach((value) => {
      if (
        specificLocationValues.some(
          (machine) => machine.deviceMac === value.machine
        )
      ) {
        numSwitches += 1;
        numEnergyConsumptions += +value.totalConsumption;
        numHours += +value.totalUsageHours;
      }
    });

    setTotalSwitches(numSwitches);
    setTotalHours(numHours);
    setTotalConsumption(numEnergyConsumptions);
  }, [specificLocationValues, telemetryData]);



  return (
    <>
      <IndividualMachine>
        <FlexDiv>
          <ImgLocationWrapper>
            <Img
              src={displayArrow}
              onClick={() => {
                expandSpecificLocationHandler(locationIdx, specificLocationIdx);
              }}
            />
            <SpecificLocationName>
              {specificLocationValues[0]?.specificLocationName ??
                'specific location'}
            </SpecificLocationName>
          </ImgLocationWrapper>
          <Info isSwitches={true}>{totalSwitches} switches</Info>
          <Info isHours={true}>{totalHours} Hrs</Info>
          <Info isConsumption={true}>
            {totalConsumption} {energySymbol}
          </Info>
        </FlexDiv>
      </IndividualMachine>
      {(specificLocationsOpeningControl[locationIdx][specificLocationIdx] ||
        isSearched) &&
        specificLocationValues.map((machine, idx) => {
          return (
            <SelectedSwitch
              key={idx}
              switchData={`${machine.locationName} - ${machine.machineName}`}
              energySymbol={energySymbol}
              machineValues={machine}
              telemetryData={telemetryData}
            />
          );
        })}
    </>
  );
};

export default SelectedSpecificLocation;

const IndividualMachine = styled.div`
  width: 99.4%;
  height: 26px;

  ${borderBlue}
  border-radius: 13px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 8px 0 22px;

  margin-bottom: 2px;
`;

const FlexDiv = styled.div`
  width: 99%;
  height: 100%;
  ${justifyContentSpaceBetween};
  position: relative;
`;

const ImgLocationWrapper = styled.div`
  width: fit-content;
  ${justifyContentSpaceBetween}
`;

const Img = styled.img`
  margin-left: 8px;
  margin-right: 4px;
  cursor: pointer;
`;

const SpecificLocationName = styled.span`
  width: fit-content;
  text-align: left;
  font-size: 9px;
  letter-spacing: 0.9px;
  color: #ffffff;
  opacity: 1;
`;

const Info = styled.span`
  font-size: 9px;
  width: fit-content;

  position: absolute;
  ${({ isConsumption, isHours }) =>
    isConsumption
      ? css`
          top: 7px;
          left: 89.5%;
        `
      : isHours
      ? css`
          top: 7px;
          left: 62%;
        `
      : css`
          top: 7px;
          left: 32.5%;
        `}
`;
