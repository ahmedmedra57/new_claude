import React from 'react';
import styled from 'styled-components';
import {
  flexBoxCenter,
  layerB,
  layerBMedium,
} from '../../../styles/commonStyles';
import StationTelemetry from './stationLiveTelemetry';
import EncloseTelemetry from './enclosureLiveTelemetry';
import Graph from './graph';
import Chart from './chart';
import SubheaderBox from './SubheaderBox';
import ControlButtons from './controlButtons';

const StationMap = () => {
  return (
    <Wrapper>
      <FirstLayer>
        <SubheaderBox
          title={'mbta - blue hill transit station boston, massachusetts'}
          customCss={{ height: '28px', width: '856px', borderRadius: '12px' }}
          fontSize={'12px'}
        />
        <ControlButtons />
        <Chart />
        <StationTelemetry />
        <EncloseTelemetry />
        <Graph />
      </FirstLayer>
    </Wrapper>
  );
};

export default StationMap;

const Wrapper = styled.section`
  width: 883px;
  height: 695px;

  ${layerBMedium}
  /* background: #1b2b44;
  box-shadow: inset 0px 0px 3px #000000; */
  border-radius: 28px 31px 34px 33px;

  ${flexBoxCenter}
`;

const FirstLayer = styled.div`
  width: 879px;
  height: 691px;

  background: transparent
    linear-gradient(90deg, #060d19 0%, #233a54 50%, #060d19 100%) 0% 0%
    no-repeat padding-box;
  box-shadow: inset 0px 0px 1px #ffffff29, 0px 0px 3px #000000;
  border: 0.5px solid #000000;
  border-radius: 26px 29px 32px 32px;
  ${flexBoxCenter}
  flex-direction: column;
  gap: 2px;
`;
