import styled from 'styled-components';
import { flexDirectionColumn, justifyContentSpaceBetween, layerADark } from '../styles/commonStyles';
import ZonesList from './ZonesList';
import SwitchesList from './SwitchesList';

const LeftPanelNavigation = ({
  navigationView,
  switchStatus,
  locations,
  swtName,
  locationNumber,
  machineNumber,
  selectedZone,
  selectedSpecificLocation,
  selectedSwitch,
  onZoneClick,
  onBackToZones,
  onSpecificLocationClick,
  onBackToParentZone,
  onSwitchClick
}) => {
  return (
    <LeftPanel>
      <Header>
        <Title>
<<<<<<< HEAD:src/components/commonComponentsMC/LeftPanelNavigation.js
          integrated switch
          locations ({locationNumber})
=======
          integrated switch locations - {locationNumber} locations
>>>>>>> 9cf9a32773896e201f614a12d99dd6469d3b32ed:components/commonComponentsMC/LeftPanelNavigation.js
        </Title>
      </Header>

      {navigationView === 'zones' ? (
        <ZonesList
          switchStatus={switchStatus}
          locations={locations}
          swtName={swtName}
          machineNumber={machineNumber}
          onZoneClick={onZoneClick}
        />
      ) : (
        <SwitchesList
          selectedZone={selectedZone}
          switchStatus={switchStatus}
          locations={locations}
          swtName={swtName}
          selectedSpecificLocation={selectedSpecificLocation}
          selectedSwitch={selectedSwitch}
          onBackToZones={onBackToZones}
          onSpecificLocationClick={onSpecificLocationClick}
          onBackToParentZone={onBackToParentZone}
          onSwitchClick={onSwitchClick}
        />
      )}
    </LeftPanel>
  );
};

export default LeftPanelNavigation;

const LeftPanel = styled.div`
  flex: 0 0 280px;
<<<<<<< HEAD:src/components/commonComponentsMC/LeftPanelNavigation.js
  width: 280px;
  ${flexDirectionColumn};
  gap: 8px;
  height: calc(100vh - 120px);
  min-height: 600px;
  max-height: 800px;
  overflow-y: auto;
  overflow-x: hidden;

  /* Custom scrollbar styling */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;

    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }
  }
`;

const Header = styled.div`
  width: 100%;
=======
  ${flexDirectionColumn};
  gap: 8px;
`;

const Header = styled.div`
  width: 1216px;
>>>>>>> 9cf9a32773896e201f614a12d99dd6469d3b32ed:components/commonComponentsMC/LeftPanelNavigation.js
  height: 32px;
  border-radius: 16px;
  ${layerADark};
  ${justifyContentSpaceBetween};
  padding: 0 14px;
  margin-bottom: 5px;
<<<<<<< HEAD:src/components/commonComponentsMC/LeftPanelNavigation.js
  box-sizing: border-box;
=======
>>>>>>> 9cf9a32773896e201f614a12d99dd6469d3b32ed:components/commonComponentsMC/LeftPanelNavigation.js
`;

const Title = styled.span`
  display: inline-block;
  width: 100%;
<<<<<<< HEAD:src/components/commonComponentsMC/LeftPanelNavigation.js
  font-size: 11px;
  letter-spacing: 0.8px;
  border-bottom: 1px solid #fff;
  line-height: 1.4;
=======
  font-size: 14px;
  letter-spacing: 1.4px;
  border-bottom: 1px solid #fff;
>>>>>>> 9cf9a32773896e201f614a12d99dd6469d3b32ed:components/commonComponentsMC/LeftPanelNavigation.js
`;
