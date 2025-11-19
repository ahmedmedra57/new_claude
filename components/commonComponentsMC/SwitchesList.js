import styled from 'styled-components';
import { flexDirectionColumn, layerA180Deg, layerB, layerBDark, layerC } from '../styles/commonStyles';

const SwitchesList = ({
  selectedZone,
  switchStatus,
  locations,
  swtName,
  selectedSpecificLocation,
  selectedSwitch,
  onBackToZones,
  onSpecificLocationClick,
  onBackToParentZone,
  onSwitchClick
}) => {
  if (!selectedZone) return null;

  const renderSubLocations = () => {
    return Object.keys(switchStatus[selectedZone].subLocations).map((specLoc) => {
      const specificLocationData = locations[swtName][specLoc];
      const devicesLength = Object.keys(switchStatus[selectedZone].subLocations[specLoc].devices).length;

      return (
        <SubLocationItem
          key={specLoc}
          onClick={() => onSpecificLocationClick(specLoc)}
        >
          <SubLocationTitle>
            {specificLocationData?.location_name_short}
          </SubLocationTitle>
          <SubLocationCount>{devicesLength} sw</SubLocationCount>
        </SubLocationItem>
      );
    });
  };

  const renderSwitchesInSubLocation = () => {
    return Object.keys(switchStatus[selectedZone].subLocations[selectedSpecificLocation].devices).map((machine) => {
      const isActive = selectedSwitch?.machine === machine && selectedSwitch?.location === selectedSpecificLocation;

      return (
        <SwitchItem
          key={machine}
          active={isActive}
          onClick={() => onSwitchClick(selectedZone, machine, selectedSpecificLocation)}
        >
          {machine}
        </SwitchItem>
      );
    });
  };

  const renderDirectSwitches = () => {
    return Object.keys(switchStatus[selectedZone].devices).map((machine) => {
      const isActive = selectedSwitch?.machine === machine && selectedSwitch?.location === selectedZone;

      return (
        <SwitchItem
          key={machine}
          active={isActive}
          onClick={() => onSwitchClick(selectedZone, machine)}
        >
          {machine}
        </SwitchItem>
      );
    });
  };

  return (
    <SwitchesListContainer>
      <BackButton onClick={onBackToZones}>
        ← Back to Zones
      </BackButton>

      {switchStatus[selectedZone].isSpecificLocation ? (
        // Zone has sub-locations
        <>
          {!selectedSpecificLocation ? (
            // Show sub-locations list
            renderSubLocations()
          ) : (
            // Show switches in selected sub-location
            <>
              <BackButton onClick={onBackToParentZone}>
                ← Back to Sub-locations
              </BackButton>
              {renderSwitchesInSubLocation()}
            </>
          )}
        </>
      ) : (
        // Zone has direct switches (no sub-locations)
        renderDirectSwitches()
      )}
    </SwitchesListContainer>
  );
};

export default SwitchesList;

const SwitchesListContainer = styled.div`
  ${flexDirectionColumn};
  gap: 6px;
  border-radius: 18px;
  ${layerC};
  padding: 8px;
  max-height: 700px;
  overflow-y: auto;
`;

const BackButton = styled.button`
  border-radius: 10px;
  ${layerBDark};
  padding: 8px 12px;
  cursor: pointer;
  border: none;
  color: #fff;
  font-size: 11px;
  letter-spacing: 1px;
  transition: all 0.2s ease;
  margin-bottom: 6px;

  &:hover {
    ${layerB};
    transform: translateX(-2px);
  }
`;

const SwitchItem = styled.div`
  border-radius: 10px;
  ${(p) => p.active ? layerB : layerA180Deg};
  padding: 8px 12px;
  cursor: pointer;
  font-size: 11px;
  letter-spacing: 1px;
  color: ${(p) => p.active ? '#95ff45' : '#fff'};
  transition: all 0.2s ease;
  border: ${(p) => p.active ? '2px solid #95ff45' : '2px solid transparent'};
  word-break: break-word;

  &:hover {
    ${layerB};
    color: #95ff45;
  }
`;

const SubLocationItem = styled.div`
  border-radius: 10px;
  ${layerA180Deg};
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    ${layerB};
    transform: translateX(2px);
  }
`;

const SubLocationTitle = styled.div`
  font-size: 11px;
  letter-spacing: 1px;
  color: #ff920c;
  margin-bottom: 3px;
  word-break: break-word;
`;

const SubLocationCount = styled.div`
  font-size: 9px;
  letter-spacing: 0.8px;
  color: #fff;
  opacity: 0.7;
`;
