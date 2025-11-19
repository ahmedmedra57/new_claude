import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  layerA180Deg,
  layerADisabled180Deg,
  layerB,
  layerCDisabled,
} from '../../styles/commonStyles';

const ButtonCloseAndExpand = ({ name, isActive }) => {
  return (
    <Wrapper isActive={isActive}>
      <ButtonHole isActive={isActive}>
        <ButtonTop isActive={isActive}>
          <ButtonName isActive={isActive}>{name}</ButtonName>
        </ButtonTop>
      </ButtonHole>
    </Wrapper>
  );
};

export default ButtonCloseAndExpand;

const Wrapper = styled.button`
  cursor: pointer;
  width: 82px;
  height: 27px;
  padding: 0;

  border-radius: 23px;

  ${({ isActive }) =>
    isActive
      ? css`
          ${layerA180Deg}
        `
      : css`
          ${layerADisabled180Deg}
        `}

  ${flexBoxCenter}
`;

const ButtonHole = styled.div`
  width: 76px;
  height: 21px;

  border-radius: 20px;

  ${({ isActive }) =>
    isActive
      ? css`
          ${layerB}
        `
      : css`
          ${layerCDisabled}
        `}
  ${flexBoxCenter}
`;

const ButtonTop = styled.div`
  width: 74px;
  height: 19px;
  border-radius: 25px;

  ${({ isActive }) =>
    isActive
      ? css`
          ${layerA180Deg}
        `
      : css`
          ${layerADisabled180Deg}
        `}

  ${flexBoxCenter}
`;

const ButtonName = styled.span`
  font-size: 10rem;
  letter-spacing: 1px;
  opacity: 1;

  ${({ isActive }) =>
    isActive
      ? css`
          color: #ffffff;
        `
      : css`
          color: #808080;
        `}
`;
