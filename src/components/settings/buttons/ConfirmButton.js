import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  layerA180Deg,
  layerADark,
  layerB,
  layerBDark,
} from '../../styles/commonStyles';

function ConfirmButton({ name, buttonColor, handleClick, editState }) {
  return (
    <Wrapper
      onClick={() => {
        editState && handleClick();
      }}
    >
      <Button color={buttonColor}>
        <ButtonHole>
          <ButtonTop color={buttonColor}>
            <ButtonName>{name}</ButtonName>
          </ButtonTop>
        </ButtonHole>
      </Button>
    </Wrapper>
  );
}

export default ConfirmButton;

const Wrapper = styled.div`
  width: 120px;
  height: 36px;

  ${layerBDark}
  border-radius: 26px;
  opacity: 1;
  ${flexBoxCenter}
`;

const Button = styled.button`
  cursor: pointer;
  width: 118px;
  height: 34px;

  ${layerA180Deg}

  opacity: 1;
  border-radius: 25px;

  ${flexBoxCenter}
`;

const ButtonHole = styled.div`
  width: 112px;
  height: 28px;

  ${layerB}
  /* border-color: #707070; */
  border-radius: 22px;
  opacity: 1;

  ${flexBoxCenter}
`;

const ButtonTop = styled.div`
  width: 108px;
  height: 24px;
  border-radius: 20px;

  ${layerA180Deg}

  display: flex;
  align-items: center;
  justify-content: center;
`;

const ButtonName = styled.span`
  display: inline-block;
  font-size: var(--space1);
  text-transform: uppercase;
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 1px;
  color: #ffffff;
  opacity: 1;
`;
