import styled from 'styled-components';
import SubheaderBox from '../SubheaderBox';
import CustomLegend from './CustomLegend';
import {
  flexBoxCenter,
  layerHPA,
  layerHPB,
} from '../../../../styles/commonStyles';
import GraphDisplay from './GraphDisplay';

const Graph = () => {
  return (
    <Wrapper>
      <FirstLayer>
        <SubheaderBox
          title={'mbta - blue hill transit station boston, massachusetts'}
          secondTitle={'heater temperature vs time'}
          customCss={{ height: '36px', width: '860px', borderRadius: '6px' }}
          fontSize={'10px'}
        />
        <GraphDisplay />
        <CustomLegend />
      </FirstLayer>
    </Wrapper>
  );
};

export default Graph;

const Wrapper = styled.section`
  width: 875px;
  height: 220px;

  border-radius: 10px 10px 20px 20px;
  ${layerHPA}
  /* background: #233a54;
  box-shadow: 0px 0px 2px 0px #000 inset; */
  ${flexBoxCenter}
`;

const FirstLayer = styled.div`
  width: 869px;
  height: 216px;
  ${layerHPB}
  /* background: #142033 0% 0% no-repeat padding-box;
  box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
  border: 0.5px solid #000000; */
  border-radius: 9px 9px 18px 18px;

  ${flexBoxCenter}
  flex-direction: column;
  gap: 4px;
`;
