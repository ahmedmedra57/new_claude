import styled, { css } from 'styled-components';
import {
  alignItemsFlexStart,
  borderBlue,
  flexBoxCenter,
  justifyContentFlexStart,
  justifyContentSpaceEvenly,
} from '../../../../../styles/commonStyles';
import { useState } from 'react';

const DropBox = ({ openDropBoxHandler, selectThermocoupleHandler }) => {
  const dropBoxContent = ['t/c - 01', 't/c - 02', 't/c - 03'];

  const [trackSelection, setTrackSelection] = useState();

  const selectHandler = (idx) => {
    setTrackSelection(idx);
    // openDropBoxHandler();
    selectThermocoupleHandler(dropBoxContent[idx]);
  };

  return (
    <Wrapper>
      <FlexBox>
        {dropBoxContent.map((el, idx) => (
          <SelectionBox key={idx} onClick={() => selectHandler(idx)}>
            <OuterGreenCircle>
              <InnerGreenCircle
                isOn={idx === trackSelection}
              ></InnerGreenCircle>
            </OuterGreenCircle>
            <Text>{el}</Text>
          </SelectionBox>
        ))}
      </FlexBox>
      <Button onClick={openDropBoxHandler}>
        <Img alt='white-triangle' src='/images/hp-ArrowDown-button.svg' />
      </Button>
    </Wrapper>
  );
};

export default DropBox;

const Wrapper = styled.div`
  width: 76px;
  height: 52px;

  border-radius: 9px;
  ${borderBlue}
  /* border: 1px solid #233a54; */
  background: #060d19;
  ${alignItemsFlexStart}
  gap:7px;
`;

const FlexBox = styled.div`
  width: 62%;
  margin-top: 1px;
  ${justifyContentSpaceEvenly}
  flex-direction: column;
  gap: 6px;
`;

const SelectionBox = styled.div`
  width: 52px;
  height: 12px;

  border-radius: 10px;
  ${borderBlue}
  /* border: 1px solid #233a54; */
  ${justifyContentSpaceEvenly}
`;

const OuterGreenCircle = styled.div`
  width: 6px;
  height: 6px;

  border-radius: 9px;
  border: 1px solid #95ff45;
  ${flexBoxCenter}
`;
const InnerGreenCircle = styled.div`
  width: 3px;
  height: 3px;

  border-radius: 50%;

  ${({ isOn }) =>
    isOn &&
    css`
      background-color: #95ff45;
    `}
`;

const Text = styled.p`
  font-size: 8px;
`;

const Button = styled.button`
  margin-top: 4px;
  ${flexBoxCenter}
`;

const Img = styled.img``;
