import styled from 'styled-components';
import {
  flexBoxCenter,
  layerA180Deg,
  layerADark,
  layerB,
  layerC,
  layerCLighter,
} from '../../../styles/commonStyles';

const MessageButton = ({ name, buttonHandler }) => {
  return (
    <WrapperHole onClick={buttonHandler}>
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
export default MessageButton;

const WrapperHole = styled.button`
  width: 74px;
  height: 27px;
  margin-left: 0.3rem;

  ${layerADark}

  border-radius: 18px;
  opacity: 1;

  ${flexBoxCenter}
`;
const ButtonOuter = styled.div`
  width: 72px;
  height: 25px;

  ${layerA180Deg}

  border-radius: 25px;
  opacity: 1;
  ${flexBoxCenter}
`;
const ButtonInnerHole = styled.div`
  width: 64px;
  height: 17px;

  ${layerCLighter}

  border-radius: 18px;
  opacity: 1;
  ${flexBoxCenter}
`;
const ButtonTop = styled.div`
  width: 62px;
  height: 15px;

  ${layerA180Deg}

  border-radius: 25px;
  opacity: 1;
  ${flexBoxCenter}
`;
const Title = styled.span`
  text-transform: uppercase;
  font-size: 8px;
`;
