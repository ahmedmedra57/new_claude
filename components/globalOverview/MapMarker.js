import { useState } from 'react';
import { useESSSwitchStore, useLocationsStore, useTESSwitchStore, useTGSSwitchStore } from '../zustand-stores';
import styled from 'styled-components';
import {
  flexDirectionColumn,
  justifyContentSpaceBetween,
  layerA,
} from '../styles/commonStyles';
const MapMarker = ({ location, handleZoom }) => {
  const locations = useLocationsStore();
  const { essSwitch } = useESSSwitchStore();
  const { tesSwitch } = useTESSwitchStore();
  const { tgsSwitch } = useTGSSwitchStore();

  const essNum = essSwitch[location]
    ? Object.values(essSwitch[location]).length
    : 0;
  const tgsNum = tgsSwitch[location]
    ? Object.values(tgsSwitch[location]).length
    : 0;
  const tesNum = tesSwitch[location]
    ? Object.values(tesSwitch[location]).length
    : 0;
  const [openInfoWindow, setOpenInfoWindow] = useState(false);

  const locationName =
    locations?.all[location]?.locationName &&
    locations.all[location].locationName;

  return (
    <Wrapper onClick={handleZoom}>
      <MapIcon
        src='/images/map-icon.svg'
        onMouseEnter={() => setOpenInfoWindow(true)}
        onMouseLeave={() => setOpenInfoWindow(false)}
      />
      <LocationName>{locationName}</LocationName>
      {openInfoWindow && (
        <HoverInfoBox>
          <InfoSpan>{locationName}</InfoSpan>

          <GroupWrapper>
            <IconAndSwitchWrapper>
              <Icon src='/images/ess-map-icon.svg' />
              <InfoSpan>{essNum}-ess</InfoSpan>
            </IconAndSwitchWrapper>

            <IconAndSwitchWrapper>
              <Icon src='/images/tgs-map-icon.svg' />
              <InfoSpan>{tgsNum}-tgs</InfoSpan>
            </IconAndSwitchWrapper>

            <IconAndSwitchWrapper>
              <Icon src='/images/tes-map-icon.svg' />
              <InfoSpan>{tesNum}-tes</InfoSpan>
            </IconAndSwitchWrapper>
          </GroupWrapper>
        </HoverInfoBox>
      )}
    </Wrapper>
  );
};
export default MapMarker;

const Wrapper = styled.div`
  position: relative;
 
`;
const MapIcon = styled.img`
  margin-right: 10px;
`;
const LocationName = styled.span`
  color: #ff0000;
  font-size: 14px;
  letter-spacing: 1.6px;
  font-family: 'Orbitron', sans-serif;
`;

const HoverInfoBox = styled.div`
  width: max-content;
  height: 95px;
  border-radius: 10px;
  ${layerA}
  border: 1px solid #1B2B44;

  ${flexDirectionColumn}
  padding: 6px;

  position: absolute;
  top: -85px;
  left: 30px;
  z-index: 100;
`;
const InfoSpan = styled.span`
  font-size: 14px;
  letter-spacing: 1.4px;
  font-family: 'Orbitron', sans-serif;
`;
const GroupWrapper = styled.div`
  width: 100%;
  height: 60px;
  ${flexDirectionColumn}
`;
const Icon = styled.img`
  height: 16px;
  margin-right: 10px;
`;

const IconAndSwitchWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;
