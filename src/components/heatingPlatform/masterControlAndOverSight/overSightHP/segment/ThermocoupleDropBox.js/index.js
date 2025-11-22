import styled, { css } from 'styled-components';
import {
  borderBlue,
  flexBoxCenter,
  justifyContentSpaceEvenly,
} from '../../../../../styles/commonStyles';
import { useState } from 'react';
import DropBox from './DropBox';

const ThermocoupleDropBox = () => {
  const [thermocouple, setThermocouple] = useState('t/c - 01');
  const [arrowState, setArrowState] = useState(false);
  const [arrowButtonImg, setArrowButtonImg] = useState(
    '/images/hp-ArrowRight-button.svg'
  );

  const selectThermocoupleHandler = (el) => {
    setThermocouple(el);
  };

  const arrowButtonHandler = () => {
    setArrowState((prev) => !prev);
    // if (!arrowState) {
    //   setArrowButtonImg('/images/hp-ArrowDown-button.svg');
    // } else {
    //   setArrowButtonImg('/images/hp-ArrowRight-button.svg');
    // }
  };

  return (
    <Wrapper>
      <Text>select t/c</Text>
      <SelectionBox>
        <TextBox>
          <Text>{thermocouple}</Text>
        </TextBox>
        <Button onClick={arrowButtonHandler} id='arrow'>
          <Img src={'/images/hp-ArrowRight-button.svg'} alt='arrow button' />
        </Button>
      </SelectionBox>
      {arrowState && (
        <DropBoxWrapper>
          <DropBox
            openDropBoxHandler={arrowButtonHandler}
            selectThermocoupleHandler={selectThermocoupleHandler}
          />
        </DropBoxWrapper>
      )}
    </Wrapper>
  );
};

export default ThermocoupleDropBox;

const Wrapper = styled.div`
  width: 176px;
  height: 20px;

  border-radius: 13px;
  ${borderBlue}
  /* border: 1px solid #233a54; */
  ${justifyContentSpaceEvenly}
  position: relative;
`;

const Text = styled.span`
  font-size: 8px;
`;

const TextBox = styled.div`
  width: 44px;
  height: 12px;

  border-radius: 10px;
  ${borderBlue}
  /* border: 1px solid #233a54; */
  ${flexBoxCenter}
`;

const SelectionBox = styled.div`
  width: 64px;
  /* width: 76px; */
  height: 16px;

  border-radius: 12px;
  ${borderBlue}
  /* border: 1px solid #233a54; */

  ${flexBoxCenter}
  gap:2px
`;

const Button = styled.button`
  margin-right: 2px;
  ${flexBoxCenter}
`;

const Img = styled.img``;

const DropBoxWrapper = styled.div`
  right: -1px;
  top: -2px;
  position: absolute;
  z-index: 2;
`;
