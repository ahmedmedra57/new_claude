import styled, { css } from 'styled-components';
import {
  flexBoxCenter,
  layerA180Deg,
  layerADisabled180Deg,
  layerB,
  layerBDisabled,
  layerC,
} from '../styles/commonStyles';

const ExpandButton = ({ handleOnClick, name, disabled }) => {
  return (
    <WrapperHole onClick={() => handleOnClick(name)} disabled={disabled}>
      <OuterWrapper disabled={disabled}>
        <InnerHole disabled={disabled}>
          <Top disabled={disabled}>
            <Title disabled={disabled}>{name}</Title>
          </Top>
        </InnerHole>
      </OuterWrapper>
    </WrapperHole>
  );
};

export default ExpandButton;

const WrapperHole = styled.button`
  width: 72px;
  height: 29px;
  border-radius: 27px;

  ${layerC}
  ${flexBoxCenter}

  ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled}
    `}
`;
const OuterWrapper = styled.div`
  width: 70px;
  height: 27px;
  border-radius: 25px;

  ${layerA180Deg}
  ${flexBoxCenter}
  ${(p) =>
    p.disabled &&
    css`
      ${layerADisabled180Deg}
    `}
`;
const InnerHole = styled.div`
  width: 64px;
  height: 21px;
  border-radius: 20px;

  ${layerB}
  ${flexBoxCenter}
  ${(p) =>
    p.disabled &&
    css`
      ${layerBDisabled}
    `}
`;
const Top = styled.div`
  width: 62px;
  height: 19px;
  border-radius: 25px;

  ${layerA180Deg}
  ${flexBoxCenter}
  ${(p) =>
    p.disabled &&
    css`
      ${layerADisabled180Deg}
    `}
`;

const Title = styled.span`
  font-size: 10px;
  ${(p) => p.disabled && css`
  color: #808080;
  `}
`;
