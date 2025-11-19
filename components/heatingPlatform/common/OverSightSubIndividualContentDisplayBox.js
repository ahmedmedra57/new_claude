import styled, { css } from 'styled-components';
import {
  borderBlue,
  flexBoxCenter,
  justifyContentSpaceAround,
  justifyContentSpaceBetween,
} from '../../styles/commonStyles';

import SegmentContent from '../masterControlAndOverSight/overSightHP/segment/segmentContent';
import OverSightTitleInfo from '../masterControlAndOverSight/overSightHP/titleInfo';
import { useState } from 'react';
import Zone from '../masterControlAndOverSight/overSightHP/zone';

const OverSightSubIndividualContentDisplayBox = ({
  isMainTitle,
  isSegment,
  isZone,
  id,
  title,
  consumption,
  usage,
  isOn,
  trackOpeningsHandler,
  data,
  isSection,
}) => {
  const [trackZoneOpening, setTrackZoneOpening] = useState(false);

  const trackZoneOpeningsHandler = () => {
    setTrackZoneOpening((prev) => !prev);
  };

  return (
    <>
      <BorderLine isMainTitle={isMainTitle}>
        <FlexWrapper>
          {isMainTitle ? (
            <OverSightTitleInfo />
          ) : (
            <SegmentContent
              isZone={isZone}
              id={id}
              title={title}
              consumption={consumption}
              usage={usage}
              isOn={isOn}
              trackOpeningsHandler={
                isSegment ? trackOpeningsHandler : trackZoneOpeningsHandler
              }
              isSection={isSection}
              isSegment={isSegment}
            />
          )}
        </FlexWrapper>
      </BorderLine>
      {trackZoneOpening &&
        data?.map((section) => (
          <OverSightSubIndividualContentDisplayBox
            key={section.id}
            isSection={true}
            title={section.name}
            consumption={section.consumption}
            usage={section.usage}
            isOn={section.isOn}
          />
        ))}
    </>
  );
};

export default OverSightSubIndividualContentDisplayBox;

const BorderLine = styled.div`
  ${({ isMainTitle }) =>
    isMainTitle
      ? css`
          height: 28px;
        `
      : css`
          /* width: 1138px; */
          height: 30px;
          /* border-radius: 15px; */
        `}

  width: 1148px;
  border-radius: 13px;
  ${borderBlue}
  /* border: 1px solid #233a54; */

  ${justifyContentSpaceBetween}
`;

const FlexWrapper = styled.div`
  width: 100%;
  height: 100%;
  ${justifyContentSpaceAround}
`;
