import styled, { css } from 'styled-components';
import {
  borderBlue,
  flexBoxCenter,
  justifyContentSpaceBetween,
} from '../../styles/commonStyles';
import SingleSwitch from './SingleSwitch';

function SpecificLocation({
  locationName,
  specificLocationKey,
  specificLocationIdx,
  specificLocationName,
  switchesData,
  displaySpecificLocations,
  openSpecificLocationHandler,
  getApplicationAbrHandler,
}) {
  const buttonArrowDown = './images/whiteArrowDown.svg';
  const buttonArrowRight = './images/whiteArrowRight.svg';

  const showSpecificLocations = displaySpecificLocations[specificLocationIdx];
  const numOfSwitches = switchesData ? switchesData.length : 0;

  return (
    <Wrapper key={specificLocationKey}>
      <Wrapper1>
        <Div
          onClick={() => {
            openSpecificLocationHandler(specificLocationIdx);
          }}
        >
          <Img
            src={showSpecificLocations ? buttonArrowDown : buttonArrowRight}
          />
          <SpecificLocationName>{specificLocationName}</SpecificLocationName>
        </Div>
        <NbSwitches>{numOfSwitches} swt</NbSwitches>
      </Wrapper1>
      {showSpecificLocations &&
        switchesData.map((switchEl) => {
          const application = getApplicationAbrHandler(switchEl[1]);

          return (
            <WrapperSingleSwitch key={switchEl[0]}>
              <SingleSwitch
                location={specificLocationName}
                machineName={switchEl[1]?.machineName}
                application={application}
              />
            </WrapperSingleSwitch>
          );
        })}
    </Wrapper>
  );
}

export default SpecificLocation;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Wrapper1 = styled.div`
  width: 274px;
  height: 24px;

  ${borderBlue}
  border-radius: 16px;
  opacity: 1;
  ${justifyContentSpaceBetween}
`;

const Div = styled.div`
  width: auto;
  margin-left: 26px;
  ${flexBoxCenter}
`;

const Img = styled.img``;

const SpecificLocationName = styled.p`
  font-size: 8px;
  margin-left: 6px;
  letter-spacing: 0.8px;
  color: #ffffff;
  opacity: 1;
`;

const NbSwitches = styled.p`
  font-size: 8px;
  margin-right: 6px;
  letter-spacing: 0.8px;
  color: #ffffff;
  opacity: 1;
`;

const WrapperSingleSwitch = styled.div`
  width: 100%;
  height: 100%;
`;
