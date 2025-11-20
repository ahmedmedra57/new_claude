import styled from 'styled-components';
import { flexDirectionColumn, layerA180Deg, layerB, layerC } from '../styles/commonStyles';

const ZonesList = ({ switchStatus, locations, swtName, machineNumber, onZoneClick }) => {
  return (
    <ZonesListContainer>
      {Object.keys(switchStatus).map((location, index) => {
        const locationData = locations[swtName][location];
        const isSpecificLocation = switchStatus[location].isSpecificLocation;
        const numSpecLocations = isSpecificLocation && Object.keys(switchStatus[location].subLocations).length;
        const count = isSpecificLocation ? numSpecLocations : machineNumber[index];

        return (
          <ZoneItem
            key={location}
            onClick={() => onZoneClick(location)}
          >
            <ZoneItemTitle>
              {locationData?.location_name_short || locationData?.location_name}
            </ZoneItemTitle>
            <ZoneItemCount>
              {count} {isSpecificLocation ? 'sub-loc' : 'sw'}
            </ZoneItemCount>
          </ZoneItem>
        );
      })}
    </ZonesListContainer>
  );
};

export default ZonesList;

const ZonesListContainer = styled.div`
  ${flexDirectionColumn};
  gap: 6px;
  border-radius: 18px;
  ${layerC};
  padding: 8px;
  max-height: 700px;
  overflow-y: auto;
`;

const ZoneItem = styled.div`
  border-radius: 12px;
  ${layerA180Deg};
  padding: 10px 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    ${layerB};
    transform: translateX(2px);
  }
`;

const ZoneItemTitle = styled.div`
  font-size: 11px;
  letter-spacing: 1px;
  color: #95ff45;
  margin-bottom: 3px;
  word-break: break-word;
`;

const ZoneItemCount = styled.div`
  font-size: 10px;
  letter-spacing: 0.8px;
  color: #fff;
  opacity: 0.7;
`;
