import styled from 'styled-components';
import { flexBoxCenter, layerC } from '../styles/commonStyles';
import EssMasterControlByMachine from '../ess/EssMasterControlByMachine';
import TesMasterControlByMachine from '../tes/TesMasterControlByMachine';
import TgsMasterControlByMachine from '../tgs/TgsMasterControlByMachine';

const SwitchDetailsPanel = ({ selectedSwitch, swtName, locations }) => {
  const renderSwitchDetails = () => {
    if (!selectedSwitch) {
      return (
        <PlaceholderContainer>
          <PlaceholderText>Select a switch to view details</PlaceholderText>
        </PlaceholderContainer>
      );
    }

    const commonProps = {
      location: selectedSwitch.location,
      machine: selectedSwitch.machine,
      swtName: swtName,
      indivLocationName: locations[swtName][selectedSwitch.location]?.location_name_short
    };

    switch (swtName) {
      case 'ess':
        return <EssMasterControlByMachine {...commonProps} />;
      case 'tes':
        return <TesMasterControlByMachine {...commonProps} />;
      case 'tgs':
        return (
          <TgsMasterControlByMachine
            location={selectedSwitch.location}
            machine={selectedSwitch.machine}
            swtName={swtName}
          />
        );
      default:
        return null;
    }
  };

  return (
    <RightPanel>
      {renderSwitchDetails()}
    </RightPanel>
  );
};

export default SwitchDetailsPanel;

const RightPanel = styled.div`
  flex: 1;
  border-radius: 18px;
  ${layerC};
  ${flexBoxCenter};
  padding: 16px;
  min-height: 600px;
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
