import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  layerA180Deg,
  layerB,
} from '../../../styles/commonStyles';

const ClearApplyButton = ({
  name,
  handleClick,
  sysIndex,
  index,
  isButtonActive,
  buttonColor,
  isMobile,
  isAtsMobile,
}) => {
  const buttonHandler = () => {
    handleClick(sysIndex, index);
  };
  return (
    <>
      {isMobile || isAtsMobile ? (
        <Wrapper
          isMobile={true}
          onClick={buttonHandler}
          isAtsMobile={isAtsMobile}
        >
          <Button
            isButtonActive={isButtonActive}
            buttonColor={buttonColor}
            isMobile={true}
            isAtsMobile={isAtsMobile}
          >
            <ButtonHole isMobile={true} isAtsMobile={isAtsMobile}>
              <ButtonTop
                buttonColor={buttonColor}
                isMobile={true}
                isAtsMobile={isAtsMobile}
              >
                <ButtonName isMobile={true} isAtsMobile={isAtsMobile}>
                  {name}
                </ButtonName>
              </ButtonTop>
            </ButtonHole>
          </Button>
        </Wrapper>
      ) : (
        <Wrapper onClick={buttonHandler}>
          <Button isButtonActive={isButtonActive} buttonColor={buttonColor}>
            <ButtonHole>
              <ButtonTop buttonColor={buttonColor}>
                <ButtonName>{name}</ButtonName>
              </ButtonTop>
            </ButtonHole>
          </Button>
        </Wrapper>
      )}
    </>
  );
};

export default ClearApplyButton;

const Wrapper = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 130px;
          height: 54px;
          ${({ isAtsMobile }) =>
            isAtsMobile &&
            css`
              width: 126px;
              height: 39px;
            `}
        `
      : css`
          width: 84px;
          height: 29px;
        `}
  cursor: pointer;

  ${layerB}
  border-radius: 27px;
  ${flexBoxCenter}
`;

const Button = styled.button`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 128px;
          height: 52px;
          ${({ isAtsMobile }) =>
            isAtsMobile &&
            css`
              width: 124px;
              height: 37px;
            `}
        `
      : css`
          width: 82px;
          height: 27px;
        `}

  ${layerA180Deg}
  border-radius: 27px;
  ${({ isButtonActive }) =>
    isButtonActive &&
    css`
      border: 1px solid #95ff45;
    `}

  ${({ buttonColor }) =>
    buttonColor &&
    css`
      background: transparent linear-gradient(180deg, #1e7fc1 0%, #001640 100%);
      border: none;
    `}
border-radius: 25px;
  ${flexBoxCenter}
`;

const ButtonHole = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 118px;
          height: 42px;
          ${({ isAtsMobile }) =>
            isAtsMobile &&
            css`
              width: 114px;
              height: 27px;
            `}
        `
      : css`
          width: 76px;
          height: 21px;
        `}

  ${layerB}

  border-radius: 20px;
  opacity: 1;
  ${flexBoxCenter}
`;

const ButtonTop = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 116px;
          height: 40px;
          ${({ isAtsMobile }) =>
            isAtsMobile &&
            css`
              width: 112px;
              height: 25px;
            `}
        `
      : css`
          width: 74px;
          height: 19px;
        `}

  ${layerA180Deg}
  ${({ buttonColor }) =>
    buttonColor &&
    css`
      background: transparent linear-gradient(180deg, #1e7fc1 0%, #001640 100%);
    `}
  border-radius: 25px;
  opacity: 1;
  ${flexBoxCenter}
`;

const ButtonName = styled.span`
  ${({ isMobile }) =>
    isMobile
      ? css`
          font-size: 14px;
          letter-spacing: 1.4px;
          ${({ isAtsMobile }) =>
            isAtsMobile &&
            css`
              font-size: 12px;
              letter-spacing: 1.2px;
            `}
        `
      : css`
          font-size: 10px;
          letter-spacing: 1px;
        `}
`;
