import styled, { css } from 'styled-components';
import {
  ButtonReady,
  flexBoxCenter,
  layerA180Deg,
  layerB,
} from '../../styles/commonStyles';
import { useMediaQuery } from 'react-responsive';

const ActivateButton = ({
  handleButtons,
  isSelected,
  buttonTitles,
  isApplied,
  selectedOne,
  handleOpenMessageBox,
}) => {
  // media query
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });
  return (
    <ButtonBaseLayer
      onClick={selectedOne ? handleButtons : handleOpenMessageBox}
      isMobile={isMobile}
    >
      <ButtonWrapper
        isMobile={isMobile}
        isActivate={isSelected && !isApplied}
        buttonName={buttonTitles[1]}
        isApplied={isApplied && isSelected}
      >
        <ButtonIndent isMobile={isMobile}>
          <ButtonTop
            isMobile={isMobile}
            buttonName={buttonTitles[1]}
            isApplied={isApplied && isSelected}
          >
            <Title isMobile={isMobile}>
              {isSelected ? buttonTitles[1] : buttonTitles[0]}
            </Title>
          </ButtonTop>
        </ButtonIndent>
      </ButtonWrapper>
    </ButtonBaseLayer>
  );
};

export default ActivateButton;

const ButtonBaseLayer = styled.div`
  cursor: pointer;

  ${({ isMobile }) =>
    isMobile
      ? css`
          height: 34px;
          width: 98px;
        `
      : css`
          height: 29px;
          width: 113px;
        `}

  border-radius: 27px;
  ${layerB}

  ${flexBoxCenter}
`;

const ButtonWrapper = styled.button`
  ${({ isMobile }) =>
    isMobile
      ? css`
          height: 32px;
          width: 96px;
        `
      : css`
          height: 27px;
          width: 111px;
        `}

  border-radius: 25px;

  ${layerA180Deg}

  ${flexBoxCenter}

  ${({ isActivate }) =>
    isActivate &&
    css`
      border: 1px solid #95ff45;
    `}
        
  ${({ isApplied, buttonName }) =>
    buttonName === 'deactivated' && isApplied
      ? css`
          ${ButtonReady}
        `
      : buttonName === 'activated' &&
        isApplied &&
        css`
          background: transparent
            linear-gradient(180deg, #ff920c 0%, #804906 100%) 0% 0% no-repeat
            padding-box;
          box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
          border: 0.5px solid #000000;
        `}
`;

const ButtonIndent = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 88px;
          height: 24px;
          border-radius: 18px;
        `
      : css`
          width: 105px;
          height: 21px;
          border-radius: 20px;
        `}

  ${layerB}

  ${flexBoxCenter}
`;

const ButtonTop = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 86px;
          height: 22px;
        `
      : css`
          width: 103px;
          height: 19px;
        `}

  ${layerA180Deg}

  border-radius: 25px;

  ${flexBoxCenter}

  ${({ isApplied, buttonName }) =>
    buttonName === 'deactivated' && isApplied
      ? css`
          ${ButtonReady}
        `
      : buttonName === 'activated' &&
        isApplied &&
        css`
          background: transparent
            linear-gradient(180deg, #ff920c 0%, #804906 100%) 0% 0% no-repeat
            padding-box;
          box-shadow: inset 0px 0.5px 1px #ffffff24, 0px 0px 1px #000000;
          border: 0.5px solid #000000;
        `}
`;

const Title = styled.p`
  ${({ isMobile }) =>
    isMobile
      ? css`
          font-size: 8px;
        `
      : css`
          font-size: 10px;
        `}

  letter-spacing: 1px;
`;
