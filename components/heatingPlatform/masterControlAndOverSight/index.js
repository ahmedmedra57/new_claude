import React from 'react';
import styled from 'styled-components';
import {
  flexBoxCenter,
  justifyContentSpaceBetween,
  layerA,
  layerDegHPB,
  layerDegHPD,
} from '../../styles/commonStyles';
import HpMasterControl from './masterControl';
import OverSightHP from './overSightHP';
import StationMap from './viewStationInfo';

const HpMasterControlAndOverSight = ({ dataAccessKey }) => {
  return (
    <Wrapper>
      <InnerWrapper>
        <ControlWrapper>
          <ControlInnerWrapper>
            <HpMasterControl />
            <StationMap />
          </ControlInnerWrapper>
        </ControlWrapper>
        <OverSightWrapper>
          <OverSightInnerWrapper>
            <OverSightHP dataAccessKey={dataAccessKey} />
          </OverSightInnerWrapper>
        </OverSightWrapper>
      </InnerWrapper>
    </Wrapper>
  );
};

export default HpMasterControlAndOverSight;

const Wrapper = styled.section`
  width: 1202px;
  min-height: 946px;
  height: auto;
  padding: 2px;
  ${layerA}
  /* background: #233a54 0% 0% no-repeat padding-box;
  box-shadow: inset 0px 0px 3px #000000; */
  border-radius: 53px 53px 31px 31px;
  /* border-radius: 53px 53px 56px 56px; */
  /* border-radius: 55px 49px 52px 51px; */
  ${flexBoxCenter}
`;

const InnerWrapper = styled.div`
  width: 1196px;
  min-height: 928px;
  height: auto;

  padding-top: 5px;
  padding-bottom: 2px;

  ${layerDegHPB}

  /* background: transparent linear-gradient(180deg, #233a54 0%, #060d19 100%) 0%
    0% no-repeat padding-box;
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid #000000; */
  border-radius: 50px 50px 30px 30px;
  /* border-radius: 50px; */
  /* border-radius: 55px 49px 50px 50px; */
  ${justifyContentSpaceBetween}
  flex-direction: column;
  gap: 12px;
`;

const ControlWrapper = styled.section`
  width: 1184px;
  height: 722px;

  ${layerA}
  /* background: #233a54 0% 0% no-repeat padding-box;
  box-shadow: inset 0px 0px 3px #000000; */
  border-radius: 44px;

  ${flexBoxCenter}
`;

const ControlInnerWrapper = styled.div`
  width: 1178px;
  height: 716px;

  ${layerDegHPD}

  /* border: 0.5px solid #000;
  background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0.2) 100%
    ),
    linear-gradient(180deg, #233a54 0%, #233a54 44%, #060d19 100%); */
  border-radius: 42px;

  ${flexBoxCenter}
  gap:4px;
`;

const OverSightWrapper = styled.section`
  width: 1188px;
  min-height: 180px;
  /* min-height: 350px; */
  height: auto;

  padding-top: 3px;
  padding-bottom: 3px;

  border-radius: 27px;
  ${layerA}
  /* background: #233a54; */
  box-shadow: 0.5px 0.5px 1px 0px rgba(0, 0, 0, 0.62) inset;

  /* background: #1b2b44 0% 0% no-repeat padding-box;
  box-shadow: inset 0px 0px 3px #000000;
  border-radius: 27px; */
  ${flexBoxCenter}
`;

const OverSightInnerWrapper = styled.div`
  width: 1182px;
  min-height: 174px;
  /* min-height: 344px; */
  height: auto;

  border-radius: 25px;
  ${layerDegHPD}
  /* border: 0.5px solid #000;
  background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.2) 0%,
      rgba(0, 0, 0, 0.2) 100%
    ),
    linear-gradient(180deg, #233a54 0%, #233a54 44%, #060d19 100%); */
  box-shadow: 0.5px 0.5px 1px 0px rgba(255, 255, 255, 0.2) inset;

  ${flexBoxCenter}
`;
