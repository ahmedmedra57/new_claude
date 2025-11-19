import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  layerA180Deg,
  layerADisabled,
  layerADisabled180Deg,
  layerB,
  layerCDisabled,
} from '../../styles/commonStyles';

const ButtonCloseAndExpand = ({ name, tesSwitchFalse, disabled }) => {
  return (
    <Wrapper tesSwitchFalse={tesSwitchFalse} disabled={disabled}>
      <ButtonHole tesSwitchFalse={tesSwitchFalse} disabled={disabled}>
        <ButtonTop tesSwitchFalse={tesSwitchFalse} disabled={disabled}>
          <ButtonName tesSwitchFalse={tesSwitchFalse} disabled={disabled}>
            {name}
          </ButtonName>
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
  border-radius: 25px;
  padding: 0;

  border-radius: 37px;

  ${({ disabled }) =>
    disabled
      ? css`
          ${layerADisabled180Deg}
        `
      : css`
          ${layerA180Deg}
        `}
  ${flexBoxCenter}
`;

const ButtonHole = styled.div`
  width: 76px;
  height: 21px;

  border-radius: 20px;

  ${({ disabled }) =>
    disabled
      ? css`
          ${layerCDisabled}
        `
      : css`
          ${layerB}
        `}
  ${flexBoxCenter}
`;

const ButtonTop = styled.div`
  width: 74px;
  height: 19px;
  border-radius: 25px;

  ${({ disabled }) =>
    disabled
      ? css`
          ${layerADisabled180Deg}
        `
      : css`
          ${layerA180Deg}
        `}

  ${flexBoxCenter}
`;

const ButtonName = styled.span`
  font-size: 10rem;
  letter-spacing: 1px;
  color: #ffffff;
  opacity: 1;
  ${({ disabled }) =>
    disabled
      ? css`
          color: #808080;
        `
      : css`
          color: #ffffff;
        `}
`;
