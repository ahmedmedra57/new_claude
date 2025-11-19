import styled, { css } from 'styled-components';
import {
  borderBlue,
  justifyContentSpaceAround,
  justifyContentSpaceBetween,
} from '../../../../styles/commonStyles';
import SegmentContent from '../segment/segmentContent';

const Zone = ({ id, consumption, title, usage, isOn }) => {
  return (
    <BorderLine>
      <FlexWrapper>
        <SegmentContent
          id={id}
          title={title}
          consumption={consumption}
          usage={usage}
          isOn={isOn}
        />
      </FlexWrapper>
    </BorderLine>
  );
};

export default Zone;

const BorderLine = styled.div`
  width: 1138px;
  height: 30px;

  border-radius: 15px;
  ${borderBlue}
  /* border: 1px solid #233a54; */

  ${justifyContentSpaceBetween}
`;

const FlexWrapper = styled.div`
  width: 100%;
  height: 100%;
  ${justifyContentSpaceAround}
`;
