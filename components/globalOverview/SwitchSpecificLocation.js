import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { justifyContentSpaceBetween, layerA } from '../styles/commonStyles';

import IndividualMachine from './IndividualMachine';
import { calculateTotalEnergyConsumption } from '../../helpers/helpers';
import { useLocationsStore } from '../zustand-stores';

const SwitchSpecificLocation = ({
  handleOnClick,
  switchNumber,
  unit,
  allSystemLocations,
  location,
  specificLocation,
  systemType,
  setCenter,
  setZoomNum,
  selectedLocation,
  setSelectedLocation,
  isExpanded,
  system,
  openSpecificLocationIdx,
  openLocationIdx,
  isF,
}) => {
  const [src, setSrc] = useState('/images/IS-arrow.svg');
  
  useEffect(() => {
    isExpanded
      ? setSrc('/images/IS-arrow-expanded.svg')
      : setSrc('/images/IS-arrow.svg');
  }, [isExpanded]);

  const handleExpand = () => {
    if (isExpanded) {
      useLocationsStore().openSpecificLocation({
          swtName: systemType,
          openLocationIdx,
          openSpecificLocationIdx,
          status: false,
        });
    } else {
      useLocationsStore().openSpecificLocation({
          swtName: systemType,
          openLocationIdx,
          openSpecificLocationIdx,
          status: true,
        });
    }
  };
  const hoursOfUsage = useMemo(() => {
    let total = 0;
    Object.keys(system[location].subLocations[specificLocation].devices).forEach((machine) => {
      total += system[location].subLocations[specificLocation].devices[machine]?.hoursOfUsage || 0;
    });
    return total === 0 ? '--' : total;
  }, [system, location, specificLocation]);

  const energyConsumption = useMemo(() => {
    let total = 0;
    Object.keys(system[location].subLocations[specificLocation].devices).forEach((machine) => {
      total +=
        +calculateTotalEnergyConsumption(
          system[location].subLocations[specificLocation].devices[machine]?.reading,
          systemType,
          isF
        ) || 0;
    });
    return total === 0 ? '--' : total;
  }, [system, location, specificLocation, systemType, isF]);

  return (
    <>
      <Wrapper onClick={handleOnClick}>
        <IconAndLocationWrapper>
          <Icon onClick={handleExpand} src={src} />
          <Info>
            {allSystemLocations[systemType][specificLocation]
              ?.specific_address ?? 'specific location'}
          </Info>
        </IconAndLocationWrapper>
        <Info>{switchNumber} {systemType === "ess" ? "switches" : "blowers"}</Info>
        <Info>{hoursOfUsage} Hrs</Info>
        <Info>
          {energyConsumption} {unit}
        </Info>
      </Wrapper>
      {isExpanded &&
        Object.keys(system[location].subLocations[specificLocation].devices).map((machine) => (
          <IndividualMachine
            key={Math.random() * 1000}
            location={location}
            specificLocation={specificLocation}
            machine={machine}
            swtName={systemType}
            setCenter={setCenter}
            setZoomNum={setZoomNum}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
          />
        ))}
    </>
  );
};

export default SwitchSpecificLocation;

const Wrapper = styled.div`
  width: 99.6%;
  min-height: 16px;
  border-radius: 13px;

  border: 1px solid #233a54;

  ${justifyContentSpaceBetween}
  padding: 0 8px;
  margin-bottom: 2px;

  :last-child {
    margin-bottom: 0;
  }
  :hover {
    ${layerA}
  }
`;
const IconAndLocationWrapper = styled.div`
  width: 40%;
  padding-left: 14px;
  display: flex;
  align-items: center;
`;
const Icon = styled.img`
  margin-right: 4px;
  cursor: pointer;
`;
const Info = styled.span`
  font-size: 8px;
`;
