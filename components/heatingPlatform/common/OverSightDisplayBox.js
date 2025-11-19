import styled, { css } from 'styled-components';
import { flexBoxCenter, layerA } from '../../styles/commonStyles';

import SegmentTitle from '../masterControlAndOverSight/overSightHP/segment/segmentTitle';
import OverSightIndividualContentDisplayBox from './OverSightIndividualContentDisplayBox';

const OverSightDisplayBox = ({
  isMainTitle,
  openingId,
  segNum,
  title,
  consumption,
  usage,
  isOn,
  dataAccessKey,
}) => {
  return (
    <Wrapper isMainTitle={isMainTitle}>
      {isMainTitle || <SegmentTitle num={segNum} />}
      <OverSightIndividualContentDisplayBox
        openingId={openingId}
        isMainTitle={isMainTitle}
        title={title}
        consumption={consumption}
        usage={usage}
        isOn={isOn}
        dataAccessKey={dataAccessKey}
      />
    </Wrapper>
  );
};

export default OverSightDisplayBox;

const Wrapper = styled.div`
  ${({ isMainTitle }) =>
    isMainTitle
      ? css`
          height: 36px;
          padding: 2px;
        `
      : css`
          height: auto;
          min-height: 60px;
          flex-direction: column;
          /* padding: 4px; */
          gap: 2px;
        `}

  width: 1156px;
  border-radius: 17px;
  ${layerA}
  /* background: #233a54;
  box-shadow: 0px 0px 2px 0px #000 inset; */

  ${flexBoxCenter}
`;
