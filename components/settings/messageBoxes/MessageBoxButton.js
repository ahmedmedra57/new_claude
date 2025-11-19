import styled from 'styled-components';
import {
  layerADark,
  flexBoxCenter,
  layerA180Deg,
  layerCLighter,
} from '../../styles/commonStyles';

const MessageBoxButton = ({ name, buttonHandler }) => {
  return (
    <WrapperHole onClick={(e) => buttonHandler(e)}>
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
export default MessageBoxButton;

const WrapperHole = styled.button`
  width: 74px;
  height: 27px;
  border-radius: 18px;
  ${layerADark}
  ${flexBoxCenter}

  margin-left: 0.3rem;
`;
const ButtonOuter = styled.div`
  width: 72px;
  height: 25px;
  border-radius: 25px;

  ${layerA180Deg}
  ${flexBoxCenter}
`;
const ButtonInnerHole = styled.div`
  width: 64px;
  height: 17px;
  border-radius: 18px;

  ${layerCLighter}
  ${flexBoxCenter}
`;
const ButtonTop = styled.div`
  width: 62px;
  height: 15px;
  border-radius: 25px;
  ${layerA180Deg}
  ${flexBoxCenter}
`;
const Title = styled.span`
  font-size: 8px;
`;
