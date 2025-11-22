import styled from 'styled-components';
import { flexBoxCenter, layerC } from '../styles/commonStyles';
import MasterControlByMachine from './MasterControlByMachine';

const SwitchDetailsPanel = ({ selectedSwitch, swtName, locations }) => {
  const renderBreadcrumbs = () => {
    if (!selectedSwitch) return null;

    const locationName = locations[swtName][selectedSwitch.parentZone]?.location_name_short ||
                         locations[swtName][selectedSwitch.parentZone]?.location_name ||
                         selectedSwitch.parentZone;
    const specificLocationName = selectedSwitch.specificLocation ?
                                  locations[swtName][selectedSwitch.location]?.specific_address ||
                                  selectedSwitch.specificLocation : null;

    return (
      <BreadcrumbContainer>
        <BreadcrumbItem>{swtName.toUpperCase()}</BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>{locationName}</BreadcrumbItem>
        {specificLocationName && (
          <>
            <BreadcrumbSeparator>/</BreadcrumbSeparator>
            <BreadcrumbItem>{specificLocationName}</BreadcrumbItem>
          </>
        )}
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItemActive>{selectedSwitch.machine}</BreadcrumbItemActive>
      </BreadcrumbContainer>
    );
  };

  const renderSwitchDetails = () => {
    if (!selectedSwitch) {
      return (
        <PlaceholderContainer>
          <PlaceholderText>Select a switch to view details</PlaceholderText>
        </PlaceholderContainer>
      );
    }

    return (
      <MasterControlByMachine
        systemType={swtName}
        location={selectedSwitch.location}
        machine={selectedSwitch.machine}
        indivLocationName={locations[swtName][selectedSwitch.location]?.location_name_short}
      />
    );
  };

  return (
    <RightPanel>
      {renderBreadcrumbs()}
      <DetailsContent>
        {renderSwitchDetails()}
      </DetailsContent>
    </RightPanel>
  );
};

export default SwitchDetailsPanel;

const RightPanel = styled.div`
  flex: 1;
  border-radius: 18px;
  min-width: 0;
  ${layerC};
  display: flex;
  flex-direction: column;
  padding: 12px;
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

const BreadcrumbContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  margin-bottom: 12px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  flex-wrap: wrap;
`;

const BreadcrumbItem = styled.span`
  font-size: 11px;
  letter-spacing: 0.8px;
  color: rgba(255, 255, 255, 0.7);
  transition: color 0.2s ease;
`;

const BreadcrumbSeparator = styled.span`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
`;

const BreadcrumbItemActive = styled.span`
  font-size: 11px;
  letter-spacing: 0.8px;
  color: #95ff45;
  font-weight: 600;
`;

const DetailsContent = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  overflow-x: auto;

  /* Custom scrollbar for horizontal scroll if needed */
  &::-webkit-scrollbar {
    height: 8px;
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

const PlaceholderContainer = styled.div`
  ${flexBoxCenter};
  width: 100%;
  height: 100%;
`;

const PlaceholderText = styled.div`
  font-size: 16px;
  letter-spacing: 1.4px;
  color: #fff;
  opacity: 0.5;
  text-align: center;
`;
