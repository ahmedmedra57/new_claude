import styled from 'styled-components';
import GreenInfoBox from '../../../common/GreenInfoBox';
import {
  justifyContentFlexEnd,
  justifyContentFlexStart,
} from '../../../../styles/commonStyles';

const OverSightTitleInfo = () => {
  // example data
  const numZones = 42;
  return (
    <>
      <FlexStart>
        <Text>heated platform over sight</Text>
      </FlexStart>
      <FlexEnd>
        <Text>{numZones} zones</Text>
        <GreenInfoBox energyType={'energy'} data={'0'} energyUnit={'kw'} />
        <GreenInfoBox data={'0'} />
      </FlexEnd>
    </>
  );
};

export default OverSightTitleInfo;

const FlexStart = styled.div`
  width: 50%;
  height: 100%;
  margin-left: 10px;
  ${justifyContentFlexStart}
`;
const FlexEnd = styled.div`
  width: 50%;
  height: 100%;
  margin-right: 3px;
  ${justifyContentFlexEnd}
  gap:16px;
`;

const Text = styled.p`
  font-size: 12px;
  letter-spacing: 1.2px;
`;
