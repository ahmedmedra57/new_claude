import styled from 'styled-components';
import {
  flexBoxCenter,
  justifyContentSpaceAround,
  justifyContentSpaceBetween,
  justifyContentSpaceEvenly,
  layerHPA,
  layerHPE,
} from '../../../../styles/commonStyles';

const CustomLegend = () => {
  return (
    <Wrapper>
      <InnerLayer>
        <SecondInnerLayer>
          <Flex>
            <Title>legend:</Title>
          </Flex>
          <Flex>
            <DotHT></DotHT>
            <TempHT>ht-heater temperature</TempHT>
          </Flex>
          <Flex>
            <DotET></DotET>
            <TempET>et-enclose temperature</TempET>
          </Flex>
          <Flex>
            <DotOT></DotOT>
            <TempOT>ot-outside temperature</TempOT>
          </Flex>
        </SecondInnerLayer>
      </InnerLayer>
    </Wrapper>
  );
};

export default CustomLegend;

const Wrapper = styled.div`
  width: 866px;
  height: 28px;

  border-radius: 14px;
  ${layerHPA}
  /* background: #233a54;
  box-shadow: 0px 0px 2px 0px #000 inset; */
  ${flexBoxCenter}
`;

const InnerLayer = styled.div`
  width: 862px;
  height: 26px;

  border-radius: 12px;
  ${layerHPE}
  /* border: 0.5px solid #000;
  background: linear-gradient(
    180deg,
    #233a54 0%,
    #060d19 100%,
    #060d19 100%,
    #060d19 100%
  );
  box-shadow: 0px 0px 2px 0px #000; */

  ${flexBoxCenter}
`;
const SecondInnerLayer = styled.div`
  width: 856px;
  height: 22px;

  border-radius: 10px;
  ${layerHPA}
  /* background: #233a54;
  box-shadow: 0px 0px 2px 0px #000 inset; */

  ${justifyContentSpaceBetween}
`;

const Title = styled.span`
  font-size: 8px;
  text-align: center;
`;

const Flex = styled.div`
  ${flexBoxCenter}
  :last-child {
    margin-right: 10px;
  }
  :first-child {
    margin-left: 10px;
  }
`;

const TempHT = styled(Title)`
  color: #ff7800;
`;
const TempET = styled(Title)`
  color: #4baf00;
`;
const TempOT = styled(Title)`
  color: #2b6fc1;
`;

const Dot = styled.div`
  width: 6px;
  height: 6px;
  margin-right: 2px;
  border-radius: 50%;
`;

const DotHT = styled(Dot)`
  background-color: #ff7800;
`;
const DotET = styled(Dot)`
  background-color: #4baf00;
`;
const DotOT = styled(Dot)`
  background-color: #2b6fc1;
`;
