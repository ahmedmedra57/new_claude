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
          integrated switch locations - {locationNumber} locations
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
  ${flexDirectionColumn};
  gap: 8px;
`;

const Header = styled.div`
  width: 1216px;
  height: 32px;
  border-radius: 16px;
  ${layerADark};
  ${justifyContentSpaceBetween};
  padding: 0 14px;
  margin-bottom: 5px;
`;

const Title = styled.span`
  display: inline-block;
  width: 100%;
  font-size: 14px;
  letter-spacing: 1.4px;
  border-bottom: 1px solid #fff;
`;
