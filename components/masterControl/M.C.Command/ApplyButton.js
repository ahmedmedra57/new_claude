import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  justifyContentSpaceBetween,
  layerA,
  layerA180Deg,
  layerADark,
} from '../../styles/commonStyles';

function ApplyButton({ title, handleButton }) {
  return (
    <>
      <Wrapper>
        <Button onClick={(e) => handleButton && handleButton(e)}>
          <IndentButton>
            <ButtonTop>
              <ButtonTitle>{title}</ButtonTitle>
            </ButtonTop>
          </IndentButton>
        </Button>
      </Wrapper>
    </>
  );
}

export default ApplyButton;

const Wrapper = styled.div`
  width: 288px;
  height: 28px;

  ${layerADark}

  border-radius: 14px;
  opacity: 1;
  ${justifyContentSpaceBetween}
  flex-direction: row;
`;

const Button = styled.button`
  width: 286px;
  height: 26px;

  ${layerA180Deg}

  border-radius: 25px;
  opacity: 1;
  ${flexBoxCenter}
  &:first-child {
    margin-left: 1px;
  }
  &:last-child {
    margin-right: 1px;
  }
`;

const IndentButton = styled.div`
  width: 280px;
  height: 18px;

  ${layerA}
  border-radius: 18px;
  opacity: 1;
  ${flexBoxCenter}
`;

const ButtonTop = styled.div`
  width: 278px;
  height: 16px;

  ${layerA180Deg}

  border-radius: 25px;
  opacity: 1;
  ${flexBoxCenter}
`;

const ButtonTitle = styled.div`
  text-align: center;
  font-size: 10px;
  letter-spacing: 1px;
  color: #ffffff;
  opacity: 1;
`;
