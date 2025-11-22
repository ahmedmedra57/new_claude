import React from 'react';
import { useState } from 'react';
import styled, { css } from 'styled-components';
import {
  borderABlue,
  flexBoxCenter,
  justifyContentFlexStart,
  selectionCircleBorder,
} from '../../../../styles/commonStyles';

const IndividualSelectionUL = ({
  title,
  isStation,
  viewSegmentsHandler,
  stationIdx,
  segmentIdx,
  isSelected,
  selectionGreenButtonHandler,
}) => {
  // const [select, setSelect] = useState(false);

  // const selectionHandler = () => {

  // };

  return (
    <Wrapper>
      <GreenCircle
        onClick={() =>
          selectionGreenButtonHandler(isStation, stationIdx, segmentIdx)
        }
      >
        <InsideCircle isOn={isSelected}></InsideCircle>
      </GreenCircle>
      {isStation && (
        <Button onClick={() => viewSegmentsHandler(stationIdx)}>
          <img src='/images/hp-arrowDown-button.svg' alt='white arrow down' />
        </Button>
      )}
      <Title isStation={isStation}>{title}</Title>
    </Wrapper>
  );
};

export default IndividualSelectionUL;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  /* border: 1px solid var(--DARK-BLUE, #142033); */
  ${borderABlue}

  ${justifyContentFlexStart}
`;

const GreenCircle = styled.button`
  height: 12px;
  width: 12px;
  margin-left: 3px;
  border-radius: 50%;
  ${selectionCircleBorder}
  /* border: 1px solid rgba(149, 255, 69, 1); */
  ${flexBoxCenter}
`;

const InsideCircle = styled.div`
  height: 8px;
  width: 8px;
  border-radius: 50%;

  ${({ isOn }) =>
    isOn
      ? css`
          background-color: rgba(149, 255, 69, 1);
        `
      : css`
          background-color: transparent;
        `}
`;

const Button = styled.button`
  margin-left: 6px;
`;

const Title = styled.p`
  ${({ isStation }) =>
    isStation
      ? css`
          margin-left: 6px;
          font-size: 12px;
        `
      : css`
          margin-left: 36px;
          font-size: 10px;
        `}
`;
