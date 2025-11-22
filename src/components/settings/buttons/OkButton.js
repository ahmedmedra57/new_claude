import styled from 'styled-components';
import {
  flexBoxCenter,
  layerA180Deg,
  layerADark,
  layerB,
} from '../../styles/commonStyles';

const OkButton = ({ name, handleClose }) => {
  return (
    <WrapperHole onClick={(e) => handleClose(e)}>
      <ButtonOuter>
        <ButtonInnerHole>
          <ButtonTop>
            <Title>{name}</Title>
          </ButtonTop>
        </ButtonInnerHole>
      </ButtonOuter>
    </WrapperHole>
  );
};
export default OkButton;

const WrapperHole = styled.button`
  width: 74px;
  height: 27px;

  ${layerADark}

  border-radius: 18px;

  ${flexBoxCenter}

  margin-left: 0.3rem;
`;
const ButtonOuter = styled.div`
  width: 72px;
  height: 25px;

  ${layerA180Deg}

  border-radius: 25px;

  ${flexBoxCenter}
`;
const ButtonInnerHole = styled.div`
  width: 64px;
  height: 17px;

  ${layerB}

  border-radius: 18px;

  ${flexBoxCenter}
`;
const ButtonTop = styled.div`
  width: 62px;
  height: 15px;

  ${layerA180Deg}

  border-radius: 25px;

  ${flexBoxCenter}
`;
const Title = styled.span`
  font-size: 8px;
`;
