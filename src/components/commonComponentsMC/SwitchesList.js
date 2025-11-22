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
<<<<<<< HEAD:src/components/commonComponentsMC/SwitchesList.js
          {`${specificLocationData?.location_name_short} - ${specificLocationData?.specific_address} - ${specificLocationData?.zone_city},${specificLocationData?.zone_state_short_name} - ${devicesLength} switches `}
=======
            {specificLocationData?.location_name_short}
>>>>>>> 9cf9a32773896e201f614a12d99dd6469d3b32ed:components/commonComponentsMC/SwitchesList.js
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
<<<<<<< HEAD:src/components/commonComponentsMC/SwitchesList.js
          
=======
>>>>>>> 9cf9a32773896e201f614a12d99dd6469d3b32ed:components/commonComponentsMC/SwitchesList.js
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
<<<<<<< HEAD:src/components/commonComponentsMC/SwitchesList.js
  gap: 8px;
  border-radius: 18px;
  width: 100%;
  
  ${layerC};
  padding: 8px;
  flex: 1;
=======
  gap: 6px;
  border-radius: 18px;
  ${layerC};
  padding: 8px;
  max-height: 700px;
  overflow-y: auto;
>>>>>>> 9cf9a32773896e201f614a12d99dd6469d3b32ed:components/commonComponentsMC/SwitchesList.js
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
<<<<<<< HEAD:src/components/commonComponentsMC/SwitchesList.js
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
=======
  transition: all 0.2s ease;
>>>>>>> 9cf9a32773896e201f614a12d99dd6469d3b32ed:components/commonComponentsMC/SwitchesList.js
  margin-bottom: 6px;

  &:hover {
    ${layerB};
<<<<<<< HEAD:src/components/commonComponentsMC/SwitchesList.js
    transform: translateX(-4px) scale(1.02);
    box-shadow: -2px 2px 8px rgba(255, 255, 255, 0.1);
  }

  &:active {
    transform: translateX(-2px) scale(0.98);
=======
    transform: translateX(-2px);
>>>>>>> 9cf9a32773896e201f614a12d99dd6469d3b32ed:components/commonComponentsMC/SwitchesList.js
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
<<<<<<< HEAD:src/components/commonComponentsMC/SwitchesList.js
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: ${(p) => p.active ? '2px solid #95ff45' : '2px solid transparent'};
  word-break: break-word;
  transform-origin: center;
=======
  transition: all 0.2s ease;
  border: ${(p) => p.active ? '2px solid #95ff45' : '2px solid transparent'};
  word-break: break-word;
>>>>>>> 9cf9a32773896e201f614a12d99dd6469d3b32ed:components/commonComponentsMC/SwitchesList.js

  &:hover {
    ${layerB};
    color: #95ff45;
<<<<<<< HEAD:src/components/commonComponentsMC/SwitchesList.js
    transform: scale(1.03);
    box-shadow: 0 3px 10px rgba(149, 255, 69, 0.15);
  }

  &:active {
    transform: scale(0.98);
=======
>>>>>>> 9cf9a32773896e201f614a12d99dd6469d3b32ed:components/commonComponentsMC/SwitchesList.js
  }
`;

const SubLocationItem = styled.div`
  border-radius: 10px;
  ${layerA180Deg};
  padding: 8px 12px;
  cursor: pointer;
<<<<<<< HEAD:src/components/commonComponentsMC/SwitchesList.js
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: left center;

  &:hover {
    ${layerB};
    transform: translateX(4px) scale(1.02);
    box-shadow: 0 3px 10px rgba(255, 146, 12, 0.2);
  }

  &:active {
    transform: translateX(2px) scale(0.98);
=======
  transition: all 0.2s ease;

  &:hover {
    ${layerB};
    transform: translateX(2px);
>>>>>>> 9cf9a32773896e201f614a12d99dd6469d3b32ed:components/commonComponentsMC/SwitchesList.js
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
