import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  justifyContentSpaceEvenly,
  layerA,
  layerA180Deg,
  layerADark,
} from '../../styles/commonStyles';

function ViewCommandsSelectBox({ title, handleButton, openingSelectionBox }) {
  return (
    <ButtonHole>
      <Button>
        <IndentButton>
          <ButtonTitle>{title}</ButtonTitle>
        </IndentButton>
        <Img
          src={'/images/whiteArrowDown.svg'}
          // onClick={() => handleButton(!openingSelectionBox)}
          onClick={(e) => handleButton(0, e)}
        />
      </Button>
    </ButtonHole>
  );
}

export default ViewCommandsSelectBox;

const ButtonHole = styled.div`
  width: 288rem;
  height: 28rem;

  ${layerADark}

  border-radius: 14rem;
  opacity: 1;
  ${flexBoxCenter}
`;

const Button = styled.div`
  width: 286rem;
  height: 26rem;

  ${layerA180Deg}

  border-radius: 13rem;
  opacity: 1;
  ${justifyContentSpaceEvenly}
`;

const IndentButton = styled.div`
  width: 254rem;
  height: 18rem;

  ${layerA}

  border-radius: 18px;
  opacity: 1;
  ${flexBoxCenter}
`;

const Img = styled.img`
  margin-right: 2rem;
  cursor: pointer;
`;

const ButtonTitle = styled.p`
  text-align: center;
  font-size: 10rem;
  letter-spacing: 1rem;
  color: #ffffff;
  opacity: 1;
`;
