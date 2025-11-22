import styled, { css } from 'styled-components';
import { flexBoxCenter, layerA180Deg, layerB } from '../../styles/commonStyles';
import { useMediaQuery } from 'react-responsive';

const SaveButton = ({ handleSave, buttonTitle, isActivate }) => {
  // media query
  const isMobile = useMediaQuery({ query: '(max-width:600px)' });

  return (
    <ButtonBaseLayer onClick={handleSave} isMobile={isMobile}>
      <ButtonWrapper isMobile={isMobile} isActivate={isActivate}>
        <ButtonIndent isMobile={isMobile}>
          <ButtonTop isMobile={isMobile}>
            <Title isMobile={isMobile}>{isActivate ? 'saved' : 'save'}</Title>
          </ButtonTop>
        </ButtonIndent>
      </ButtonWrapper>
    </ButtonBaseLayer>
  );
};

export default SaveButton;

const ButtonBaseLayer = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          height: 34px;
        `
      : css`
          height: 29px;
        `}

  width: 84px;
  border-radius: 27px;
  ${layerB}

  ${flexBoxCenter}
`;

const ButtonWrapper = styled.button`
  ${({ isMobile }) =>
    isMobile
      ? css`
          height: 32px;
        `
      : css`
          height: 27px;
        `}

  width: 82px;
  border-radius: 25px;

  ${layerA180Deg}

  ${flexBoxCenter}

  ${({ isActivate }) =>
    isActivate &&
    css`
      border: 1px solid #95ff45;
    `}
`;

const ButtonIndent = styled.div`
  ${({ isMobile }) =>
    isMobile
      ? css`
          width: 74px;
          height: 24px;
          border-radius: 18px;
        `
      : css`
          width: 76px;
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
          width: 72px;
          height: 22px;
        `
      : css`
          width: 74px;
          height: 19px;
        `}

  ${layerA180Deg}

  border-radius: 25px;

  ${flexBoxCenter}
`;

const Title = styled.p`
  font-size: 10px;
  letter-spacing: 1px;
`;
