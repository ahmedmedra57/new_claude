import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  layerA180Deg,
  layerC,
} from '../../../styles/commonStyles';

const SchedulerButton = ({ name, id, onClickHandler, isMobile }) => {
  return (
    <Wrapper
      onClick={() => onClickHandler(id)}
      isBig={id === '3'}
      isMobile={isMobile}
    >
      <ButtonHole isBig={id === '3'} isMobile={isMobile}>
        <ButtonTop isBig={id === '3'} isMobile={isMobile}>
          <ButtonName isMobile={isMobile}>{name}</ButtonName>
        </ButtonTop>
      </ButtonHole>
    </Wrapper>
  );
};

export default SchedulerButton;

const Wrapper = styled.button`
  width: 131px;
  height: 50px;
  border-radius: 25px;
  ${layerA180Deg};
  ${flexBoxCenter}
  ${(p) =>
    p.isBig &&
    css`
      width: 181px;
      height: 50px;
    `}

    ${(p) =>
    p.isMobile &&
    css`
      width: 96px;
      height: 32px;
      border-radius: 16px;
    `}
`;
const ButtonHole = styled.div`
  width: 116px;
  height: 36px;
  border-radius: 20px;

  ${layerC}
  ${flexBoxCenter}
  ${(p) =>
    p.isBig &&
    css`
      width: 166px;
      height: 36px;
    `}

    ${(p) =>
    p.isMobile &&
    css`
      width: 90px;
      height: 26px;
    `}
`;

const ButtonTop = styled.div`
  width: 113px;
  height: 34px;
  border-radius: 18px;

  ${layerA180Deg}

  ${flexBoxCenter}
  ${(p) =>
    p.isBig &&
    css`
      width: 164px;
      height: 34px;
      border-radius: 25px;
    `}

    ${(p) =>
    p.isMobile &&
    css`
      width: 88px;
      height: 24px;
    `}
`;

const ButtonName = styled.span`
  font-size: 14px;

  ${(p) =>
    p.isMobile &&
    css`
      font-size: 10px;
    `}
`;
