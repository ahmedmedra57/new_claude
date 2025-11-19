import styled from 'styled-components';
import {
  flexBoxCenter,
  layerA180Deg,
  layerB,
} from '../../../styles/commonStyles';

function ValveConfirmButton({
  handleConfirm,
  buttonName,
  location,
  machine,
  handleClick,
}) {
  return (
    <Wrapper
      onClick={() => {
        handleConfirm(location, machine);
        handleClick(6);
      }}
    >
      <Wrapper1>
        <ButtonHole>
          <ButtonTop>
            <ButtonName>{buttonName}</ButtonName>
          </ButtonTop>
        </ButtonHole>
      </Wrapper1>
    </Wrapper>
  );
}

export default ValveConfirmButton;

const Wrapper = styled.div`
  width: 84px;
  height: 28px;

  ${layerB}

  border-radius: 27px;
  opacity: 1;
  ${flexBoxCenter}
`;

const Wrapper1 = styled.button`
  cursor: pointer;
  width: 82px;
  height: 26px;

  ${layerA180Deg}

  border-radius: 25px;
  opacity: 1;

  ${flexBoxCenter}
`;

const ButtonHole = styled.div`
  width: 76px;
  height: 20px;

  ${layerB}

  border-radius: 20px;
  opacity: 1;
  ${flexBoxCenter}
`;

const ButtonTop = styled.div`
  width: 74px;
  height: 18px;

  ${layerA180Deg}

  border-radius: 25px;
  opacity: 1;
  ${flexBoxCenter}
`;

const ButtonName = styled.span`
  font-size: 10rem;

  letter-spacing: 1px;
  color: #ffffff;
  opacity: 1;
  text-align: center;
`;
