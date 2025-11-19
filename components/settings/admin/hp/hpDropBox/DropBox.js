import styled from 'styled-components';
import {
  buttonTopLayer,
  flexBoxCenter,
  hpBaseLayer,
  justifyContentFlexEnd,
  justifyContentFlexStart,
  justifyContentSpaceAround,
  justifyContentSpaceEvenly,
  layerA,
  layerDegHPB,
  layerHPA,
  scrollbarY,
} from '../../../../styles/commonStyles';
import { useState } from 'react';

import DropBoxButton from './DropBoxButton';
import IndividualSelectionUL from './IndividualSelectionUL';
import { useEffect } from 'react';

const DropBox = ({
  selectionHandler,
  closeDropBoxHandler,
  data,
  selection,
  setSelection,
  resetSelectionHandler,
  selectStations,
  selectSegments,
  selectionGreenButtonHandler,
}) => {
  const ButtonsTitle = ['clear', 'select'];

  const [openSegments, setOpenSegments] = useState([]);

  useEffect(() => {
    if (data.length > 0) {
      const segmentButtonState = data.map((_) => false);
      setOpenSegments(segmentButtonState);
    }
  }, []);

  const viewSegmentsHandler = (idx) => {
    const copyOpenSegments = [...openSegments];
    copyOpenSegments[idx] = copyOpenSegments[idx] ? false : true;
    setOpenSegments(copyOpenSegments);
  };

  const buttonsHandler = (title) => {
    switch (title) {
      case 'clear':
        resetSelectionHandler();
        break;
      case 'select':
        selectionHandler();
        break;
      default:
        break;
    }
  };

  return (
    <Wrapper>
      <Flex>
        <Selection>
          <Title>{selection}</Title>
        </Selection>
        <Button onClick={closeDropBoxHandler}>
          <img src='/images/whiteArrowDown.svg' alt='white arrow down' />
        </Button>
      </Flex>

      <List>
        {data?.map(({ key, stationTitle, segmentsTitle }, stationIdx) => (
          <FlexList key={key}>
            <UL>
              <IndividualSelectionUL
                isStation={true}
                viewSegmentsHandler={viewSegmentsHandler}
                title={stationTitle}
                stationIdx={stationIdx}
                isSelected={selectStations[stationIdx]}
                selectionGreenButtonHandler={selectionGreenButtonHandler}
              />
            </UL>
            {openSegments[stationIdx] &&
              segmentsTitle.map((segmentTitle, segmentIdx) => (
                <UL key={segmentTitle}>
                  <IndividualSelectionUL
                    title={segmentTitle}
                    isSelected={selectSegments[stationIdx][segmentIdx]}
                    stationIdx={stationIdx}
                    segmentIdx={segmentIdx}
                    selectionGreenButtonHandler={selectionGreenButtonHandler}
                  />
                </UL>
              ))}
          </FlexList>
        ))}
      </List>

      <ButtonWrapper>
        {ButtonsTitle.map((title) => (
          <DropBoxButton
            key={title}
            title={title}
            buttonsHandler={buttonsHandler}
          />
        ))}
      </ButtonWrapper>
    </Wrapper>
  );
};

export default DropBox;

const Wrapper = styled.div`
  min-height: 124px;
  max-height: 266px;
  /* height: 266px; */
  width: 418px;
  border-radius: 16px;
  /* background: var(
    --blue-gradation,
    linear-gradient(180deg, #233a54 0%, #060d19 100%)
  );

  box-shadow: 0px 0.5px 1px 0px rgba(255, 255, 255, 0.25) inset; */
  ${layerDegHPB}
  border: 1px solid #000;
  ${justifyContentSpaceEvenly}
  flex-direction: column;
  gap: 6px;
`;

const Flex = styled.div`
  width: 100%;
  ${justifyContentSpaceAround}
`;

const Button = styled.button`
  ${flexBoxCenter}
`;

const Selection = styled.div`
  width: 382px;
  height: 26px;
  margin-top: 4px;

  border-radius: 29px;
  ${layerA}
  /* background: #233a54;
  box-shadow: 0px 0px 3px 0px #000 inset; */

  ${justifyContentFlexStart}
`;

const Title = styled.p`
  margin-left: 6px;
  font-size: 14px;
`;

const List = styled.ul`
  min-height: 52px;
  max-height: 100%;
  width: 98%;
  padding-left: 4px;

  border-radius: 11px 8px 8px 11px;
  ${layerHPA}
  /* background: var(--LIGHT-BACKGROUND, #233a54);
  box-shadow: 0px 0px 2px 0px #000 inset; */

  ${scrollbarY}
  justify-content: flex-start;
  align-items: flex-start;
  gap: 4px;
  flex-direction: column;
`;

const FlexList = styled.div`
  width: 382px;
  ${justifyContentFlexStart}
  gap:4px;
  flex-direction: column;
  :last-child {
    margin-bottom: 4px;
  }
`;

const UL = styled.li`
  width: 100%;
  height: 20px;
  margin-top: 4px;
`;

// const SegmentsList = styled(StationsList)``;

const ButtonWrapper = styled.div`
  height: auto;
  width: 100%;

  margin-right: 6px;
  margin-bottom: 4px;

  ${justifyContentFlexEnd}
`;
